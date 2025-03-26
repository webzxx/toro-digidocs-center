"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CertificateRequest, PaymentMethod, PaymentStatus, Resident } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { ManualPaymentInput, manualPaymentSchema } from "@/types/types";
import { createManualPayment } from "@/app/actions/payment";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2, Plus, Upload } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { getPaymentStatusBadge } from "@/components/utils";

type CertificateWithDetails = CertificateRequest & {
  resident: Pick<Resident, "firstName" | "lastName" | "bahayToroSystemId">;
};

type ManualPaymentButtonProps = {
  certificates: CertificateWithDetails[];
  onSuccess?: () => void;
};

export default function ManualPaymentButton({ certificates, onSuccess }: ManualPaymentButtonProps) {
  const formId = "manual-payment-form";
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const form = useForm<ManualPaymentInput>({
    resolver: zodResolver(manualPaymentSchema),
    defaultValues: {
      paymentDate: format(new Date(), "yyyy-MM-dd"),
      paymentStatus: PaymentStatus.VERIFIED,
      notes: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "The file you selected is larger than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Only JPG, PNG, GIF, and PDF files are supported",
          variant: "destructive",
        });
        return;
      }

      setFile(selectedFile);
      
      // Create preview URL (only for images)
      if (selectedFile.type.startsWith("image/")) {
        const previewUrl = URL.createObjectURL(selectedFile);
        setFilePreview(previewUrl);
      } else {
        setFilePreview(null);
      }
      
      // Update form
      form.setValue("proofOfPayment", selectedFile);
    }
  };

  const removeFile = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFile(null);
    setFilePreview(null);
    form.setValue("proofOfPayment", undefined);
  };

  const onSubmit = async (values: ManualPaymentInput) => {
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
        form.reset();
        removeFile();
        if (onSuccess) onSuccess();
      } else if (result.fieldErrors) {
        // Handle field validation errors
        Object.entries(result.fieldErrors).forEach(([field, errors]) => {
          if (errors && errors.length > 0) {
            form.setError(field as any, {
              type: "manual",
              message: errors[0],
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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Manual Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] flex flex-col p-0">
        <div className="px-6 pt-6">
          <DialogHeader>
            <DialogTitle>Add Manual Payment</DialogTitle>
            <DialogDescription>
                Record a manual payment for a certificate request
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="overflow-y-auto px-6 flex-1">
          <Form {...form}>
            <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="certificateRequestId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate Request</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a certificate request" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {certificates.map((cert) => (
                          <SelectItem key={cert.id} value={cert.id.toString()}>
                            {cert.referenceNumber} - {cert.resident.firstName} {cert.resident.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (PHP)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="0.00"
                        inputMode="decimal"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(PaymentMethod).map((method) => (
                            <SelectItem key={method} value={method}>
                              {method.replace(/_/g, " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            
                <FormField
                  control={form.control}
                  name="paymentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(PaymentStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {getPaymentStatusBadge(status)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="paymentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Payment Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="receiptNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Receipt Number (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Receipt number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="proofOfPayment"
                render={() => (
                  <FormItem>
                    <FormLabel>Proof of Payment (Optional)</FormLabel>
                    <FormControl>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept=".jpg,.jpeg,.png,.gif,.pdf"
                            onChange={handleFileChange}
                            className={file ? "w-3/4" : "w-full"}
                          />
                          {file && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={removeFile}
                              className="w-1/4"
                            >
                                Remove
                            </Button>
                          )}
                        </div>
                        {filePreview && (
                          <div className="relative h-40 mt-2 border rounded-md overflow-hidden">
                            <Image
                              src={filePreview}
                              alt="Proof of payment preview"
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                        {file && !filePreview && (
                          <div className="flex items-center justify-center h-20 mt-2 border rounded-md bg-muted text-muted-foreground">
                            <Upload className="mr-2 h-5 w-5" />
                            <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Additional notes about this payment"
                        className="min-h-[80px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <div className="border-t px-6 py-4 mt-auto">
          <Button type="submit" form={formId} disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}