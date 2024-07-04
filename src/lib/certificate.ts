// lib/certificate.ts
import { db } from './db';
import { CertificateFormData } from '@/types/types'; // Adjust import based on your types setup

export const createCertificate = async (formData: CertificateFormData) => {
  try {
    // Example: Creating a new certificate record in the database
    const newCertificate = await db.certificate.create({
      data: {
        precinct: formData.precinct,
        firstname: formData.firstname,
        middlename: formData.middlename,
        lastname: formData.lastname,
        email: formData.email,
        birthdate: new Date(formData.birthdate), // Ensure birthdate is properly formatted
        contact: formData.contact,
      }
    });

    return newCertificate;
  } catch (error) {
    console.error('Error creating certificate:', error);
    throw error;
  }
};
