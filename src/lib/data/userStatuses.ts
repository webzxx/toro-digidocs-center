// This file contains functions to query the database for user appointment and certificate statuses
import { db } from "../db";
import type { User } from "@prisma/client";

// Function to get a user's certificate request statuses
export async function getUserCertificateStatuses(userId: number) {
  try {
    // First, get all residents associated with the user
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        residents: true,
      },
    });

    if (!user || user.residents.length === 0) {
      return { success: false, message: "No resident profiles found for this user" };
    }

    // Get resident IDs from the user
    const residentIds = user.residents.map((resident) => resident.id);

    // Get all certificate requests for these residents
    const certificates = await db.certificateRequest.findMany({
      where: {
        residentId: {
          in: residentIds,
        },
      },
      include: {
        resident: {
          select: {
            firstName: true,
            middleName: true,
            lastName: true,
            bahayToroSystemId: true,
          },
        },
        payments: {
          where: {
            isActive: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        requestDate: "desc",
      },
    });

    return {
      success: true,
      certificates: certificates.map((cert) => ({
        referenceNumber: cert.referenceNumber,
        type: cert.certificateType,
        status: cert.status,
        requestDate: cert.requestDate,
        resident: `${cert.resident.firstName} ${cert.resident.middleName ? cert.resident.middleName + " " : ""}${cert.resident.lastName}`,
        residentId: cert.resident.bahayToroSystemId,
        paymentStatus: cert.payments.length > 0 ? cert.payments[0].paymentStatus : null,
      })),
    };
  } catch (error) {
    console.error("Error fetching certificate statuses:", error);
    return { success: false, message: "Failed to fetch certificate statuses" };
  }
}

// Function to get a user's appointment statuses
export async function getUserAppointmentStatuses(userId: number) {
  try {
    // Get all appointments for this user
    const appointments = await db.appointment.findMany({
      where: {
        userId: userId,
      },
      include: {
        resident: {
          select: {
            firstName: true,
            middleName: true,
            lastName: true,
            bahayToroSystemId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      appointments: appointments.map((appt) => ({
        referenceNumber: appt.referenceNumber,
        type: appt.appointmentType,
        status: appt.status,
        scheduledDateTime: appt.scheduledDateTime,
        preferredDate: appt.preferredDate,
        preferredTimeSlot: appt.preferredTimeSlot,
        resident: appt.resident 
          ? `${appt.resident.firstName} ${appt.resident.middleName ? appt.resident.middleName + " " : ""}${appt.resident.lastName}`
          : null,
        residentId: appt.resident?.bahayToroSystemId || null,
      })),
    };
  } catch (error) {
    console.error("Error fetching appointment statuses:", error);
    return { success: false, message: "Failed to fetch appointment statuses" };
  }
}

// Function to get a certificate status by reference number
export async function getCertificateByReferenceNumber(referenceNumber: string) {
  try {
    const certificate = await db.certificateRequest.findUnique({
      where: {
        referenceNumber: referenceNumber,
      },
      include: {
        resident: {
          select: {
            firstName: true,
            middleName: true,
            lastName: true,
            bahayToroSystemId: true,
          },
        },
        payments: {
          where: {
            isActive: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    if (!certificate) {
      return { success: false, message: "Certificate request not found" };
    }

    return {
      success: true,
      certificate: {
        referenceNumber: certificate.referenceNumber,
        type: certificate.certificateType,
        status: certificate.status,
        requestDate: certificate.requestDate,
        resident: `${certificate.resident.firstName} ${certificate.resident.middleName ? certificate.resident.middleName + " " : ""}${certificate.resident.lastName}`,
        residentId: certificate.resident.bahayToroSystemId,
        paymentStatus: certificate.payments.length > 0 ? certificate.payments[0].paymentStatus : null,
        purpose: certificate.purpose,
        remarks: certificate.remarks,
      },
    };
  } catch (error) {
    console.error("Error fetching certificate:", error);
    return { success: false, message: "Failed to fetch certificate details" };
  }
}

// Function to get an appointment by reference number
export async function getAppointmentByReferenceNumber(referenceNumber: string) {
  try {
    const appointment = await db.appointment.findUnique({
      where: {
        referenceNumber: referenceNumber,
      },
      include: {
        resident: {
          select: {
            firstName: true,
            middleName: true,
            lastName: true,
            bahayToroSystemId: true,
          },
        },
      },
    });

    if (!appointment) {
      return { success: false, message: "Appointment not found" };
    }

    return {
      success: true,
      appointment: {
        referenceNumber: appointment.referenceNumber,
        type: appointment.appointmentType,
        status: appointment.status,
        scheduledDateTime: appointment.scheduledDateTime,
        preferredDate: appointment.preferredDate,
        preferredTimeSlot: appointment.preferredTimeSlot,
        resident: appointment.resident 
          ? `${appointment.resident.firstName} ${appointment.resident.middleName ? appointment.resident.middleName + " " : ""}${appointment.resident.lastName}`
          : null,
        residentId: appointment.resident?.bahayToroSystemId || null,
        notes: appointment.notes,
      },
    };
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return { success: false, message: "Failed to fetch appointment details" };
  }
}