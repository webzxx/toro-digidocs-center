import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import getSession from "@/lib/auth/getSession";

export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    // Parse query parameters
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build where clause based on filters
    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (type && type !== "ALL") {
      where.certificateType = type;
    }
    
    // Add search functionality
    if (search && search.trim() !== "") {
      where.OR = [
        { referenceNumber: { contains: search, mode: "insensitive" } },
        {
          resident: {
            OR: [
              { bahayToroSystemId: { contains: search, mode: "insensitive" } },
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      ];
    }

    // Fetch certificates with pagination
    const certificates = await db.certificateRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        requestDate: "desc",
      },
      include: {
        resident: {
          select: {
            firstName: true,
            lastName: true,
            bahayToroSystemId: true,
          },
        },
        payments: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            paymentStatus: true,
            amount: true,
            paymentDate: true,
          },
        },
      },
    });

    // Get total count for pagination
    const total = await db.certificateRequest.count({ where });
    
    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    console.log("Certificates", certificates);

    return NextResponse.json({
      certificates,
      page,
      limit,
      total,
      totalPages,
    });
    
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificates" },
      { status: 500 },
    );
  }
}