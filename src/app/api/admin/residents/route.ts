import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import getSession from "@/lib/getSession";

export async function GET(req: NextRequest) {
  try {
    // Check auth
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const gender = searchParams.get("gender");
    const status = searchParams.get("status");
    const sector = searchParams.get("sector");
    const search = searchParams.get("search");

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = {};
    
    // Filter by gender if provided
    if (gender && gender !== "ALL") {
      where.gender = gender;
    }
    
    // Filter by status if provided
    if (status && status !== "ALL") {
      where.status = status;
    }
    
    // Filter by sector if provided
    if (sector && sector !== "ALL") {
      where.sector = sector;
    }
    
    // Search by name or Bahay Toro ID
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { bahayToroSystemId: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get residents with pagination and filtering
    const residents = await db.resident.findMany({
      where,
      include: {
        address: true,
        emergencyContact: true,
        proofOfIdentity: true,
      },
      skip,
      take: limit,
      orderBy: {
        lastName: 'asc',
      },
    });

    // Get total count for pagination
    const total = await db.resident.count({ where });

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      residents,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching residents:", error);
    return new NextResponse(JSON.stringify({ error: "Error fetching residents" }), {
      status: 500,
    });
  }
}