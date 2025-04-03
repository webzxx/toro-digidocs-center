"use server";

import {
  completeCertificateFormSchema,
  CompleteCertificateFormInputWithoutFiles,
} from "@/types/types";
import { db } from "@/lib/db";
import { UTApi } from "uploadthing/server";
import getSession from "@/lib/auth/getSession";
import { UploadFileResult } from "uploadthing/types";

function generateFile(file: File, prefix: string, email?: string): File {
  const emailPrefix = email ? `${email.split("@")[0]}-` : "";
  const now = new Date();
  const dateStr = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, "0") +
    now.getDate().toString().padStart(2, "0") +
    now.getHours().toString().padStart(2, "0") +
    now.getMinutes().toString().padStart(2, "0") +
    now.getSeconds().toString().padStart(2, "0");
  const fileName = `${dateStr}-${emailPrefix}${prefix}-${file.name.replaceAll(" ", "_")}`;
  return new File([file], fileName, { type: file.type });
}

export async function createCertificateRequest(
  values: CompleteCertificateFormInputWithoutFiles,
  files: FormData,
) {
  let uploadedFiles : UploadFileResult[] = [];
  const utApi = new UTApi();
  const cleanupFiles = async () => {
    for (const file of uploadedFiles) {
      if (file.data?.key) {
        try {
          await utApi.deleteFiles(file.data.key);
        } catch (error) {
          console.error(`Failed to delete file ${file.data.key}:`, error);
        }
      }
    }
  };

  try {
    const session = await getSession();
    if (!session?.user) {
      return {
        serverError: "Unauthorized",
      };
    }

    const data = {
      personalInfo: values.personalInfo,
      address: values.address,
      certificate: values.certificate,
      proofOfIdentity: {
        ...values.proofOfIdentity,
        photoId: [
          files.get("photoId[0]") as File,
          files.get("photoId[1]") as File,
        ],
        photoHoldingId: [
          files.get("photoHoldingId[0]") as File,
          files.get("photoHoldingId[1]") as File,
        ],
      },
    };
    // Validate incoming data against schema
    const validatedData =
      await completeCertificateFormSchema.safeParseAsync(data);

    if (!validatedData.success) {
      const err = validatedData.error.flatten();
      return { fieldErrors: err.fieldErrors };
    }

    const { personalInfo, address, certificate, proofOfIdentity } =
      validatedData.data;

    // Handle file uploads before starting the transaction
    const signatureBuffer = Buffer.from(
      proofOfIdentity.signature.split(",")[1],
      "base64",
    );
    
    // Use session user's email if personalInfo.email is null or undefined
    // Convert to undefined if null to match the expected type for generateFile
    const emailForFiles = personalInfo.email || session.user.email || undefined;
    
    const signatureFile = generateFile(
      new File([signatureBuffer], "signpadimg.png", { type: "image/png" }),
      "signature",
      emailForFiles,
    );
    const [idPhoto1, idPhoto2, holdingIdPhoto1, holdingIdPhoto2, signature] = 
      await utApi.uploadFiles([
        generateFile(proofOfIdentity.photoId[0], "id1", emailForFiles),
        generateFile(proofOfIdentity.photoId[1], "id2", emailForFiles),
        generateFile(proofOfIdentity.photoHoldingId[0], "holding1", emailForFiles),
        generateFile(proofOfIdentity.photoHoldingId[1], "holding2", emailForFiles),
        generateFile(signatureFile, "signature", emailForFiles),
      ]);
    uploadedFiles = [idPhoto1, idPhoto2, holdingIdPhoto1, holdingIdPhoto2, signature];

    if (
      !idPhoto1.data ||
      !idPhoto2.data ||
      !holdingIdPhoto1.data ||
      !holdingIdPhoto2.data ||
      !signature.data
    ) {
      await cleanupFiles();
      console.error("Error uploading files");
      throw new Error("Unable to process file uploads");
    }

    // Start a transaction for database operations
    const result = await db.$transaction(async (prisma) => {
      // Create Resident
      const resident = await prisma.resident.create({
        data: {
          userId: parseInt(session.user.id),
          precinctNumber: personalInfo.precinctNumber,
          firstName: personalInfo.firstName,
          middleName: personalInfo.middleName,
          lastName: personalInfo.lastName,
          gender: personalInfo.gender,
          birthDate: new Date(personalInfo.birthDate),
          email: personalInfo.email || session.user.email,
          contact: personalInfo.contact,
          religion: personalInfo.religion,
          status: personalInfo.status,
          sector: personalInfo.sector,
          emergencyContact: {
            create: {
              name: personalInfo.emergencyContactName,
              relationship: personalInfo.emergencyRelationship,
              contact: personalInfo.emergencyContact,
              address: personalInfo.emergencyContactAddress,
            },
          },
          address: {
            create: {
              residencyType: address.residency,
              yearsInBahayToro: address.yearsInBahayToro,
              blockLot: address.blockLot,
              phase: address.phase,
              street: address.street,
              subdivision: address.subdivision,
              barangay: address.barangay,
              city: address.city,
              province: address.province,
            },
          },
        },
      });
      console.log(`Resident created with ID: ${resident.id}`);

      // Create ProofOfIdentity with uploaded file URLs
      await prisma.proofOfIdentity.create({
        data: {
          residentId: resident.id,
          signaturePath: signature.data.ufsUrl,
          idPhoto1Path: idPhoto1.data.ufsUrl,
          idPhoto2Path: idPhoto2.data.ufsUrl,
          holdingIdPhoto1Path: holdingIdPhoto1.data.ufsUrl,
          holdingIdPhoto2Path: holdingIdPhoto2.data.ufsUrl,
        },
      });
      console.log(`ProofOfIdentity created for resident ID: ${resident.id}`);

      // Create CertificateRequest
      const { certificateType, purpose, ...restOfCertificateInfo } = certificate;

      const certificateRequest = await prisma.certificateRequest.create({
        data: {
          residentId: resident.id,
          certificateType: certificateType,
          purpose: purpose,
          additionalInfo: {
            ...restOfCertificateInfo,
          },
        },
      });
      console.log(
        `CertificateRequest created with ID: ${certificateRequest.id} for resident ID: ${resident.id}`,
      );

      // Fetch the created resident and certificate request with their generated IDs
      const createdResident = await prisma.resident.findUnique({
        where: { id: resident.id },
        select: { bahayToroSystemId: true },
      });

      const createdCertificateRequest =
        await prisma.certificateRequest.findUnique({
          where: { id: certificateRequest.id },
          select: { referenceNumber: true },
        });

      return {
        resident: {
          ...resident,
          bahayToroSystemId: createdResident?.bahayToroSystemId,
        },
        certificateRequest: {
          ...certificateRequest,
          referenceNumber: createdCertificateRequest?.referenceNumber,
        },
      };
    });

    // Return success response with generated IDs
    return {
      success: true,
      data: {
        ...result,
        bahayToroSystemId: result.resident!.bahayToroSystemId,
        referenceNumber: result.certificateRequest!.referenceNumber,
      },
    };
  } catch (error) {
    console.error("Error creating certificate:", error);
    await cleanupFiles();
    return {
      serverError: "Unable to process request",
    };
  }
}
