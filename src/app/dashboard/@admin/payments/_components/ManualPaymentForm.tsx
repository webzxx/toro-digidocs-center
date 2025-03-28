// Create a shared payment form that can be used for both create and edit operations
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CertificateRequest, PaymentMethod, PaymentStatus, Resident } from "@prisma/client";
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
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2, Upload } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getPaymentStatusBadge } from "@/components/utils";

type CertificateWithDetails = CertificateRequest & {
  resident: Pick<Resident, "firstName" | "lastName" | "bahayToroSystemId">;
};

export type PaymentFormProps = {
  certificates: CertificateWithDetails[];
  initialData?: Partial<ManualPaymentInput> & { id?: number; proofOfPaymentPath?: string | null };
  onSubmit: (values: ManualPaymentInput, file: File | null) => Promise<void>;
  loading: boolean;
  formId: string;
  resetFileOnSubmit?: boolean;
};

export default function ManualPaymentForm({
  certificates,
  initialData,
  onSubmit,
  loading,
  formId,
  resetFileOnSubmit = true,
}: PaymentFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(
    initialData?.proofOfPaymentPath || null,
  );
  const isEditing = !!initialData?.id;

  const form = useForm<ManualPaymentInput>({
    resolver: zodResolver(manualPaymentSchema),
    defaultValues: {
      paymentDate: initialData?.paymentDate || format(new Date(), "yyyy-MM-dd"),
      paymentStatus: initialData?.paymentStatus || PaymentStatus.VERIFIED,
      notes: initialData?.notes || "",
      certificateRequestId: initialData?.certificateRequestId,
      amount: initialData?.amount?.toString() || "",
      paymentMethod: initialData?.paymentMethod,
      receiptNumber: initialData?.receiptNumber || "",
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
    if (filePreview && !initialData?.proofOfPaymentPath) {
      URL.revokeObjectURL(filePreview);
    }
    setFile(null);
    setFilePreview(isEditing ? null : initialData?.proofOfPaymentPath || null);
    form.setValue("proofOfPayment", undefined);
  };

  const handleFormSubmit = async (values: ManualPaymentInput) => {
    await onSubmit(values, file);
    if (resetFileOnSubmit) {
      removeFile();
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="certificateRequestId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certificate Request</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                value={field.value?.toString()}
                disabled={isEditing}
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
                      className={file || filePreview ? "w-3/4" : "w-full"}
                    />
                    {(file || filePreview) && (
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
                  {/* Show new file preview */}
                  {file && file.type.startsWith("image/") && (
                    <div className="relative h-40 mt-2 border rounded-md overflow-hidden">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt="Proof of payment preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  {/* Show existing file preview if editing */}
                  {!file && filePreview && initialData?.proofOfPaymentPath && (
                    <div className="relative h-40 mt-2 border rounded-md overflow-hidden">
                      <Image
                        src={initialData.proofOfPaymentPath}
                        alt="Proof of payment preview"
                        fill
                        className="object-contain"
                      />
                      <span className="absolute top-1 right-1 bg-black/70 text-white px-2 py-1 rounded text-xs">Current File</span>
                    </div>
                  )}
                  {file && !file.type.startsWith("image/") && (
                    <div className="flex items-center justify-center h-20 mt-2 border rounded-md bg-muted text-muted-foreground">
                      <Upload className="mr-2 h-5 w-5" />
                      <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  )}
                  {!file && initialData?.proofOfPaymentPath?.toLowerCase().endsWith(".pdf") && (
                    <div className="flex items-center justify-center h-20 mt-2 border rounded-md bg-muted text-muted-foreground">
                      <Upload className="mr-2 h-5 w-5" />
                      <span>Current file: PDF Document</span>
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
  );
}