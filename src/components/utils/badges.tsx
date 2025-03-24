import React from "react";
import { Badge } from "@/components/ui/badge";
import { CertificateType, Gender, CivilStatus, Sector, PaymentStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import { getCertificateStatusIcon, getPaymentStatusIcon } from "./icons";

/**
 * Returns a styled badge for certificate status
 */
export const getCertificateStatusBadge = (status: string) => {
  const statusStyles = {
    PENDING: "bg-yellow-100 hover:bg-yellow-100 text-yellow-800 border-yellow-200",
    UNDER_REVIEW: "bg-blue-100 hover:bg-blue-100 text-blue-800 border-blue-200",
    AWAITING_PAYMENT: "bg-purple-100 hover:bg-purple-100 text-purple-800 border-purple-200",
    PROCESSING: "bg-indigo-100 hover:bg-indigo-100 text-indigo-800 border-indigo-200",
    READY_FOR_PICKUP: "bg-green-100 hover:bg-green-100 text-green-800 border-green-200",
    IN_TRANSIT: "bg-cyan-100 hover:bg-cyan-100 text-cyan-800 border-cyan-200",
    COMPLETED: "bg-emerald-100 hover:bg-emerald-100 text-emerald-800 border-emerald-200",
    REJECTED: "bg-red-100 hover:bg-red-100 text-red-800 border-red-200",
    CANCELLED: "bg-gray-100 hover:bg-gray-100 text-gray-800 border-gray-200",
  } as {[key: string]: string};

  const statusNames = {
    PENDING: "Pending",
    UNDER_REVIEW: "Under Review",
    AWAITING_PAYMENT: "Awaiting Payment",
    PROCESSING: "Processing",
    READY_FOR_PICKUP: "Ready for Pickup",
    IN_TRANSIT: "In Transit",
    COMPLETED: "Completed",
    REJECTED: "Rejected",
    CANCELLED: "Cancelled",
  } as {[key: string]: string};

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "flex items-center gap-1 py-1 font-normal text-xs border", 
        statusStyles[status] || "bg-gray-100 text-gray-800",
      )}
    >
      <span className="flex-shrink-0">{getCertificateStatusIcon(status)}</span>
      {statusNames[status] || status.replace(/_/g, " ")}
    </Badge>
  );
};

/**
 * Returns a styled badge for certificate type
 */
export const getCertificateTypeBadge = (type: CertificateType) => {
  const getColor = () => {
    switch (type) {
    case "BARANGAY_CLEARANCE":
    case "GOOD_MORAL":
    case "TRANSFER_OF_RESIDENCY":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "BARANGAY_ID":
    case "NO_INCOME":
    case "LIVING_STILL":
      return "bg-green-100 text-green-800 border-green-200";
    case "SOLO_PARENT":
    case "FIRST_TIME_JOB_SEEKER":
    case "BIRTH_FACT":
      return "bg-red-100 text-red-800 border-red-200";
    case "COHABITATION":
    case "RESIDENCY":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Badge variant="outline" className={`${getColor()} text-center font-medium min-w-28 max-w-36 line-clamp-2 text-xs`}>
      {type.replace(/_/g, " ")}
    </Badge>
  );
};

/**
 * Returns a styled badge for resident gender
 */
export const getGenderBadge = (gender: Gender) => {
  const variants: { [key in Gender]: "default" | "secondary" | "destructive" } = {
    MALE: "default",
    FEMALE: "secondary",
    LGBTQ: "destructive",
  };
  return (
    <Badge variant={variants[gender]}>
      {gender}
    </Badge>
  );
};

/**
 * Returns a styled badge for resident civil status
 */
export const getCivilStatusBadge = (status: CivilStatus) => {
  const getColor = () => {
    switch (status) {
    case "SINGLE":
      return "bg-blue-100 text-blue-800";
    case "MARRIED":
      return "bg-green-100 text-green-800";
    case "WIDOW":
      return "bg-gray-100 text-gray-800";
    case "LEGALLY_SEPARATED":
      return "bg-red-100 text-red-800";
    case "LIVING_IN":
      return "bg-purple-100 text-purple-800";
    case "SEPARATED":
      return "bg-yellow-100 text-yellow-800";
    case "DIVORCED":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColor()}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
};

/**
 * Returns a styled badge for resident sector
 */
export const getSectorBadge = (sector: Sector) => {
  const getColor = () => {
    switch (sector) {
    case "SOLO_PARENT":
      return "bg-pink-100 text-pink-800";
    case "PWD":
      return "bg-blue-100 text-blue-800";
    case "SENIOR_CITIZEN":
      return "bg-purple-100 text-purple-800";
    case "INDIGENT_INDIGENOUS_PEOPLE":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColor()}`}>
      {sector.replace(/_/g, " ")}
    </span>
  );
};

/**
 * Returns a styled badge for payment status
 */
export const getPaymentStatusBadge = (status: PaymentStatus) => {
  const statusStyles = {
    PENDING: "bg-yellow-100 hover:bg-yellow-100 text-yellow-800 border-yellow-200",
    SUCCEEDED: "bg-green-100 hover:bg-green-100 text-green-800 border-green-200",
    VERIFIED: "bg-emerald-100 hover:bg-emerald-100 text-emerald-800 border-emerald-200",
    REJECTED: "bg-red-100 hover:bg-red-100 text-red-800 border-red-200",
    REFUNDED: "bg-blue-100 hover:bg-blue-100 text-blue-800 border-blue-200",
    WAIVED: "bg-purple-100 hover:bg-purple-100 text-purple-800 border-purple-200",
    CANCELLED: "bg-gray-100 hover:bg-gray-100 text-gray-800 border-gray-200",
    EXPIRED: "bg-orange-100 hover:bg-orange-100 text-orange-800 border-orange-200",
    VOIDED: "bg-gray-100 hover:bg-gray-100 text-gray-800 border-gray-200",
  };

  const statusNames = {
    PENDING: "Pending",
    SUCCEEDED: "Succeeded",
    VERIFIED: "Verified",
    REJECTED: "Rejected",
    REFUNDED: "Refunded",
    WAIVED: "Waived",
    CANCELLED: "Cancelled",
    EXPIRED: "Expired",
    VOIDED: "Voided",
  };

  return (
    <Badge variant="outline" 
      className={cn(
        "inline-flex w-fit items-center gap-1 py-1 font-normal text-xs border", 
        statusStyles[status] || "bg-gray-100 text-gray-800",
      )}
    >
      {getPaymentStatusIcon(status)}
      {statusNames[status] || status?.replace(/_/g, " ")}
    </Badge>
  );
};