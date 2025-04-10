// Create a shared payment form that can be used for both create and edit operations
import { useState, useEffect, useRef } from "react";
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
import { CalendarIcon, Upload, Check, ChevronsUpDown, Search } from "lucide-react";
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
  const [certificateSearchOpen, setCertificateSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredCertificates, setFilteredCertificates] = useState<CertificateWithDetails[]>(certificates);
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // Add refs for detecting outside clicks
  const certificateDropdownRef = useRef<HTMLDivElement>(null);
  const calendarDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchValue) {
      setFilteredCertificates(
        certificates.filter(cert => {
          const refNumber = cert.referenceNumber.toLowerCase();
          const fullName = `${cert.resident.firstName} ${cert.resident.lastName}`.toLowerCase();
          const bahayToroId = cert.resident.bahayToroSystemId.toLowerCase();
          const search = searchValue.toLowerCase();
          
          return refNumber.includes(search) || 
                 fullName.includes(search) || 
                 bahayToroId.includes(search);
        }),
      );
    } else {
      setFilteredCertificates(certificates);
    }
  }, [certificates, searchValue]);
  
  // Handle outside click for dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close certificate dropdown when clicking outside
      if (certificateSearchOpen && 
          certificateDropdownRef.current && 
          !certificateDropdownRef.current.contains(event.target as Node)) {
        setCertificateSearchOpen(false);
      }
      
      // Close calendar dropdown when clicking outside
      if (calendarOpen &&
          calendarDropdownRef.current &&
          !calendarDropdownRef.current.contains(event.target as Node)) {
        setCalendarOpen(false);
      }
    }
    
    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [certificateSearchOpen, calendarOpen]);

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

  // Find selected certificate details
  const selectedCertificate = certificates.find(
    cert => cert.id === form.watch("certificateRequestId"),
  );

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="certificateRequestId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Certificate Request</FormLabel>
              <div className="relative w-full" ref={certificateDropdownRef}>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground",
                  )}
                  onClick={() => setCertificateSearchOpen(!certificateSearchOpen)}
                  disabled={isEditing}
                  type="button"
                >
                  {field.value ? (
                    selectedCertificate ? 
                      `${selectedCertificate.referenceNumber} - ${selectedCertificate.resident.firstName} ${selectedCertificate.resident.lastName}` : 
                      "Select a certificate request"
                  ) : (
                    "Select a certificate request"
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
                {certificateSearchOpen && (
                  <div className="absolute top-full z-[60] mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                    <div className="relative flex items-center border-b px-3">
                      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                      <input
                        className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Search certificates..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                      />
                    </div>
                    <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                      {filteredCertificates?.length === 0 ? (
                        <div className="py-6 text-center text-sm">No certificate requests found</div>
                      ) : (
                        <div className="overflow-hidden p-1 text-foreground">
                          {filteredCertificates?.map((cert) => (
                            <div
                              key={cert.id}
                              onClick={() => {
                                field.onChange(cert.id);
                                setCertificateSearchOpen(false);
                                setSearchValue("");
                              }}
                              className={cn(
                                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                field.value === cert.id ? "bg-accent text-accent-foreground" : "",
                              )}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === cert.id ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {cert.referenceNumber} - {cert.resident.firstName} {cert.resident.lastName} ({cert.resident.bahayToroSystemId})
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              <div className="relative w-full" ref={calendarDropdownRef}>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                  onClick={() => setCalendarOpen(!calendarOpen)}
                  type="button"
                >
                  {field.value ? (
                    format(new Date(field.value), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
                {calendarOpen && (
                  <div className="absolute top-full z-[60] mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                        setCalendarOpen(false);
                      }}
                      initialFocus
                      className="rounded-md border"
                    />
                  </div>
                )}
              </div>
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
                    <div className="relative mt-2 h-40 overflow-hidden rounded-md border">
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
                    <div className="relative mt-2 h-40 overflow-hidden rounded-md border">
                      <Image
                        src={initialData.proofOfPaymentPath}
                        alt="Proof of payment preview"
                        fill
                        className="object-contain"
                      />
                      <span className="absolute right-1 top-1 rounded bg-black/70 px-2 py-1 text-xs text-white">Current File</span>
                    </div>
                  )}
                  {file && !file.type.startsWith("image/") && (
                    <div className="mt-2 flex h-20 items-center justify-center rounded-md border bg-muted text-muted-foreground">
                      <Upload className="mr-2 h-5 w-5" />
                      <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  )}
                  {!file && initialData?.proofOfPaymentPath?.toLowerCase().endsWith(".pdf") && (
                    <div className="mt-2 flex h-20 items-center justify-center rounded-md border bg-muted text-muted-foreground">
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