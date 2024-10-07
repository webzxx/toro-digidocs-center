"use server";

import {
  completeCertificateFormSchema,
  CompleteCertificateFormInputWithoutFiles,
} from "@/types/types";
import { db } from "@/lib/db";
import path from "path";
import fs from "fs/promises";

async function saveFile(
  file: File,
  residentFolder: string,
  prefix: string
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}-${prefix}-${file.name.replaceAll(" ", "_")}`;
  const filePath = path.join(residentFolder, fileName);
  await fs.writeFile(filePath, new Uint8Array(buffer));
  return fileName;
}

export async function createCertificateRequest(
  values: CompleteCertificateFormInputWithoutFiles,
  files: FormData
) {
  try {
    const data = {
      personalInfo: values.personalInfo,
      address: values.address,
      importantInfo: values.importantInfo,
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

    const { personalInfo, address, importantInfo, proofOfIdentity } =
      validatedData.data;

    // Start a transaction
    const result = await db.$transaction(async (prisma) => {
      // Create Resident
      const resident = await prisma.resident.create({
        data: {
          precinctNumber: personalInfo.precinctNumber,
          firstName: personalInfo.firstName,
          middleName: personalInfo.middleName,
          lastName: personalInfo.lastName,
          gender: personalInfo.gender,
          birthDate: new Date(personalInfo.birthDate),
          email: personalInfo.email,
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

      // Create folder for resident files
      const residentFolder = path.join(
        process.cwd(),
        "public/certificate",
        `resident_${resident.id}`
      );
      await fs.mkdir(residentFolder, { recursive: true });
      console.log(`Folder created for resident ID: ${resident.id}`);

      // Save files and get file paths
      const idPhoto1Path = await saveFile(
        proofOfIdentity.photoId[0],
        residentFolder,
        "id1"
      );
      const idPhoto2Path = await saveFile(
        proofOfIdentity.photoId[1],
        residentFolder,
        "id2"
      );
      const holdingIdPhoto1Path = await saveFile(
        proofOfIdentity.photoHoldingId[0],
        residentFolder,
        "holding1"
      );
      const holdingIdPhoto2Path = await saveFile(
        proofOfIdentity.photoHoldingId[1],
        residentFolder,
        "holding2"
      );
      console.log(`Files saved for resident ID: ${resident.id}`);

      // Save signature as file
      const signatureFileName = `${Date.now()}-signature.png`;
      const signaturePath = path.join(residentFolder, signatureFileName);
      await fs.writeFile(
        signaturePath,
        proofOfIdentity.signature.split(",")[1],
        "base64"
      );
      console.log(`Signature saved for resident ID: ${resident.id}`);

      // Create ProofOfIdentity
      await prisma.proofOfIdentity.create({
        data: {
          residentId: resident.id,
          signaturePath: signatureFileName,
          idPhoto1Path,
          idPhoto2Path,
          holdingIdPhoto1Path,
          holdingIdPhoto2Path,
        },
      });
      console.log(`ProofOfIdentity created for resident ID: ${resident.id}`);

      // Create CertificateRequest
      const certificateRequest = await prisma.certificateRequest.create({
        data: {
          residentId: resident.id,
          certificateType: importantInfo.certificateType,
          purpose: importantInfo.purpose,
        },
      });
      console.log(
        `CertificateRequest created with ID: ${certificateRequest.id} for resident ID: ${resident.id}`
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
        bahayToroSystemId: result.resident.bahayToroSystemId,
        referenceNumber: result.certificateRequest.referenceNumber,
      },
    };
  } catch (error) {
    console.error("Error creating certificate:", error);
    // Return Error
    return {
      serverError: "Unable to process request",
    };
  }
}
