"use server";

import { db } from "@/lib/db";
import getSession from "@/lib/auth/getSession";
import { AppointmentRequestInput, appointmentRequestSchema } from "@/types/types";

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
    const validatedData = appointmentRequestSchema.safeParse(values);

    if (!validatedData.success) {
      const err = validatedData.error.flatten();
      return { 
        success: false,
        fieldErrors: err.fieldErrors, 
      };
    }

    const { 
      appointmentType, 
      preferredDate, 
      preferredTimeSlot, 
      notes, 
      residentId, 
      certificateRequestId, 
    } = validatedData.data;

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

    // Create appointment request
    const appointment = await db.appointment.create({
      data: {
        userId: user.id, // Use the verified user ID
        appointmentType,
        preferredDate: new Date(preferredDate),
        preferredTimeSlot,
        notes,
        residentId: residentId || null,
        certificateRequestId: certificateRequestId || null,
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