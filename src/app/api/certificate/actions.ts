"use server";

import { CertificateSchema, CertificateInput } from "@/types/types";
import { db } from "@/lib/db"; // Ensure db import is correct

export async function createCertificate(formData: CertificateInput) {
  try {
    // Validate incoming data against schema
    const validatedData = await CertificateSchema.safeParseAsync(formData);

    if (!validatedData.success) {
      const err = validatedData.error.flatten();
      return {
        fieldError: {
          precinct: err.fieldErrors.precinct?.[0],
          firstname: err.fieldErrors.firstname?.[0],
          middlename: err.fieldErrors.middlename?.[0],
          lastname: err.fieldErrors.lastname?.[0],
          email: err.fieldErrors.email?.[0],
          birthdate: err.fieldErrors.birthdate?.[0],
          contact: err.fieldErrors.contact?.[0],
        },
      };
    }

    const {
      precinct,
      firstname,
      middlename,
      lastname,
      email,
      birthdate,
      contact,
    } = validatedData.data;

    // Check if email already exists in the database
    const existingUserByEmail = await db.certificate.findFirst({
      where: { email: email },
    });

    if (existingUserByEmail) {
      return {
        fieldError: {
          email: "User with this email already exists",
        },
      };
    }

    // Create a new certificate entry using the createCertificate function
    const newCertificate = await db.certificate.create({
      data: {
        precinct: precinct,
        firstname: firstname,
        middlename: middlename,
        lastname: lastname,
        email: email,
        birthdate: new Date(birthdate), // Ensure birthdate is properly formatted
        contact: contact,
      },
    });
    // Return success response

    // return res.status(201).json({ certificate: newCertificate, message: 'Certificate created successfully' });
    return { success: true };
  } catch (error) {
    console.error("Error creating certificate:", error);
    // return Error
    return {
      serverError: "Unable to process request",
    };
  }
}
