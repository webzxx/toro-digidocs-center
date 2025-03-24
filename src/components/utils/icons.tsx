import React from "react";
import { 
  CalendarClock, 
  FileText, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  TruckIcon,
  XCircle,
  BanIcon,
} from "lucide-react";

/**
 * Returns an icon component based on the certificate status
 */
export const getCertificateStatusIcon = (status: string) => {
  switch(status) {
  case "COMPLETED":
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  case "PENDING":
    return <Clock className="h-4 w-4 text-yellow-500" />;
  case "UNDER_REVIEW":
    return <AlertCircle className="h-4 w-4 text-purple-500" />;
  case "AWAITING_PAYMENT":
    return <AlertCircle className="h-4 w-4 text-orange-500" />;
  case "PROCESSING":
    return <CalendarClock className="h-4 w-4 text-blue-500" />;
  case "READY_FOR_PICKUP":
    return <FileText className="h-4 w-4 text-indigo-500" />;
  case "IN_TRANSIT":
    return <TruckIcon className="h-4 w-4 text-cyan-500" />;
  case "REJECTED":
    return <XCircle className="h-4 w-4 text-red-500" />;
  case "CANCELLED":
    return <BanIcon className="h-4 w-4 text-gray-500" />;
  default:
    return <FileText className="h-4 w-4" />;
  }
};
