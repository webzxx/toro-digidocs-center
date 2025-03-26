"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  FileText, 
  Eye,
  Check,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { CertificateRequest, Payment, PaymentStatus, Resident } from "@prisma/client";
import { DialogClose } from "@radix-ui/react-dialog";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { approvePayment, rejectPayment } from "../actions";
import { PaymentDetails } from "@/components/payment/PaymentDetails";
import { ScrollArea } from "@/components/ui/scroll-area";

type PaymentWithDetails = Payment & {
  certificateRequest?: CertificateRequest & {
    referenceNumber: string;
    certificateType: string;
    resident: Pick<Resident, "firstName" | "lastName" | "bahayToroSystemId">;
  };
};

interface PaymentActionsProps {
  payment: PaymentWithDetails;
  refetch?: () => void;
}

export default function PaymentActions({
  payment,
  refetch,
}: PaymentActionsProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const queryClient = useQueryClient();

  // Handle payment approval
  const handleApprovePayment = async () => {
    try {
      await approvePayment(payment.id);
      
      // Invalidate queries and refetch
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      if (refetch) refetch();
      
      toast({
        title: "Payment approved",
        description: "The payment has been marked as approved.",
      });
    } catch (error) {
      console.error("Error approving payment:", error);
      toast({
        title: "Failed to approve payment",
        description: "There was a problem updating the payment status.",
        variant: "destructive",
      });
    }
  };

  // Handle payment rejection
  const handleRejectPayment = async () => {
    try {
      await rejectPayment(payment.id);
      
      // Invalidate queries and refetch
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      if (refetch) refetch();
      
      toast({
        title: "Payment rejected",
        description: "The payment has been marked as rejected.",
      });
    } catch (error) {
      console.error("Error rejecting payment:", error);
      toast({
        title: "Failed to reject payment",
        description: "There was a problem updating the payment status.",
        variant: "destructive",
      });
    }
  };

  // Format JSON for display
  const formatJson = (json: any) => {
    if (!json) return "No metadata available";
    try {
      return JSON.stringify(json, null, 2);
    } catch (e) {
      return "Invalid JSON metadata";
    }
  };

  const renderActions = () => {
    switch (payment.paymentStatus) {
    case PaymentStatus.PENDING:
      return (
        <>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleApprovePayment} 
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <Check className="size-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRejectPayment}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="size-4" />
          </Button>
        </>
      );
    default:
      return null;
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {/* View Payment Details */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Eye className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
          <DialogHeader>
            <h2 className="text-xl font-semibold">Payment Details</h2>
            <DialogDescription>
              Details for payment {payment.transactionReference || "N/A"}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[calc(80vh-180px)]">
            <div className="pr-4">
              <PaymentDetails 
                payment={payment} 
                showAmounts
                showStatus 
              />
              
              <div className="space-y-4 mt-6">
                <div className="bg-gray-100 h-1 w-full rounded-full my-6"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Created At</h3>
                    <p className="text-base">{formatDate(payment.createdAt)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Updated At</h3>
                    <p className="text-base">{formatDate(payment.updatedAt)}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Notes</h3>
                  <p className="text-base">{payment.notes || "No notes available"}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Metadata</h3>
                  <pre className="bg-gray-50 p-3 rounded-md overflow-auto text-xs max-h-40 whitespace-pre-wrap">{formatJson(payment.metadata)}</pre>
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Receipt */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" disabled={payment.paymentStatus !== PaymentStatus.SUCCEEDED && payment.paymentStatus !== PaymentStatus.VERIFIED}>
            <FileText className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <h2 className="text-xl font-semibold">Payment Receipt</h2>
            <DialogDescription>
              Receipt for payment {payment.transactionReference || "N/A"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {payment.receiptNumber ? (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Receipt Number</h3>
                <p className="font-mono text-base">{payment.receiptNumber}</p>
              </div>
            ) : (
              <p className="text-amber-600">No receipt number available</p>
            )}
            
            {payment.proofOfPaymentPath ? (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Proof of Payment</h3>
                <div className="border rounded-md p-2 mt-2">
                  <Image 
                    src={payment.proofOfPaymentPath} 
                    alt="Proof of payment" 
                    width={500} 
                    height={300} 
                    className="object-contain"
                  />
                </div>
              </div>
            ) : (
              <p className="text-amber-600">No payment proof available</p>
            )}
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            {(payment.receiptNumber || payment.proofOfPaymentPath) && (
              <Button onClick={() => window.print()}>Print Receipt</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status-specific actions */}
      {renderActions()}
    </div>
  );
}