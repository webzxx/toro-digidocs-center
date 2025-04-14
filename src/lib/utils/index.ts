import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Religion, Sector, TimeSlot } from "@prisma/client";

// Application constants
export const STORAGE_KEYS = {
  CHAT_MESSAGES: "chat_messages",
  PAYMENT: (id: number) => `payment_${id}`,
};

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

// Convert newlines to HTML <br> tags for chat messages
export const convertNewlinesToHtml = (text: string): string => {
  return text.replace(/\n/g, "<br>");
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
export const formatReligion = (religion: Religion | null) => {
  switch (religion) {
  case Religion.CATHOLIC:
    return "Catholic";
  case Religion.IGLESIA_NI_CRISTO:
    return "Iglesia ni Cristo";
  case Religion.AGLIPAY:
    return "Aglipay";
  case Religion.BAPTIST:
    return "Baptist";
  case Religion.DATING_DAAN:
    return "Dating Daan";
  case Religion.ISLAM:
    return "Islam";
  case Religion.JEHOVAHS_WITNESSES:
    return "Jehovah's Witnesses";
  case Religion.OTHERS:
    return "Others";
  default:
    return "N/A";
  }
};

/**
 * Formats sector for display
 */
export const formatSector = (sector: Sector) => {
  switch (sector) {
  case Sector.SOLO_PARENT:
    return "Solo Parent";
  case Sector.PWD:
    return "PWD";
  case Sector.SENIOR_CITIZEN:
    return "Senior Citizen";
  case Sector.INDIGENT_INDIGENOUS_PEOPLE:
    return "Indigent Indigenous People";
  default:
    return "N/A";
  }
};

/**
 * Formats time slots for display
 */
export const formatTimeSlot = (timeSlot: TimeSlot) => {
  switch (timeSlot) {
  case TimeSlot.MORNING:
    return "Morning (8:00 AM - 12:00 PM)";
  case TimeSlot.AFTERNOON:
    return "Afternoon (1:00 PM - 5:00 PM)";
  default:
    return "N/A";
  }
};