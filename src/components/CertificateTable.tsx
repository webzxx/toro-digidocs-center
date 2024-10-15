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