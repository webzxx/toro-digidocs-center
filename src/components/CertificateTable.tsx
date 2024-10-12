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
import { CertificateRequest, CertificateType } from "@prisma/client";
import { formatDate } from '@/lib/utils';

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
            {certificates && certificates.length > 0 && (
              certificates.map((certificate) => (
                <TableRow key={certificate.id}>
                  <TableCell>{certificate.referenceNumber}</TableCell>
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
                        <TooltipContent className="w-60 whitespace-normal text-wrap break-words rounded-md bg-background p-2 shadow-md">
                          <div>{certificate.purpose}</div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {formatDate(certificate.requestDate)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}