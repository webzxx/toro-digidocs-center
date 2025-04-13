import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import getSession from "@/lib/auth/getSession";
import { AppointmentStatus, AppointmentType } from "@prisma/client";

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
    const date = searchParams.get("date");
    const search = searchParams.get("search");

    // Calculate pagination values
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};
    
    // Filter by status if provided and it's not "ALL"
    if (status && status !== "ALL") {
      where.status = status as AppointmentStatus;
    }

    // Filter by date if provided
    if (date) {
      const selectedDate = new Date(date);
      // Create date range for the selected date (start of day to end of day)
      const startDate = new Date(selectedDate);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(selectedDate);
      endDate.setHours(23, 59, 59, 999);
      
      // Apply date filter to scheduledDateTime or preferredDate
      where.OR = [
        {
          scheduledDateTime: {
            gte: startDate,
            lte: endDate,
          },
        },
        {
          // For appointment requests that aren't scheduled yet
          preferredDate: {
            gte: startDate,
            lte: endDate, 
          },
          scheduledDateTime: null,
        },
      ];
    }

    // Add search functionality
    if (search && search.trim() !== "") {
      where.OR = where.OR || [];
      where.OR.push(
        {
          resident: {
            OR: [
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
              { bahayToroSystemId: { contains: search, mode: "insensitive" } },
            ],
          },
        },
        { 
          referenceNumber: { contains: search, mode: "insensitive" }, 
        },
        {
          user: {
            OR: [
              { username: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      );
    }

    // Fetch appointments with pagination and relations
    const appointments = await db.appointment.findMany({
      where,
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
        resident: {
          select: {
            firstName: true,
            lastName: true,
            bahayToroSystemId: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: [
        // Show pending requests first (REQUESTED status will be alphabetically first)
        { status: "asc" },
        // Then show by scheduled date (soonest first) or creation date if not scheduled
        { scheduledDateTime: "asc" },
        { createdAt: "desc" },
      ],
    });

    // Count total appointments for pagination
    const total = await db.appointment.count({ where });
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ 
      appointments, 
      total, 
      page, 
      totalPages, 
    });
    
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 },
    );
  }
}