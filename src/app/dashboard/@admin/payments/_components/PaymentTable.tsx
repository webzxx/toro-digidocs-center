import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CertificateRequest, Payment, Resident } from "@prisma/client";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { getPaymentStatusBadge } from "@/components/utils/badges";
import PaymentActions from "./PaymentActions";
import { CertificateWithDetails } from "./ManualPaymentButton";

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
            <TableRow key={payment.id} className={isLoading ? "opacity-50" : ""}>
              <TableCell>
                <div className="font-medium">
                  {payment.transactionReference ? (
                    <p>{payment.transactionReference}</p>
                  ) : (
                    <span className="text-muted-foreground italic">No reference</span>
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
                {payment.paymentMethod?.replace(/_/g, " ")}
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