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
import { CertificateRequest, CertificateStatus, CertificateType } from "@prisma/client";
import { formatDate } from '@/lib/utils';
import CertificateActions from './CertificateActions';

interface CertificateTableProps {
  certificates?: CertificateRequest[];
  onReload: () => void;
}

export default function CertificateTable({ certificates, onReload }: CertificateTableProps) {
  // You can change the current implementation to use this instead if you want to use the Badge component
  const getCertificateTypeBadge = (type: CertificateType) => {
    const variants: { [key in CertificateType]: "default" | "secondary" | "destructive" | "outline" } = {
      BARANGAY_CLEARANCE: "default",
      BARANGAY_ID: "secondary",
      SOLO_PARENT: "destructive",
      COHABITATION: "outline",
      GOOD_MORAL: "default",
      NO_INCOME: "secondary",
      FIRST_TIME_JOB_SEEKER: "destructive",
      RESIDENCY: "outline",
      TRANSFER_OF_RESIDENCY: "default",
      LIVING_STILL: "secondary",
      BIRTH_FACT: "destructive",
    };

    return (
      <Badge variant={variants[type]}>
        {type.replace(/_/g, " ")}
      </Badge>
    );
  };

  const getCertificateTypeCustomBadge = (type: CertificateType) => {
    const getColor = () => {
      switch (type) {
        case 'BARANGAY_CLEARANCE':
        case 'GOOD_MORAL':
        case 'TRANSFER_OF_RESIDENCY':
          return 'bg-blue-100 text-blue-800';
        case 'BARANGAY_ID':
        case 'NO_INCOME':
        case 'LIVING_STILL':
          return 'bg-green-100 text-green-800';
        case 'SOLO_PARENT':
        case 'FIRST_TIME_JOB_SEEKER':
        case 'BIRTH_FACT':
          return 'bg-red-100 text-red-800';
        case 'COHABITATION':
        case 'RESIDENCY':
          return 'bg-yellow-100 text-yellow-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColor()}`}>
        {type.replace(/_/g, " ")}
      </span>
    );
  };

  const getStatusBadge = (status: CertificateStatus) => {
    const getColor = () => {
      switch (status) {
        case 'PENDING':
          return 'bg-yellow-100 text-yellow-800';
        case 'PROCESSING':
          return 'bg-blue-100 text-blue-800';
        case 'COMPLETED':
          return 'bg-green-100 text-green-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColor()}`}>
        {status}
      </span>
    );
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
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
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
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Certificates</CardTitle>
        <CardDescription>List of Certificate Requests in Barangay Bahay Toro.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference Number</TableHead>
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
                <TableRow key={certificate.id}>
                  <TableCell>{certificate.referenceNumber}</TableCell>
                  <TableCell>{certificate.residentId}</TableCell>
                  <TableCell>{getCertificateTypeCustomBadge(certificate.certificateType)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {certificate.purpose.length > 20
                            ? `${certificate.purpose.slice(0, 20)}...`
                            : certificate.purpose}
                        </TooltipTrigger>
                        <TooltipContent className="w-60 whitespace-normal text-wrap break-words rounded-md bg-background p-2 shadow-md">
                          <div>{certificate.purpose}</div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {formatDate(certificate.requestDate)}
                  </TableCell>
                  <TableCell>{getStatusBadge(certificate.status)}</TableCell>
                  <TableCell>{renderAdditionalInfo(certificate.additionalInfo)}</TableCell>
                  <TableCell>
                    <CertificateActions
                      certificateId={certificate.id}
                      referenceNumber={certificate.referenceNumber}
                      certificateType={certificate.certificateType}
                      purpose={certificate.purpose}
                      status={certificate.status}
                      onReload={onReload}
                    />
                  </TableCell>
                </TableRow>
              ))
            ): (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No certificate requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}