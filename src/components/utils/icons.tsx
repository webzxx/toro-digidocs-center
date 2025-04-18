import React from "react";
import { 
  CalendarClock, 
  FileText, 
  Clock, 
  AlertCircle,
  XCircle,
  BanIcon,
  Hourglass,
  CircleDollarSign,
  FileCheck,
  PackageCheck,
  Truck,
  Check,
  Ban,
  FileClock,
  FileWarning,
  FileX,
  MailCheck,
  CheckCircle2,
  CalendarPlus,
  Calendar,
  CalendarX,
  CalendarOff,
  Video,
  Info,
} from "lucide-react";
import { PaymentStatus, AppointmentStatus, AppointmentType } from "@prisma/client";

/**
 * Returns an icon component based on the certificate status
 */
export const getCertificateStatusIcon = (status: string) => {
  switch(status) {
  case "COMPLETED":
    return <Check className="h-4 w-4 flex-shrink-0 text-green-500" />;
  case "PENDING":
    return <Clock className="h-4 w-4 flex-shrink-0 text-yellow-500" />;
  case "UNDER_REVIEW":
    return <AlertCircle className="h-4 w-4 flex-shrink-0 text-purple-500" />;
  case "AWAITING_PAYMENT":
    return <CircleDollarSign className="h-4 w-4 flex-shrink-0 text-orange-500" />;
  case "PROCESSING":
    return <Hourglass className="h-4 w-4 flex-shrink-0 text-blue-500" />;
  case "READY_FOR_PICKUP":
    return <PackageCheck className="h-4 w-4 flex-shrink-0 text-indigo-500" />;
  case "IN_TRANSIT":
    return <Truck className="h-4 w-4 flex-shrink-0 text-cyan-500" />;
  case "REJECTED":
    return <XCircle className="h-4 w-4 flex-shrink-0 text-red-500" />;
  case "CANCELLED":
    return <BanIcon className="h-4 w-4 flex-shrink-0 text-gray-500" />;
  default:
    return <FileText className="h-4 w-4 flex-shrink-0" />;
  }
};

/**
 * Returns an icon for payment status
 */
export const getPaymentStatusIcon = (status: PaymentStatus) => {
  const iconProps = { className: "size-3.5 flex-shrink-0" };
  
  switch (status) {
  case "PENDING":
    return <Clock {...iconProps} />;
  case "SUCCEEDED":
    return <CheckCircle2 {...iconProps} />;
  case "VERIFIED":
    return <FileCheck {...iconProps} />;
  case "REJECTED":
    return <FileWarning {...iconProps} />;
  case "REFUNDED":
    return <CircleDollarSign {...iconProps} />;
  case "WAIVED":
    return <MailCheck {...iconProps} />;
  case "CANCELLED":
    return <Ban {...iconProps} />;
  case "EXPIRED":
    return <FileClock {...iconProps} />;
  case "VOIDED":
    return <FileX {...iconProps} />;
  default:
    return <AlertCircle {...iconProps} />;
  }
};

/**
 * Returns an icon for appointment status
 */
export const getAppointmentStatusIcon = (status: AppointmentStatus) => {
  const iconProps = { className: "size-3.5 flex-shrink-0" };
  
  switch (status) {
  case "REQUESTED":
    return <CalendarPlus {...iconProps} />;
  case "SCHEDULED":
    return <Calendar {...iconProps} />;
  case "COMPLETED":
    return <Check {...iconProps} />;
  case "CANCELLED":
    return <CalendarX {...iconProps} />;
  case "RESCHEDULED":
    return <CalendarClock {...iconProps} />;
  case "NO_SHOW":
    return <CalendarOff {...iconProps} />;
  default:
    return <Clock {...iconProps} />;
  }
};

/**
 * Returns an appropriate icon for appointment type
 */
export const getAppointmentTypeIcon = (type: AppointmentType) => {
  switch (type) {
  case "DOCUMENT_PICKUP":
    return <FileText className="h-4 w-4 text-blue-500" />;
  case "SUBPOENA_MEETING":
    return <Video className="h-4 w-4 text-purple-500" />;
  default:
    return <Info className="h-4 w-4" />;
  }
};
