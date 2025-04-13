"use client";

import { useId, useState } from "react";
import { CertificateRequest, Resident } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { ManualPaymentInput } from "@/types/types";
import { createManualPayment } from "../actions";
import { Loader2, Plus } from "lucide-react";
import ManualPaymentForm from "./ManualPaymentForm";

export type CertificateWithDetails = CertificateRequest & {
  resident: Pick<Resident, "firstName" | "lastName" | "bahayToroSystemId">;
};

type ManualPaymentButtonProps = {
  certificates: CertificateWithDetails[];
  onSuccess?: () => void;
};

export default function ManualPaymentButton({ certificates, onSuccess }: ManualPaymentButtonProps) {
  const formId = useId();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: ManualPaymentInput, file: File | null) => {
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
      
      const result = await createManualPayment(dataWithoutFile, files);
      
      if (result.success) {
        toast({
          title: "Payment created",
          description: "The manual payment has been successfully recorded",
        });
        setOpen(false);
        if (onSuccess) onSuccess();
        return;
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
        description: "Failed to create payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-10 gap-2 p-0 min-[530px]:w-auto min-[530px]:px-4 min-[530px]:py-2"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden min-[530px]:block min-[640px]:hidden">Add</span>
          <span className="sr-only min-[640px]:not-sr-only">Add Manual Payment</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] max-w-[95%] flex-col p-0 sm:max-w-[600px]">
        <div className="px-6 pt-6">
          <DialogHeader>
            <DialogTitle>Add Manual Payment</DialogTitle>
            <DialogDescription>
                Record a manual payment for a certificate request
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6">
          <ManualPaymentForm
            certificates={certificates}
            onSubmit={handleSubmit}
            formId={formId}
          />
        </div>

        <DialogFooter className="mt-auto flex-col gap-2 border-t px-6 py-4 sm:flex-row">
          <Button 
            type="submit" 
            form={formId} 
            disabled={loading} 
            className="w-full sm:w-auto"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}