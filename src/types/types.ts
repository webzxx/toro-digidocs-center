// types.ts
import { z } from "zod";

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
  precinct: z.string().min(1, "Precinct is required"),
  firstname: z.string().min(1, "Firstname is required"),
  middlename: z.string().min(1, "Middlename is required"),
  lastname: z.string().min(1, "Lastname is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  birthdate: z
    .string()
    .min(1, "Birthdate is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  contact: z
    .string()
    .min(1, "Contact is required")
    .regex(/^\d+$/, "Contact must be a valid number"),
});

export type CertificateInput = z.infer<typeof CertificateSchema>;

// Helper function to create a date schema with a custom error message
const dateSchema = (errorMessage: string) =>
  z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), { message: errorMessage });

// Step 1: Personal Information
const personalInfoSchema = z.object({
  precinctNumber: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.enum(["MALE", "FEMALE", "LGBTQ"]),
  birthDate: dateSchema("Invalid birth date"),
  email: z.string().email().optional(),
  contact: z
    .string()
    .min(1, "Contact is required")
    .regex(/^\d+$/, "Contact must be a valid number"),
  religion: z
    .enum([
      "CATHOLIC",
      "IGLESIA_NI_CRISTO",
      "AGLIPAY",
      "BAPTIST",
      "DATING_DAAN",
      "ISLAM",
      "JEHOVAHS_WITNESSES",
      "OTHERS",
    ])
    .optional(),
  status: z.enum([
    "SINGLE",
    "MARRIED",
    "WIDOW",
    "LEGALLY_SEPARATED",
    "LIVING_IN",
    "SEPARATED",
    "DIVORCED",
  ]),
  sector: z
    .enum([
      "SOLO_PARENT",
      "PWD",
      "SENIOR_CITIZEN",
      "INDIGENT_INDIGENOUS_PEOPLE",
    ])
    .optional(),
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyRelationship: z
    .string()
    .min(1, "Emergency relationship is required"),
  emergencyContact: z
    .string()
    .min(1, "Emergency contact is required")
    .regex(/^\d+$/, "Emergency Contact must be a valid number"),
  emergencyContactAddress: z
    .string()
    .min(1, "Emergency contact address is required"),
});

// Step 2: Address
const addressSchema = z.object({
  residency: z.enum(["HOME_OWNER", "TENANT", "HELPER", "CONSTRUCTION_WORKER"], {
    required_error: "Residency is required",
  }),
  yearsInMolinoIV: z.number().int().nonnegative().optional(),
  blockLot: z.string().optional(),
  phase: z.string().optional(),
  street: z.string().min(1),
  subdivision: z.string().min(1, "Subdivision is required"),
  barangay: z.literal("Molino IV"),
  city: z.literal("Bacoor"),
  province: z.literal("Cavite"),
});

// Step 3: Important Information
const importantInfoSchema = z
  .object({
    certificateType: z.enum([
      "BARANGAY_CLEARANCE",
      "BARANGAY_ID",
      "SOLO_PARENT",
      "COHABITATION",
      "GOOD_MORAL",
      "NO_INCOME",
      "FIRST_TIME_JOB_SEEKER",
      "RESIDENCY",
      "TRANSFER_OF_RESIDENCY",
      "LIVING_STILL",
      "BIRTH_FACT",
    ]),
    purpose: z.string().min(1, "Purpose is required"),
  })
  .and(
    z.discriminatedUnion("certificateType", [
      z.object({
        certificateType: z.enum(["BARANGAY_CLEARANCE", "BARANGAY_ID"]),
      }),
      z.object({
        certificateType: z.literal("GOOD_MORAL"),
        requestOf: z.string().min(1, "Request of is required"),
      }),
      z.object({
        certificateType: z.literal("SOLO_PARENT"),
        childName: z.string().min(1, "Child name is required"),
        soloParentSince: dateSchema("Invalid solo parent since date"),
        presentedBy: z.string().min(1, "Presented by is required"),
        registryNo: z.string().min(1, "Registry number is required"),
        requestOf: z.string().min(1, "Request of is required"),
      }),
      z.object({
        certificateType: z.literal("COHABITATION"),
        birthAddress: z.string().min(1, "Birth address is required"),
        spouseName: z.string().min(1, "Spouse name is required"),
        spouseBirthAddress: z
          .string()
          .min(1, "Spouse birth address is required"),
        dateOfMarriage: dateSchema("Invalid date of marriage"),
        requestOf: z.string().min(1, "Request of is required"),
      }),
      z.object({
        certificateType: z.literal("NO_INCOME"),
        noIncomeSince: dateSchema("Invalid no income since date"),
        requestOf: z.string().min(1, "Request of is required"),
      }),
      z.object({
        certificateType: z.literal("FIRST_TIME_JOB_SEEKER"),
        dateOfResidency: dateSchema("Invalid date of residency"),
      }),
      z.object({
        certificateType: z.literal("RESIDENCY"),
        birthAddress: z.string().min(1, "Birth address is required"),
        dateOfResidency: dateSchema("Invalid date of residency"),
        requestOf: z.string().min(1, "Request of is required"),
      }),
      z.object({
        certificateType: z.literal("TRANSFER_OF_RESIDENCY"),
        newAddress: z.string().min(1, "New address is required"),
        requestOf: z.string().min(1, "Request of is required"),
      }),
      z.object({
        certificateType: z.literal("LIVING_STILL"),
        dateOfTabloid: dateSchema("Invalid date of tabloid"),
        requestOf: z.string().min(1, "Request of is required"),
      }),
      z.object({
        certificateType: z.literal("BIRTH_FACT"),
        dateBorn: dateSchema("Invalid date born"),
        childName: z.string().min(1, "Child name is required"),
        birthAddress: z.string().min(1, "Birth address is required"),
        witnessName: z.string().min(1, "Witness name is required"),
        witnessType: z.string().min(1, "Witness type is required"),
        requestOf: z.string().min(1, "Request of is required"),
      }),
    ])
  );

// Helper function to validate data URL
const isValidDataUrl = (value: string) => {
  const regex = /^data:image\/(png|jpg|jpeg|gif);base64,/;
  return regex.test(value);
};

// Updated Proof of Identity schema
const proofOfIdentitySchema = z.object({
  signature: z
    .string()
    .min(1, "Signature is required")
    .refine((value) => isValidDataUrl(value), {
      message: "Invalid signature format. Must be a valid image data URL.",
    }),
  photoId1: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      "Only .jpg, .png, .gif formats are supported"
    ),
  photoId2: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      "Only .jpg, .png, .gif formats are supported"
    ),
  photoHoldingId1: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      "Only .jpg, .png, .gif formats are supported"
    ),
  photoHoldingId2: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      "Only .jpg, .png, .gif formats are supported"
    ),
});

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ImportantInfoInput = z.infer<typeof importantInfoSchema>;
export type ProofOfIdentityInput = z.infer<typeof proofOfIdentitySchema>;

// Complete form schema
const completeFormSchema = z.object({
  personalInfo: personalInfoSchema,
  address: addressSchema,
  importantInfo: importantInfoSchema,
  proofOfIdentity: proofOfIdentitySchema,
});

export type CompleteFormInput = z.infer<typeof completeFormSchema>;

export {
  personalInfoSchema,
  addressSchema,
  importantInfoSchema,
  proofOfIdentitySchema,
  completeFormSchema,
};
