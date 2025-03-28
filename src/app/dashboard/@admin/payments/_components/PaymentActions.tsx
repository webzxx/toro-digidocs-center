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
  Edit2,
  Loader2,
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
import ManualPaymentForm from "./ManualPaymentForm";
import { ManualPaymentInput } from "@/types/types";
import { updatePayment } from "@/app/actions/payment";
import { format } from "date-fns";
import { CertificateWithDetails } from "./ManualPaymentButton";

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
  certificates: CertificateWithDetails[];
}

export default function PaymentActions({
  payment,
  refetch,
  certificates,
}: PaymentActionsProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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

  // Handle payment edit
  const handleUpdatePayment = async (values: ManualPaymentInput, file: File | null) => {
    setLoading(true);
    try {
      // Create a FormData object to handle the file upload
      const files = new FormData();
      
      // Add the proof of payment file to FormData if it exists
      if (file) {
        files.append("proofOfPayment", file);
      }
      
      // Create a copy of values without the proofOfPayment property
      const { proofOfPayment, ...dataWithoutFile } = values;
      
      const result = await updatePayment(payment.id, dataWithoutFile, files);
      
      if (result.success) {
        toast({
          title: "Payment updated",
          description: "The payment has been successfully updated",
        });
        setIsEditOpen(false);
        if (refetch) refetch();
      } else if (result.fieldErrors) {
        // Handle field validation errors
        Object.entries(result.fieldErrors).forEach(([field, errors]) => {
          if (errors && errors.length > 0) {
            toast({
              title: `Error in ${field}`,
              description: errors[0],
              variant: "destructive",
            });
          }
        });
      } else if (result.serverError) {
        toast({
          title: "Error",
          description: result.serverError,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  // Prepare payment data for the edit form
  const getInitialEditData = () => {
    return {
      id: payment.id,
      certificateRequestId: payment.certificateRequestId,
      amount: payment.amount.toString(),
      paymentMethod: payment.paymentMethod,
      paymentStatus: payment.paymentStatus,
      paymentDate: format(new Date(payment.paymentDate || payment.createdAt), "yyyy-MM-dd"),
      notes: payment.notes || "",
      receiptNumber: payment.receiptNumber || "",
      proofOfPaymentPath: payment.proofOfPaymentPath,
    };
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
        <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
          <DialogHeader>
            <h2 className="text-xl font-semibold">Payment Receipt</h2>
            <DialogDescription>
              Receipt for payment {payment.transactionReference || "N/A"}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[calc(80vh-180px)]">
            <div className="space-y-6 pr-4">
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
                  <div className="border rounded-md p-2 mt-2 overflow-hidden">
                    {payment.proofOfPaymentPath.toLowerCase().endsWith(".pdf") ? (
                      <div className="flex flex-col items-center justify-center p-4 gap-2">
                        <FileText className="h-12 w-12 text-blue-500" />
                        <p className="text-sm text-gray-600">PDF Document</p>
                        <a 
                          href={payment.proofOfPaymentPath} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors"
                        >
                          View PDF
                        </a>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="max-h-[400px] overflow-hidden">
                          <Image 
                            src={payment.proofOfPaymentPath} 
                            alt="Proof of payment" 
                            width={500} 
                            height={300} 
                            className="w-full h-auto object-contain" 
                          />
                        </div>
                        <a 
                          href={payment.proofOfPaymentPath} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs hover:bg-black/90 transition-colors"
                        >
                          Open Full Size
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-amber-600">No payment proof available</p>
              )}
              
              {payment.paymentMethod && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Method</h3>
                  <p className="text-base">{payment.paymentMethod.replace(/_/g, " ")}</p>
                </div>
              )}
              
              {payment.paymentDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Date</h3>
                  <p className="text-base">{formatDate(payment.paymentDate)}</p>
                </div>
              )}
              
              {payment.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Notes</h3>
                  <p className="text-base">{payment.notes}</p>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            {(payment.receiptNumber || payment.proofOfPaymentPath) && (
              <a 
                href={payment.proofOfPaymentPath ?? ""} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Download
              </a>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Payment */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Edit2 className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] flex flex-col p-0 sm:max-w-[600px]">
          <div className="px-6 pt-6">
            <DialogHeader>
              <h2 className="text-xl font-semibold">Edit Payment</h2>
              <DialogDescription>
                Edit payment {payment.transactionReference || "N/A"}
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="overflow-y-auto px-6 flex-1">
            <ManualPaymentForm
              certificates={certificates}
              initialData={getInitialEditData()}
              onSubmit={handleUpdatePayment}
              loading={loading}
              formId="edit-payment-form"
              resetFileOnSubmit={false}
            />
          </div>

          <DialogFooter className="border-t px-6 py-4 mt-auto">
            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="mr-2">
              Cancel
            </Button>
            <Button type="submit" form="edit-payment-form" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status-specific actions */}
      {renderActions()}
    </div>
  );
}