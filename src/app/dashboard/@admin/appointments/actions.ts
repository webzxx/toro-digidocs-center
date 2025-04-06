"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { AppointmentStatus } from "@prisma/client";

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

// Confirm an appointment
export async function confirmAppointment(appointmentId: number) {
  try {
    await db.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.CONFIRMED,
      },
    });
    
    revalidatePath("/dashboard/@admin/appointments");
    return { success: true };
  } catch (error) {
    console.error("Error confirming appointment:", error);
    return { success: false, error: "Failed to confirm appointment" };
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
    
    // If this is a DOCUMENT_PICKUP appointment with a certificate request,
    // also mark the certificate as COMPLETED
    const appointment = await db.appointment.findUnique({
      where: { id: appointmentId },
      include: { certificateRequest: true },
    });
    
    if (
      appointment?.certificateRequest?.id &&
      appointment.appointmentType === "DOCUMENT_PICKUP"
    ) {
      await db.certificateRequest.update({
        where: { id: appointment.certificateRequest.id },
        data: { status: "COMPLETED" },
      });
    }
    
    revalidatePath("/dashboard/@admin/appointments");
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
    
    revalidatePath("/dashboard/@admin/appointments");
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
    
    revalidatePath("/dashboard/@admin/appointments");
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