"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppointmentRequestInput, appointmentRequestSchema } from "@/types/types";
import { AppointmentStatus, AppointmentType, TimeSlot } from "@prisma/client";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Plus, Check, ChevronsUpDown, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createAppointment } from "../actions";
import { useRouter } from "next/navigation";

interface AppointmentFormProps {
  initialData?: Partial<AppointmentRequestInput>;
  onSuccess?: () => void;
}

export default function AppointmentForm({ initialData, onSuccess }: AppointmentFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [residentSearchOpen, setResidentSearchOpen] = useState(false);
  const [certificateSearchOpen, setCertificateSearchOpen] = useState(false);
  const [filteredResidents, setFilteredResidents] = useState<any[]>([]);
  const [residentSearchValue, setResidentSearchValue] = useState("");
  const [certificateSearchValue, setCertificateSearchValue] = useState("");
  const [filteredCertificates, setFilteredCertificates] = useState<any[]>([]);
  
  // Add refs for detecting outside clicks
  const residentDropdownRef = useRef<HTMLDivElement>(null);
  const certificateDropdownRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Create form with validation schema
  const form = useForm<AppointmentRequestInput>({
    resolver: zodResolver(appointmentRequestSchema),
    defaultValues: {
      appointmentType: initialData?.appointmentType || AppointmentType.SUBPOENA_MEETING,
      preferredDate: initialData?.preferredDate || today,
      preferredTimeSlot: initialData?.preferredTimeSlot || TimeSlot.MORNING,
      notes: initialData?.notes || "",
      residentId: initialData?.residentId,
      certificateRequestId: initialData?.certificateRequestId,
    },
  });
  
  // Fetch certificates that are ready for pickup if needed
  const { data: certificates } = useQuery({
    queryKey: ["certificates-ready-for-pickup"],
    queryFn: async () => {
      const response = await fetch("/api/admin/certificates?status=READY_FOR_PICKUP&limit=100");
      if (!response.ok) throw new Error("Failed to fetch certificates");
      return response.json();
    },
    enabled: open,
  });
  
  // Fetch residents if needed
  const { data: residents } = useQuery({
    queryKey: ["residents-for-appointment"],
    queryFn: async () => {
      const response = await fetch("/api/admin/residents?limit=1000");
      if (!response.ok) throw new Error("Failed to fetch residents");
      return response.json();
    },
    enabled: open,
  });
  
  // Filter residents based on search input
  useEffect(() => {
    if (open && residents?.residents) {
      const searchLower = residentSearchValue.toLowerCase();
      const filtered = residents.residents.filter((resident: any) => 
        resident.firstName.toLowerCase().includes(searchLower) ||
        resident.lastName.toLowerCase().includes(searchLower) ||
        resident.bahayToroSystemId.toLowerCase().includes(searchLower) ||
        `${resident.firstName} ${resident.lastName}`.toLowerCase().includes(searchLower),
      ).slice(0, 20); // Limit to 20 results for better performance
      
      setFilteredResidents(filtered);
    }
  }, [residentSearchValue, residents, open]);

  // Filter certificates based on search input
  useEffect(() => {
    if (open && certificates?.certificates) {
      const searchLower = certificateSearchValue.toLowerCase();
      const filtered = certificates.certificates.filter((cert: any) => 
        cert.referenceNumber.toLowerCase().includes(searchLower) ||
        cert.resident.firstName.toLowerCase().includes(searchLower) ||
        cert.resident.lastName.toLowerCase().includes(searchLower) ||
        cert.resident.bahayToroSystemId.toLowerCase().includes(searchLower) ||
        `${cert.resident.firstName} ${cert.resident.lastName}`.toLowerCase().includes(searchLower),
      ).slice(0, 20); // Limit to 20 results for better performance
      
      setFilteredCertificates(filtered);
    }
  }, [certificateSearchValue, certificates, open]);
  
  // Handle form submission using server action
  const onSubmit = async (values: AppointmentRequestInput) => {
    setLoading(true);
    try {
      // Validate that a resident is selected for admin-created appointments
      if (!values.residentId) {
        form.setError("residentId", {
          message: "Please select a resident for this appointment",
        });
        
        toast({
          title: "Error in form submission",
          description: "A resident must be selected when creating an appointment",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // Submit to server action
      const result = await createAppointment({
        ...values,
        // Don't pass userId - the server action will retrieve the resident's userId
      });
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Appointment created successfully",
        });
        
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        
        form.reset();
        setOpen(false);
        if (onSuccess) onSuccess();
        router.refresh();
      } else {
        // Handle validation or server errors
        if (result.fieldErrors) {
          Object.keys(result.fieldErrors).forEach((key) => {
            form.setError(key as any, {
              message: result.fieldErrors[key as keyof typeof result.fieldErrors]?.join(", "),
            });
          });
          
          toast({
            title: "Error in form submission",
            description: "Please check the form for errors and try again.",
            variant: "destructive",
          });
          return;
        }
        
        if (result.serverError) {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.serverError,
          });
        }
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset dialog state and pointer events when closed
  const handleDialogOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      // Reset search states
      setResidentSearchOpen(false);
      setCertificateSearchOpen(false);
      setResidentSearchValue("");
      setCertificateSearchValue("");
    }
  };
  
  // Handle outside click for dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close resident dropdown when clicking outside
      if (residentSearchOpen && 
          residentDropdownRef.current && 
          !residentDropdownRef.current.contains(event.target as Node)) {
        setResidentSearchOpen(false);
      }
      
      // Close certificate dropdown when clicking outside
      if (certificateSearchOpen &&
          certificateDropdownRef.current &&
          !certificateDropdownRef.current.contains(event.target as Node)) {
        setCertificateSearchOpen(false);
      }
    }
    
    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [residentSearchOpen, certificateSearchOpen]);

  // Find selected certificate details
  const selectedCertificate = certificates?.certificates?.find(
    (cert: any) => cert.id === form.watch("certificateRequestId"),
  );
  
  // Find selected resident details
  const selectedResident = residents?.residents?.find(
    (resident: any) => resident.id === form.watch("residentId"),
  );
  
  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Appointment</DialogTitle>
          <DialogDescription>
            Create an appointment for document pickup or other official meeting.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="appointmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appointment Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select appointment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={AppointmentType.DOCUMENT_PICKUP}>
                        Document Pickup
                      </SelectItem>
                      <SelectItem value={AppointmentType.SUBPOENA_MEETING}>
                        Subpoena Meeting
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {form.watch("appointmentType") === "DOCUMENT_PICKUP" && (
              <FormField
                control={form.control}
                name="certificateRequestId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Certificate for Pickup</FormLabel>
                    <div className="relative w-full" ref={certificateDropdownRef}>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                        onClick={() => setCertificateSearchOpen(!certificateSearchOpen)}
                        type="button"
                      >
                        {field.value && selectedCertificate
                          ? `${selectedCertificate.referenceNumber} - ${selectedCertificate.resident.firstName} ${selectedCertificate.resident.lastName}`
                          : "Select certificate"
                        }
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                      {certificateSearchOpen && (
                        <div className="absolute z-[60] top-full mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                          <div className="flex items-center border-b px-3 relative">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Search certificates..."
                              value={certificateSearchValue}
                              onChange={(e) => setCertificateSearchValue(e.target.value)}
                            />
                          </div>
                          <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                            {filteredCertificates?.length === 0 ? (
                              <div className="py-6 text-center text-sm">No certificates found</div>
                            ) : (
                              <div className="overflow-hidden p-1 text-foreground">
                                {filteredCertificates?.map((cert: any) => (
                                  <div
                                    key={cert.id}
                                    onClick={() => {
                                      field.onChange(Number(cert.id));
                                      setCertificateSearchOpen(false);
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
            )}
            
            <FormField
              control={form.control}
              name="residentId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Resident <span className="text-red-500">*</span></FormLabel>
                  <div className="relative w-full" ref={residentDropdownRef}>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                      onClick={() => setResidentSearchOpen(!residentSearchOpen)}
                      type="button"
                    >
                      {field.value && selectedResident
                        ? `${selectedResident.firstName} ${selectedResident.lastName} (${selectedResident.bahayToroSystemId})`
                        : "Select resident"
                      }
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                    {residentSearchOpen && (
                      <div className="absolute z-[60] top-full mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                        <div className="flex items-center border-b px-3 relative">
                          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                          <input
                            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Search residents..."
                            value={residentSearchValue}
                            onChange={(e) => setResidentSearchValue(e.target.value)}
                          />
                        </div>
                        <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                          {filteredResidents?.length === 0 ? (
                            <div className="py-6 text-center text-sm">
                              {residentSearchValue.length > 0 
                                ? "No residents found." 
                                : "Type to search for residents."}
                            </div>
                          ) : (
                            <div className="overflow-hidden p-1 text-foreground">
                              {filteredResidents?.map((resident: any) => (
                                <div
                                  key={resident.id}
                                  onClick={() => {
                                    field.onChange(resident.id);
                                    setResidentSearchOpen(false);
                                  }}
                                  className={cn(
                                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                    field.value === resident.id ? "bg-accent text-accent-foreground" : "",
                                  )}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === resident.id ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  {resident.firstName} {resident.lastName} ({resident.bahayToroSystemId})
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="preferredDate"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Preferred Date</FormLabel>
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
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="preferredTimeSlot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Time</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={TimeSlot.MORNING}>
                          Morning (8:00 AM - 12:00 PM)
                        </SelectItem>
                        <SelectItem value={TimeSlot.AFTERNOON}>
                          Afternoon (1:00 PM - 5:00 PM)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add any additional notes about the appointment"
                      className="resize-none min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Appointment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}