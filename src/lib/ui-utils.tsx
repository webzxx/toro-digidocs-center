import React from 'react';
import { Badge } from "@/components/ui/badge";
import { 
  CalendarClock, 
  FileText, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  TruckIcon,
  XCircle,
  BanIcon
} from "lucide-react";
import { CertificateType, CertificateStatus } from '@prisma/client';

/**
 * Returns an icon component based on the certificate status
 */
export const getCertificateStatusIcon = (status: string) => {
  switch(status) {
    case 'COMPLETED':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'PENDING':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'UNDER_REVIEW':
      return <AlertCircle className="h-4 w-4 text-purple-500" />;
    case 'AWAITING_PAYMENT':
      return <AlertCircle className="h-4 w-4 text-orange-500" />;
    case 'PROCESSING':
      return <CalendarClock className="h-4 w-4 text-blue-500" />;
    case 'READY_FOR_PICKUP':
      return <FileText className="h-4 w-4 text-indigo-500" />;
    case 'IN_TRANSIT':
      return <TruckIcon className="h-4 w-4 text-cyan-500" />;
    case 'REJECTED':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'CANCELLED':
      return <BanIcon className="h-4 w-4 text-gray-500" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

/**
 * Returns a styled badge for certificate status
 */
export const getCertificateStatusBadge = (status: string) => {
  const formattedStatus = status.replace(/_/g, ' ');
  
  const getClassNameForStatus = (status: string) => {
    switch(status) {
      case 'COMPLETED':
        return "bg-green-100 text-green-800 border-green-200";
      case 'PENDING':
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'UNDER_REVIEW':
        return "bg-purple-100 text-purple-800 border-purple-200";
      case 'AWAITING_PAYMENT':
        return "bg-orange-100 text-orange-800 border-orange-200";
      case 'PROCESSING':
        return "bg-blue-100 text-blue-800 border-blue-200";
      case 'READY_FOR_PICKUP':
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case 'IN_TRANSIT':
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case 'REJECTED':
        return "bg-red-100 text-red-800 border-red-200";
      case 'CANCELLED':
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "";
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`text-center font-medium ${getClassNameForStatus(status)}`}
    >
      {formattedStatus}
    </Badge>
  );
};
/**
 * Returns a styled badge for certificate type
 */
export const getCertificateTypeBadge = (type: CertificateType) => {
  const getColor = () => {
    switch (type) {
      case 'BARANGAY_CLEARANCE':
      case 'GOOD_MORAL':
      case 'TRANSFER_OF_RESIDENCY':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'BARANGAY_ID':
      case 'NO_INCOME':
      case 'LIVING_STILL':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'SOLO_PARENT':
      case 'FIRST_TIME_JOB_SEEKER':
      case 'BIRTH_FACT':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'COHABITATION':
      case 'RESIDENCY':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Badge variant="outline" className={`${getColor()} text-center font-medium min-w-28 max-w-36 line-clamp-2 text-xs`}>
      {type.replace(/_/g, " ")}
    </Badge>
  );
};