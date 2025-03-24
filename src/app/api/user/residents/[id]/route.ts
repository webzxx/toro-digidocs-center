import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import getSession from "@/lib/auth/getSession";

// GET a single resident by ID for the authenticated user
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = parseInt(session.user.id);
    const residentId = parseInt(params.id);

    // Fetch the resident and ensure it belongs to the authenticated user
    const resident = await db.resident.findFirst({
      where: {
        id: residentId,
        userId: userId,
      },
      include: {
        address: true,
        emergencyContact: true,
        proofOfIdentity: true,
      },
    });

    if (!resident) {
      return new NextResponse(JSON.stringify({ error: "Resident not found" }), {
        status: 404,
      });
    }

    return NextResponse.json(resident);
  } catch (error) {
    console.error("Error fetching resident:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to fetch resident" }), {
      status: 500,
    });
  }
}

// PATCH update a resident by ID for the authenticated user
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = parseInt(session.user.id);
    const residentId = parseInt(params.id);
    const data = await req.json();

    // First check if the resident exists and belongs to the user
    const existingResident = await db.resident.findFirst({
      where: {
        id: residentId,
        userId: userId,
      },
    });

    if (!existingResident) {
      return new NextResponse(JSON.stringify({ error: "Resident not found or access denied" }), {
        status: 404,
      });
    }

    // Extract the data for each related entity
    const { address, emergencyContact, ...residentData } = data;

    // Update the resident using a transaction to ensure all updates succeed or fail together
    const updatedResident = await db.$transaction(async (prisma) => {
      // Update resident main data
      const resident = await prisma.resident.update({
        where: { id: residentId },
        data: {
          firstName: residentData.firstName,
          middleName: residentData.middleName,
          lastName: residentData.lastName,
          email: residentData.email,
          contact: residentData.contact,
          // Only admins can update certain sensitive fields like status, sector, etc.
        },
      });

      // Update address if it exists
      if (address) {
        await prisma.address.update({
          where: { residentId: residentId },
          data: {
            blockLot: address.blockLot,
            phase: address.phase,
            street: address.street,
            subdivision: address.subdivision,
            yearsInBahayToro: typeof address.yearsInBahayToro === "string" 
              ? parseInt(address.yearsInBahayToro) 
              : address.yearsInBahayToro,
            // Residency type usually requires verification, so only allow admin to update
          },
        });
      }

      // Update emergency contact if it exists
      if (emergencyContact) {
        await prisma.emergencyContact.update({
          where: { residentId: residentId },
          data: {
            name: emergencyContact.name,
            relationship: emergencyContact.relationship,
            contact: emergencyContact.contact,
            address: emergencyContact.address,
          },
        });
      }

      return resident;
    });

    return NextResponse.json(updatedResident);
  } catch (error) {
    console.error("Error updating resident:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to update resident" }), {
      status: 500,
    });
  }
}

// DELETE a resident by ID for the authenticated user
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = parseInt(session.user.id);
    const residentId = parseInt(params.id);

    // Check if the resident exists and belongs to the user
    const existingResident = await db.resident.findFirst({
      where: {
        id: residentId,
        userId: userId,
      },
    });

    if (!existingResident) {
      return new NextResponse(JSON.stringify({ error: "Resident not found or access denied" }), {
        status: 404,
      });
    }

    // Check if there are any pending certificate requests
    const pendingRequests = await db.certificateRequest.findFirst({
      where: {
        residentId: residentId,
        status: {
          in: ["PENDING", "UNDER_REVIEW", "AWAITING_PAYMENT", "PROCESSING", "READY_FOR_PICKUP", "IN_TRANSIT"]
        }
      }
    });

    if (pendingRequests) {
      return new NextResponse(JSON.stringify({ 
        error: "Cannot delete resident with pending certificate requests"
      }), {
        status: 400,
      });
    }

    // Delete the resident - cascading will handle related records
    await db.resident.delete({
      where: { id: residentId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting resident:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to delete resident" }), {
      status: 500,
    });
  }
}