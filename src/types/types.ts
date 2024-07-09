// types.ts
import { z } from 'zod';

export interface CertificateFormData {
  precinct: string;
  firstname: string;
  middlename: string;
  lastname: string;
  email: string;
  birthdate: string;
  contact: string;
}


// Define a schema for input validation
export const CertificateSchema = z.object({
  precinct: z.string().min(1, 'Precinct is required'),
  firstname: z.string().min(1, 'Firstname is required'),
  middlename: z.string().min(1, 'Middlename is required'),
  lastname: z.string().min(1, 'Lastname is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  birthdate: z.string().min(1, 'Birthdate is required').regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  contact: z.string().min(1, 'Contact is required').regex(/^\d+$/, 'Contact must be a valid number')
});

export const CertificateInput = z.infer<typeof CertificateSchema>