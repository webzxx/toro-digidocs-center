"use server";

import { db } from "@/lib/db";
import getSession from "@/lib/auth/getSession";
import { AppointmentRequestInput, appointmentRequestSchema } from "@/types/forms";

export async function createAppointmentRequest(
  values: AppointmentRequestInput,
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return {
        success: false,
        serverError: "Unauthorized",
      };
    }

    // Validate incoming data against schema
    const validationResult = appointmentRequestSchema.safeParse(values);

    if (!validationResult.success) {
      const err = validationResult.error.flatten();
      return { 
        success: false,
        fieldErrors: err.fieldErrors, 
      };
    }

    const validatedData = validationResult.data;

    const { 
      appointmentType,  
      preferredTimeSlot, 
      notes, 
      residentId,
    } = validatedData;

    // Format date properly if it's a string
    let preferredDate: Date;
    if (typeof validatedData.preferredDate === "string") {
      preferredDate = new Date(validatedData.preferredDate);
    } else {
      preferredDate = validatedData.preferredDate;
    }
    
    // Set the appropriate time based on the selected time slot if it doesn't have a time component
    const hasTimeComponent = 
      preferredDate.getHours() !== 0 || 
      preferredDate.getMinutes() !== 0 || 
      preferredDate.getSeconds() !== 0;
    
    if (!hasTimeComponent) {
      if (validatedData.preferredTimeSlot === "MORNING") {
        preferredDate.setHours(8, 0, 0, 0); // 8:00 AM for morning
      } else {
        preferredDate.setHours(13, 0, 0, 0); // 1:00 PM for afternoon
      }
    }

    // Ensure the user exists in the database
    const userId = session.user.id;
    
    // Verify the user exists before attempting to create the appointment
    const user = await db.user.findUnique({
      where: { id: Number(userId) },
      select: { id: true },
    });
    
    if (!user) {
      return {
        success: false,
        serverError: "User not found. Please log in again.",
      };
    }

    // If a residentId is provided, verify that this resident belongs to the user
    if (residentId) {
      const resident = await db.resident.findUnique({
        where: { 
          id: residentId,
          userId: user.id,
        },
        select: { id: true },
      });

      if (!resident) {
        return {
          success: false,
          fieldErrors: {
            residentId: ["The selected resident is not valid or does not belong to you"],
          },
        };
      }
    }

    // Create appointment request
    const appointment = await db.appointment.create({
      data: {
        userId: user.id, // Use the verified user ID
        appointmentType,
        preferredDate,
        preferredTimeSlot,
        notes,
        residentId: residentId || null,
        // These fields will be set by admin later
        scheduledDateTime: null,
        status: "REQUESTED", // Default is REQUESTED from schema
      },
    });

    // Fetch the created appointment with the generated reference number
    const createdAppointment = await db.appointment.findUnique({
      where: { id: appointment.id },
      select: { 
        id: true,
        referenceNumber: true,
        appointmentType: true,
        preferredDate: true,
        preferredTimeSlot: true,
        status: true,
      },
    });

    // Return success response with appointment details
    return {
      success: true,
      data: createdAppointment,
    };
  } catch (error) {
    console.error("Error creating appointment request:", error);
    return {
      success: false,
      serverError: "Unable to process appointment request",
    };
  }
}

export async function cancelAppointment(id: number) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return {
        success: false,
        serverError: "Unauthorized",
      };
    }

    const appointment = await db.appointment.findUnique({
      where: { id },
      select: { userId: true, status: true },
    });

    // Check if appointment exists and belongs to the current user
    if (!appointment) {
      return {
        success: false,
        serverError: "Appointment not found",
      };
    }

    if (appointment.userId !== parseInt(session.user.id)) {
      return {
        success: false,
        serverError: "You can only cancel your own appointments",
      };
    }

    // Check if appointment is in a cancellable state
    if (appointment.status === "COMPLETED" || appointment.status === "CANCELLED") {
      return {
        success: false,
        serverError: `Cannot cancel an appointment that is already ${appointment.status.toLowerCase()}`,
      };
    }

    // Update appointment status to CANCELLED
    const updatedAppointment = await db.appointment.update({
      where: { id },
      data: {
        status: "CANCELLED",
      },
      select: {
        id: true,
        referenceNumber: true,
        status: true,
      },
    });

    return {
      success: true,
      data: updatedAppointment,
    };
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return {
      success: false,
      serverError: "Unable to cancel appointment",
    };
  }
}