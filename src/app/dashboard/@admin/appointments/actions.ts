"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { AppointmentStatus } from "@prisma/client";
import { appointmentRequestSchema, AppointmentRequestInput } from "@/types/types";

// Create a new appointment (admin)
export async function createAppointment(data: AppointmentRequestInput) {
  try {
    // Validate appointment data using the schema from types.ts
    const validationResult = appointmentRequestSchema.safeParse(data);
    
    if (!validationResult.success) {
      return {
        success: false,
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }
    
    const validatedData = validationResult.data;
    
    // For admin-created appointments, validate that a resident is provided
    if (!validatedData.residentId) {
      return {
        success: false,
        fieldErrors: {
          residentId: ["A resident must be selected when creating an appointment"],
        },
      };
    }
    
    // Lookup the resident to get their userId
    const resident = await db.resident.findUnique({
      where: { id: validatedData.residentId },
      select: { userId: true },
    });
    
    if (!resident) {
      return {
        success: false,
        serverError: "Selected resident not found",
      };
    }
    
    // Format date properly if it's a string
    let preferredDate: Date;
    if (typeof validatedData.preferredDate === "string") {
      preferredDate = new Date(validatedData.preferredDate);
    } else {
      preferredDate = validatedData.preferredDate;
    }
    
    // Set optional scheduledDateTime if admin is directly scheduling
    let scheduledDateTime: Date | undefined = undefined;
    let initialStatus: AppointmentStatus = AppointmentStatus.REQUESTED;
    
    // If this is a direct scheduling (not a request), set the scheduledDateTime and status
    if ("scheduledDateTime" in data && data.scheduledDateTime) {
      scheduledDateTime = new Date(data.scheduledDateTime as string | Date);
      initialStatus = AppointmentStatus.SCHEDULED;
    }
    
    // Create the appointment using the resident's userId
    const appointment = await db.appointment.create({
      data: {
        userId: resident.userId, // Use the resident's userId instead of defaulting to admin
        residentId: validatedData.residentId,
        appointmentType: validatedData.appointmentType,
        status: initialStatus,
        scheduledDateTime: scheduledDateTime,
        preferredDate,
        preferredTimeSlot: validatedData.preferredTimeSlot,
        notes: validatedData.notes,
      },
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
    });
    
    // Revalidate the appointments page
    revalidatePath("/dashboard/@admin/appointments");
    
    return { 
      success: true, 
      data: appointment, 
    };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return {
      success: false,
      serverError: "Failed to create appointment",
    };
  }
}

// Approve and schedule an appointment
export async function approveAppointment(
  appointmentId: number,
  scheduledDateTime: Date,
) {
  try {
    await db.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.SCHEDULED,
        scheduledDateTime,
      },
    });
    
    revalidatePath("/dashboard/@admin/appointments");
    return { success: true };
  } catch (error) {
    console.error("Error approving appointment:", error);
    return { success: false, error: "Failed to approve appointment" };
  }
}

// Mark an appointment as completed
export async function completeAppointment(appointmentId: number) {
  try {
    await db.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.COMPLETED,
      },
    });
    
    revalidatePath("/dashboard/appointments");
    return { success: true };
  } catch (error) {
    console.error("Error completing appointment:", error);
    return { success: false, error: "Failed to mark appointment as completed" };
  }
}

// Cancel an appointment
export async function cancelAppointment(appointmentId: number, reason?: string) {
  try {
    await db.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.CANCELLED,
        notes: reason ? `Cancelled: ${reason}` : undefined,
      },
    });
    
    revalidatePath("/dashboard/appointments");
    return { success: true };
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return { success: false, error: "Failed to cancel appointment" };
  }
}

// Mark an appointment as no-show
export async function markNoShow(appointmentId: number) {
  try {
    await db.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.NO_SHOW,
      },
    });
    
    revalidatePath("/dashboard/appointments");
    return { success: true };
  } catch (error) {
    console.error("Error marking no-show:", error);
    return { success: false, error: "Failed to mark as no-show" };
  }
}

// Reschedule an appointment
export async function rescheduleAppointment(
  appointmentId: number,
  scheduledDateTime: Date,
) {
  try {
    await db.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.RESCHEDULED,
        scheduledDateTime,
      },
    });
    
    revalidatePath("/dashboard/@admin/appointments");
    return { success: true };
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    return { success: false, error: "Failed to reschedule appointment" };
  }
}

// Delete an appointment (admin only, use with caution)
export async function deleteAppointment(appointmentId: number) {
  try {
    await db.appointment.delete({
      where: { id: appointmentId },
    });
    
    revalidatePath("/dashboard/@admin/appointments");
    return { success: true };
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return { success: false, error: "Failed to delete appointment" };
  }
}