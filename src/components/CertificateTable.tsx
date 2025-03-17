import React from 'react';
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { CertificateRequest, CertificateStatus, CertificateType } from "@prisma/client";
import { formatDate } from '@/lib/utils';
import CertificateActions from './CertificateActions';
import { ScrollArea } from "@/components/ui/scroll-area";

interface CertificateTableProps {
  certificates?: CertificateRequest[];
  isLoading?: boolean;
}

export default function CertificateTable({ certificates, isLoading = false }: CertificateTableProps) {
  // Get status icon
  const getStatusIcon = (status: string) => {
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

  const getCertificateTypeBadge = (type: CertificateType) => {
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
      <Badge variant="outline" className={`${getColor()} font-medium`}>
        {type.replace(/_/g, " ")}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'COMPLETED':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 font-medium">{status.replace(/_/g, ' ')}</Badge>;
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 font-medium">{status.replace(/_/g, ' ')}</Badge>;
      case 'UNDER_REVIEW':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 font-medium">{status.replace(/_/g, ' ')}</Badge>;
      case 'AWAITING_PAYMENT':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200 font-medium">{status.replace(/_/g, ' ')}</Badge>;
      case 'PROCESSING':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 font-medium">{status.replace(/_/g, ' ')}</Badge>;
      case 'READY_FOR_PICKUP':
        return <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-200 font-medium">{status.replace(/_/g, ' ')}</Badge>;
      case 'IN_TRANSIT':
        return <Badge variant="outline" className="bg-cyan-100 text-cyan-800 border-cyan-200 font-medium">{status.replace(/_/g, ' ')}</Badge>;
      case 'REJECTED':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 font-medium">{status.replace(/_/g, ' ')}</Badge>;
      case 'CANCELLED':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 font-medium">{status.replace(/_/g, ' ')}</Badge>;
      default:
        return <Badge variant="outline">{String(status).replace(/_/g, ' ')}</Badge>;
    }
  };

  const isValidDate = (dateString: string): boolean => {
    return !isNaN(Date.parse(dateString));
  };

  const formatValue = (value: any): string => {
    if (typeof value === 'string' && isValidDate(value)) {
      return formatDate(new Date(value));
    }
    return String(value);
  };

  const formatTitleCase = (str: string): string => str.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())

  const renderAdditionalInfo = (additionalInfo: any) => {
    if (!additionalInfo || Object.keys(additionalInfo).length === 0) return "N/A";
  
    const previewFields = Object.keys(additionalInfo).slice(0, 2);
    const previewString = previewFields
      .map(field => `${formatTitleCase(field)}: ${formatValue(additionalInfo[field])}`)
      .join(', ');
  
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="text-left">
            {previewString.length > 30 ? `${previewString.slice(0, 30)}...` : previewString}
          </TooltipTrigger>
          <TooltipContent className="w-80 p-0">
            <div className="bg-white rounded-md shadow-lg p-4">
              <h4 className="font-semibold text-lg mb-2">Additional Information</h4>
              <dl className="space-y-1">
                {Object.entries(additionalInfo).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-3 gap-2">
                    <dt className="text-sm font-medium text-gray-500 capitalize col-span-1">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2">{formatValue(value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <ScrollArea className="max-h-[70vh]">
      <Table>
        <TableHeader className="sticky top-0 bg-white z-10">
          <TableRow>
            <TableHead className="w-[150px]">Reference</TableHead>
            <TableHead>Resident ID</TableHead>
            <TableHead>Certificate Type</TableHead>
            <TableHead className="hidden md:table-cell">Purpose</TableHead>
            <TableHead className="hidden sm:table-cell">Request Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Additional Info</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certificates && certificates.length > 0 ? (
            certificates.map((certificate) => (
              <TableRow 
                key={certificate.id}
                className={isLoading ? "animate-pulse bg-gradient-to-r from-transparent via-gray-200/60 to-transparent bg-[length:400%_100%] bg-[0%_0] transition-all" : ""}
              >
                <TableCell>
                  <div className="font-medium">{certificate.referenceNumber}</div>
                </TableCell>
                <TableCell>{certificate.residentId}</TableCell>
                <TableCell>{getCertificateTypeBadge(certificate.certificateType)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {certificate.purpose.length > 20
                          ? `${certificate.purpose.slice(0, 20)}...`
                          : certificate.purpose}
                      </TooltipTrigger>
                      <TooltipContent className="w-60 whitespace-normal text-wrap break-words">
                        <div>{certificate.purpose}</div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {formatDate(certificate.requestDate)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(certificate.status)}
                    {getStatusBadge(certificate.status)}
                  </div>
                </TableCell>
                <TableCell>{renderAdditionalInfo(certificate.additionalInfo)}</TableCell>
                <TableCell>
                  <CertificateActions
                    certificateId={certificate.id}
                    referenceNumber={certificate.referenceNumber}
                    certificateType={certificate.certificateType}
                    purpose={certificate.purpose}
                    status={certificate.status}
                  />
                </TableCell>
              </TableRow>
            ))
          ): (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                No certificate requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}