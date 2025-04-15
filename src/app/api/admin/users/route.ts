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
    const role = searchParams.get("role");
    const search = searchParams.get("search");

    // Build where clause
    const where: any = {};
    
    if (role && role !== "ALL") {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { username: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Query users with filters and pagination
    const users = await db.user.findMany({
      where,
      take: limit,
      skip,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Count total users for pagination
    const total = await db.user.count({ where });
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ users, total, page, totalPages });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}