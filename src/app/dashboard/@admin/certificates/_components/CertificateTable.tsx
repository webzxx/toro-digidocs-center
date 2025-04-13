import React from "react";
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
import { formatDateTime } from "@/lib/utils";
import CertificateActions from "./CertificateActions";
import { AdminCertificate } from "@/types/types";
import { getCertificateStatusBadge, getCertificateTypeBadge, getPaymentStatusBadge } from "@/components/utils";
import { PaymentStatus } from "@prisma/client";

interface CertificateTableProps {
  certificates?: AdminCertificate[];
  isLoading?: boolean;
  refetch: () => void;
}

export default function CertificateTable({ certificates, isLoading = false, refetch}: CertificateTableProps) {
  const isValidDate = (dateString: string): boolean => {
    return !isNaN(Date.parse(dateString));
  };

  const formatValue = (value: any): string => {
    if (typeof value === "string" && isValidDate(value)) {
      return formatDateTime(new Date(value));
    }
    return String(value);
  };

  const formatTitleCase = (str: string): string => str.replace(/([A-Z])/g, " $1").trim().replace(/^./, str => str.toUpperCase());

  const renderAdditionalInfo = (additionalInfo: any) => {
    if (!additionalInfo || Object.keys(additionalInfo).length === 0) return "N/A";
  
    const previewFields = Object.keys(additionalInfo).slice(0, 2);
    const previewString = previewFields
      .map(field => `${formatTitleCase(field)}: ${formatValue(additionalInfo[field])}`)
      .join(", ");
  
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="text-left">
            <span>{previewString.length > 30 ? `${previewString.slice(0, 30)}...` : previewString}</span>
          </TooltipTrigger>
          <TooltipContent className="w-80 p-0">
            <div className="rounded-md bg-white p-4 shadow-lg">
              <h4 className="mb-2 text-lg font-semibold">Additional Information</h4>
              <dl className="space-y-1">
                {Object.entries(additionalInfo).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-3 gap-2">
                    <dt className="col-span-1 text-sm font-medium capitalize text-gray-500">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </dt>
                    <dd className="col-span-2 text-sm text-gray-900">{formatValue(value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Function to determine payment status from certificate payments
  const renderPaymentStatus = (payments?: { id: number; amount: any; paymentStatus: PaymentStatus; paymentDate: Date | null }[]) => {
    if (!payments || payments.length === 0) {
      return <span className="text-sm text-gray-500">No payment</span>;
    }

    // Find the most recent active payment
    const payment = payments[0];
    
    // Use the utility function to return the appropriate badge
    return getPaymentStatusBadge(payment.paymentStatus);
  };

  // Function to display remarks with tooltip if text is long
  const renderRemarks = (remarks: string | null) => {
    if (!remarks) return <span className="text-sm text-gray-500">None</span>;
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <span className={remarks.length > 20 ? "cursor-pointer" : ""}>
              {remarks.length > 20 ? `${remarks.slice(0, 20)}...` : remarks}
            </span>
          </TooltipTrigger>
          {remarks.length > 20 && (
            <TooltipContent className="w-60 whitespace-normal text-wrap break-words">
              <div>{remarks}</div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-32">Reference</TableHead>
          <TableHead className="w-32">Resident ID</TableHead>
          <TableHead className="w-36">Certificate Type</TableHead>
          <TableHead>Purpose</TableHead>
          <TableHead>Request Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Remarks</TableHead>
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
                <div className="text-xs text-muted-foreground md:hidden">
                  {certificate.resident.firstName} {certificate.resident.lastName}
                </div>
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
                {formatDateTime(certificate.requestDate)}
              </TableCell>
              <TableCell>
                {getCertificateStatusBadge(certificate.status)}
              </TableCell>
              <TableCell>
                {renderPaymentStatus(certificate.payments)}
              </TableCell>
              <TableCell>
                {renderRemarks(certificate.remarks)}
              </TableCell>
              <TableCell>{renderAdditionalInfo(certificate.additionalInfo)}</TableCell>
              <TableCell>
                <CertificateActions
                  certificateId={certificate.id}
                  referenceNumber={certificate.referenceNumber}
                  purpose={certificate.purpose}
                  status={certificate.status}
                  remarks={certificate.remarks || ""}
                  refetch={refetch}
                />
              </TableCell>
            </TableRow>
          ))
        ): (
          <TableRow>
            <TableCell colSpan={9} className="py-8 text-center">
              No certificate requests found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}