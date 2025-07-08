import { CertificateInput } from "@/types/forms";
import { CertificateType } from "@prisma/client";

export const getCertificateTypeLabel = (type: CertificateType): string => {
  const labels: Record<CertificateType, string> = {
    CEDULA: "📃 Cedula",
    BARANGAY_CLEARANCE: "📃 Barangay Clearance",
    BARANGAY_ID: "📃 Barangay ID",
    SOLO_PARENT: "📃 Solo Parent",
    COHABITATION: "📃 Cohabitation",
    GOOD_MORAL: "📃 Good Moral",
    NO_INCOME: "📃 No Income",
    FIRST_TIME_JOB_SEEKER: "📃 First Time Job Seeker",
    RESIDENCY: "📃 Residency",
    TRANSFER_OF_RESIDENCY: "📃 Transfer of Residency",
    LIVING_STILL: "📃 Living Still",
    BIRTH_FACT: "📃 Birth Fact",
  };
  return labels[type];
};

export const getRequiredFields = (certificateType: CertificateType): string[] => {
  const baseFields = ["purpose"];
  
  const fieldMap: Record<CertificateType, string[]> = {
    CEDULA: [],
    BARANGAY_CLEARANCE: [],
    BARANGAY_ID: [],
    SOLO_PARENT: ["childName", "soloParentSince", "presentedBy", "registryNo", "requestOf"],
    COHABITATION: ["birthAddress", "spouseName", "spouseBirthAddress", "dateOfMarriage", "requestOf"],
    GOOD_MORAL: ["requestOf"],
    NO_INCOME: ["noIncomeSince", "requestOf"],
    FIRST_TIME_JOB_SEEKER: ["dateOfResidency"],
    RESIDENCY: ["birthAddress", "dateOfResidency", "requestOf"],
    TRANSFER_OF_RESIDENCY: ["newAddress", "requestOf"],
    LIVING_STILL: ["dateOfTabloid", "requestOf"],
    BIRTH_FACT: ["dateBorn", "childName", "birthAddress", "witnessName", "witnessType", "requestOf"],
  };

  return [...baseFields, ...fieldMap[certificateType]];
};

export const getDefaultValues = (data: Partial<CertificateInput>): Partial<CertificateInput> => {
  const baseValues = {
    certificateType: data.certificateType || undefined,
    purpose: data.purpose || "",
  };

  switch (data.certificateType) {
  case "SOLO_PARENT":
    return {
      ...baseValues,
      certificateType: "SOLO_PARENT",
      childName: data.childName || "",
      soloParentSince: data.soloParentSince || "",
      presentedBy: data.presentedBy || "",
      registryNo: data.registryNo || "",
      requestOf: data.requestOf || "",
    };
  case "GOOD_MORAL":
    return {
      ...baseValues,
      certificateType: "GOOD_MORAL",
      requestOf: data.requestOf || "",
    };
  case "COHABITATION":
    return {
      ...baseValues,
      certificateType: "COHABITATION",
      birthAddress: data.birthAddress || "",
      spouseName: data.spouseName || "",
      spouseBirthAddress: data.spouseBirthAddress || "",
      dateOfMarriage: data.dateOfMarriage || "",
      requestOf: data.requestOf || "",
    };
  case "NO_INCOME":
    return {
      ...baseValues,
      certificateType: "NO_INCOME",
      noIncomeSince: data.noIncomeSince || "",
      requestOf: data.requestOf || "",
    };
  case "FIRST_TIME_JOB_SEEKER":
    return {
      ...baseValues,
      certificateType: "FIRST_TIME_JOB_SEEKER",
      dateOfResidency: data.dateOfResidency || "",
    };
  case "RESIDENCY":
    return {
      ...baseValues,
      certificateType: "RESIDENCY",
      birthAddress: data.birthAddress || "",
      dateOfResidency: data.dateOfResidency || "",
      requestOf: data.requestOf || "",
    };
  case "TRANSFER_OF_RESIDENCY":
    return {
      ...baseValues,
      certificateType: "TRANSFER_OF_RESIDENCY",
      newAddress: data.newAddress || "",
    };
  case "LIVING_STILL":
    return {
      ...baseValues,
      certificateType: "LIVING_STILL",
      dateOfTabloid: data.dateOfTabloid || "",
    };
  case "BIRTH_FACT":
    return {
      ...baseValues,
      certificateType: "BIRTH_FACT",
      dateBorn: data.dateBorn || "",
      childName: data.childName || "",
      birthAddress: data.birthAddress || "",
      witnessName: data.witnessName || "",
      witnessType: data.witnessType || "",
    };
  default:
    return baseValues;
  }
};