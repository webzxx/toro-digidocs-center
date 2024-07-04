import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db'; // Adjust import based on your path
import { CertificateFormData } from '@/types/types'; // Adjust import based on your types setup
import * as z from 'zod';

// Define a schema for input validation
const certificateSchema = z.object({
  precinct: z.string().min(1, 'Precinct is required'),
  firstname: z.string().min(1, 'Firstname is required'),
  middlename: z.string().min(1, 'Middlename is required'),
  lastname: z.string().min(1, 'Lastname is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  birthdate: z.string().min(1, 'Birthdate is required').regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  contact: z.string().min(1, 'Contact is required').regex(/^\d+$/, 'Contact must be a valid number')
});

// Named export for POST method
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = req.body as CertificateFormData;

    // Validate incoming data against schema
    const validatedData = certificateSchema.parse(body);

    // Check if email already exists in the database
    const existingUserByEmail = await db.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUserByEmail) {
      return res.status(409).json({ user: null, message: 'User with this email already exists' });
    }

    // Create a new certificate entry in the database
    const newCertificate = await db.certificate.create({
      data: {
        precinct: validatedData.precinct,
        firstname: validatedData.firstname,
        middlename: validatedData.middlename,
        lastname: validatedData.lastname,
        email: validatedData.email,
        birthdate: new Date(validatedData.birthdate), // Ensure birthdate is properly formatted
        contact: validatedData.contact
      }
    });

    // Return success response
    return res.status(201).json({ certificate: newCertificate, message: 'Certificate created successfully' });
  } catch (error) {
    console.error('Error creating certificate:', error);

    // Detailed error handling
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors });
    }

    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

// Named export for other methods if needed
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  return res.status(405).json({ message: `Method ${req.method} not allowed. Use POST instead.` });
}

// Export other methods like PUT, DELETE similarly if needed
// export async function PUT(req: NextApiRequest, res: NextApiResponse) { ... }
// export async function DELETE(req: NextApiRequest, res: NextApiResponse) { ... }
