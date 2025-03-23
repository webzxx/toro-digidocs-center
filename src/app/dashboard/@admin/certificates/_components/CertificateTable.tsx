import React from 'react';
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
import { formatDate } from '@/lib/utils';
import CertificateActions from './CertificateActions';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AdminCertificate } from '@/types/types';
import { getCertificateStatusBadge, getCertificateStatusIcon, getCertificateTypeBadge } from '@/components/utils';

interface CertificateTableProps {
  certificates?: AdminCertificate[];
  isLoading?: boolean;
}

export default function CertificateTable({ certificates, isLoading = false }: CertificateTableProps) {
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
    <ScrollArea className="max-h-[70vh] w-full">
      <Table>
        <TableHeader className="sticky top-0 bg-white z-10">
          <TableRow>
            <TableHead className="w-32">Reference</TableHead>
            <TableHead className="w-32">Resident ID</TableHead>
            <TableHead className="w-36">Certificate Type</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead>Request Date</TableHead>
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
                <TableCell>
                  <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                    {certificate.resident.bahayToroSystemId}
                    </TooltipTrigger>
                    <TooltipContent>
                    {`${certificate.resident.firstName} ${certificate.resident.lastName}`}
                    </TooltipContent>
                  </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>{getCertificateTypeBadge(certificate.certificateType)}</TableCell>
                <TableCell>
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
                <TableCell>
                  {formatDate(certificate.requestDate)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0">
                      {getCertificateStatusIcon(certificate.status)}
                    </div>
                    <div className="flex-grow">
                      {getCertificateStatusBadge(certificate.status)}
                    </div>
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
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}