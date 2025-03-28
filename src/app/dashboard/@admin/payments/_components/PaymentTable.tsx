import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CertificateRequest, Payment, Resident } from "@prisma/client";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { getPaymentStatusBadge } from "@/components/utils/badges";
import PaymentActions from "./PaymentActions";
import { CertificateWithDetails } from "./ManualPaymentButton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";

type PaymentWithDetails = Payment & {
  certificateRequest?: CertificateRequest & {
    referenceNumber: string;
    certificateType: string;
    resident: Pick<Resident, "firstName" | "lastName" | "bahayToroSystemId">;
  };
};

interface PaymentTableProps {
  payments: PaymentWithDetails[];
  certificates: CertificateWithDetails[];
  isLoading?: boolean;
  refetch?: () => void;
}

export default function PaymentTable({ payments, certificates, isLoading, refetch }: PaymentTableProps) {  
  // Function to check if the payment is an active online transaction
  const isActiveOnlineTransaction = (payment: PaymentWithDetails) => {
    return payment.isActive && payment.paymentMethod === "MAYA" && payment.paymentStatus === "PENDING";
  };
  
  // Function to get the background color class for the row
  const getRowClassName = (payment: PaymentWithDetails) => {
    const baseClasses = isLoading ? "opacity-50" : "";
    
    if (isActiveOnlineTransaction(payment)) {
      return `${baseClasses} bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-950/50 relative`;
    }
    
    return baseClasses;
  };
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-44">Transaction Ref</TableHead>
          <TableHead className="hidden md:table-cell">Resident</TableHead>
          <TableHead className="hidden md:table-cell">Certificate</TableHead>
          <TableHead className="hidden sm:table-cell">Amount</TableHead>
          <TableHead className="hidden sm:table-cell">Method</TableHead>
          <TableHead className="hidden sm:table-cell">Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments && payments.length > 0 ? (
          payments.map((payment) => (
            <TableRow key={payment.id} className={getRowClassName(payment)}>
              <TableCell>
                <div className="font-medium flex items-center gap-2">
                  {payment.transactionReference ? (
                    <p>{payment.transactionReference}</p>
                  ) : (
                    <span className="text-muted-foreground italic">No reference</span>
                  )}
                  
                  {isActiveOnlineTransaction(payment) && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex-shrink-0">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Active online payment session</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div className="md:hidden text-xs text-muted-foreground">
                  {payment.certificateRequest?.resident?.firstName} {payment.certificateRequest?.resident?.lastName}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {payment.certificateRequest?.resident ? (
                  <div>
                    <div className="font-medium">
                      {payment.certificateRequest.resident.firstName} {payment.certificateRequest.resident.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ID: {payment.certificateRequest.resident.bahayToroSystemId}
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">Unknown</span>
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {payment.certificateRequest ? (
                  <div>
                    <div className="font-medium">{payment.certificateRequest.certificateType.replace(/_/g, " ")}</div>
                    <div className="text-xs text-muted-foreground">
                      Ref: {payment.certificateRequest.referenceNumber}
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">Unknown</span>
                )}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {formatCurrency(Number(payment.amount))}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <div className="flex items-center gap-1">
                  {payment.paymentMethod?.replace(/_/g, " ")}
                  {isActiveOnlineTransaction(payment) && (
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertCircle className="h-4 w-4 text-blue-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Active checkout session in progress</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {formatDateShort(payment.paymentDate || payment.createdAt)}
              </TableCell>
              <TableCell>
                {getPaymentStatusBadge(payment.paymentStatus)}
              </TableCell>
              <TableCell className="text-right">
                <PaymentActions 
                  payment={payment} 
                  refetch={refetch}
                  certificates={certificates}
                />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="h-24 text-center">
              No payments found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}