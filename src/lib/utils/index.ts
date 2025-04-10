import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AppointmentType } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateTime = (date: Date | string) => {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

export const formatDateTimeShort = (date: Date | string) => {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

export const formatDateOnly = (date: Date | string) => {
  return new Date(date).toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "long", 
    day: "numeric",
  });
};

export const formatTime = (date: Date | string) => {
  return new Date(date).toLocaleTimeString("en-US", { 
    hour: "numeric", 
    minute: "2-digit",
    hour12: true, 
  });
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
};

export const titleCase = (str: string) => 
  str.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

/**
 * Formats religion for display
 */
export const formatReligion = (religion: string | null) => {
  switch (religion) {
  case "CATHOLIC":
    return "Catholic";
  case "IGLESIA_NI_CRISTO":
    return "Iglesia ni Cristo";
  case "AGLIPAY":
    return "Aglipay";
  case "BAPTIST":
    return "Baptist";
  case "DATING_DAAN":
    return "Dating Daan";
  case "ISLAM":
    return "Islam";
  case "JEHOVAHS_WITNESSES":
    return "Jehovah's Witnesses";
  case "OTHERS":
    return "Others";
  default:
    return "N/A";
  }
};

/**
 * Formats appointment type for display
 * Converts DOCUMENT_PICKUP to "Document Pickup"
 */
export const formatAppointmentType = (type: AppointmentType) => {
  return type.replace("_", " ").toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};