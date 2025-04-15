import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDateTimeShort } from "@/lib/utils";
import { getPaymentStatusBadge } from "@/components/utils/badges";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";
import { AdminCertificateForAwaitingPayment, AdminPayment } from "@/types/admin";
import PaymentActions from "./PaymentActions";

interface PaymentTableProps {
  payments: AdminPayment[];
  certificates: AdminCertificateForAwaitingPayment[];
  isLoading?: boolean;
  refetch?: () => void;
}

export default function PaymentTable({ payments, certificates, isLoading, refetch }: PaymentTableProps) {  
  // Function to check if the payment is an active online transaction
  const isActiveOnlineTransaction = (payment: AdminPayment) => {
    return payment.isActive && payment.paymentMethod === "MAYA" && payment.paymentStatus === "PENDING";
  };
  
  // Function to get the background color class for the row
  const getRowClassName = (payment: AdminPayment) => {
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
          <TableHead>Resident</TableHead>
          <TableHead>Certificate</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments && payments.length > 0 ? (
          payments.map((payment) => (
            <TableRow key={payment.id} className={getRowClassName(payment)}>
              <TableCell>
                <div className="flex items-center gap-2 font-medium">
                  {payment.transactionReference ? (
                    <p>{payment.transactionReference}</p>
                  ) : (
                    <span className="italic text-muted-foreground">No reference</span>
                  )}
                  
                  {isActiveOnlineTransaction(payment) && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex-shrink-0">
                            <span className="relative flex h-3 w-3">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500"></span>
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
                <div className="text-xs text-muted-foreground md:hidden">
                  {payment.certificateRequest?.resident?.firstName} {payment.certificateRequest?.resident?.lastName}
                </div>
              </TableCell>
              <TableCell>
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
                  <span className="italic text-muted-foreground">Unknown</span>
                )}
              </TableCell>
              <TableCell>
                {payment.certificateRequest ? (
                  <div>
                    <div className="font-medium">{payment.certificateRequest.certificateType.replace(/_/g, " ")}</div>
                    <div className="text-xs text-muted-foreground">
                      Ref: {payment.certificateRequest.referenceNumber}
                    </div>
                  </div>
                ) : (
                  <span className="italic text-muted-foreground">Unknown</span>
                )}
              </TableCell>
              <TableCell>
                {formatCurrency(Number(payment.amount))}
              </TableCell>
              <TableCell>
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
              <TableCell>
                {formatDateTimeShort(payment.paymentDate || payment.createdAt)}
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