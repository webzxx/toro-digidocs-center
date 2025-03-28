import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import getSession from "@/lib/auth/getSession";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status");
    const method = searchParams.get("method");
    const search = searchParams.get("search");

    // Build where clause
    const where: any = {};
    
    if (status && status !== "ALL") {
      where.paymentStatus = status;
    }

    if (method && method !== "ALL") {
      where.paymentMethod = method;
    }

    if (search) {
      where.OR = [
        { transactionReference: { contains: search, mode: "insensitive" } },
        {
          certificateRequest: {
            OR: [
              { referenceNumber: { contains: search, mode: "insensitive" } },
              { resident: {
                OR: [
                  { firstName: { contains: search, mode: "insensitive" } },
                  { lastName: { contains: search, mode: "insensitive" } },
                  { bahayToroSystemId: { contains: search, mode: "insensitive" } },
                ],
              },
              },
            ],
          },
        },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Query payments with filters and pagination
    const payments = await db.payment.findMany({
      where,
      take: limit,
      skip,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        certificateRequest: {
          select: {
            referenceNumber: true,
            certificateType: true,
            resident: {
              select: {
                firstName: true,
                lastName: true,
                bahayToroSystemId: true,
              },
            },
          },
        },
      },
    });

    // Count total payments for pagination
    const total = await db.payment.count({ where });
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ payments, total, page, totalPages });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 },
    );
  }
}