"use client";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Check, ChevronsUpDown, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
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
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { cn, formatTimeSlot, titleCase } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { createAppointmentRequest } from "../../appointments/actions";
import { appointmentRequestSchema } from "@/types/forms";
import { AppointmentType, TimeSlot } from "@prisma/client";
import { useRouter } from "next/navigation";
import { UserResidentForAppointment } from "@/types/user";

// Use the centralized schema but restrict it to the fields needed for the form
type AppointmentFormValues = {
  appointmentType: AppointmentType;
  preferredDate: Date;
  preferredTimeSlot: TimeSlot;
  notes?: string;
  residentId?: number;
};

interface NewAppointmentButtonProps {
  userId: number;
  residents: UserResidentForAppointment[];
}

export default function NewAppointmentButton({ userId, residents }: NewAppointmentButtonProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [residentSearchOpen, setResidentSearchOpen] = useState(false);
  const [filteredResidents, setFilteredResidents] = useState<UserResidentForAppointment[]>([]);
  const [residentSearchValue, setResidentSearchValue] = useState("");
  
  // State to control calendar visibility
  const [calendarOpen, setCalendarOpen] = useState(false);
  // State to control select dropdown visibility
  const [selectsOpen, setSelectsOpen] = useState(false);
  
  // Add ref for detecting outside clicks
  const residentDropdownRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();
  const router = useRouter();

  // Set default form values
  const defaultValues: Partial<AppointmentFormValues> = {
    appointmentType: AppointmentType.DOCUMENT_PICKUP,
    preferredTimeSlot: TimeSlot.MORNING,
    notes: "",
  };

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentRequestSchema),
    defaultValues,
  });

  // Reset document body pointer events when any dropdown closes
  useEffect(() => {
    if (!open || (!residentSearchOpen && !calendarOpen && !selectsOpen)) {
      // Add slight delay to ensure animations complete
      setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 100);
    }
    
    return () => {
      document.body.style.pointerEvents = "";
    };
  }, [open, residentSearchOpen, calendarOpen, selectsOpen]);

  // Filter residents based on search input
  useEffect(() => {
    if (open && residents?.length > 0) {
      const searchLower = residentSearchValue.toLowerCase();
      
      // Regular filtering
      const filtered = residents.filter((resident) => 
        resident.firstName.toLowerCase().includes(searchLower) ||
        resident.lastName.toLowerCase().includes(searchLower) ||
        (resident.bahayToroSystemId && resident.bahayToroSystemId.toLowerCase().includes(searchLower)) ||
        `${resident.firstName} ${resident.lastName}`.toLowerCase().includes(searchLower),
      ).slice(0, 20); // Limit to 20 results for better performance
      
      setFilteredResidents(filtered);
    }
  }, [residentSearchValue, residents, open]);
  
  // Handle outside click for dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close resident dropdown when clicking outside
      if (residentSearchOpen && 
          residentDropdownRef.current && 
          !residentDropdownRef.current.contains(event.target as Node)) {
        setResidentSearchOpen(false);
      }
      
      // Close calendar when clicking outside
      if (calendarOpen && 
          calendarRef.current && 
          !calendarRef.current.contains(event.target as Node)) {
        setCalendarOpen(false);
      }
    }
    
    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [residentSearchOpen, calendarOpen]);

  async function onSubmit(data: AppointmentFormValues) {
    try {
      setIsSubmitting(true);
      
      // Submit to the server action
      const result = await createAppointmentRequest(data);
      
      if (!result.success) {
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
            title: "Unable to request appointment",
            description: result.serverError,
            variant: "destructive",
          });
          return;
        }
      }
      
      // Show success toast
      toast({
        title: "Appointment requested",
        description: `Your appointment request has been submitted (Ref: ${result.data?.referenceNumber}). You'll be notified once it's approved.`,
        variant: "default",
      });
      
      setOpen(false);
      form.reset();
      
      // Refresh the appointments list
      router.refresh();
      
    } catch (error) {
      console.error("Error requesting appointment:", error);
      toast({
        title: "Failed to request appointment",
        description: "There was a problem submitting your appointment request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Find selected resident details
  const selectedResident = residents?.find(
    (resident) => resident.id === form.watch("residentId"),
  );

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        // Reset all internal state when dialog closes
        setCalendarOpen(false);
        setResidentSearchOpen(false);
        setSelectsOpen(false);
      }
    }}>
      <DialogTrigger asChild>
        <Button 
          className="w-10 gap-2 p-0 min-[500px]:w-auto min-[500px]:px-4 min-[500px]:py-2"
        >
          <PlusCircle className="h-4 w-4" />
          <span className="hidden min-[500px]:block min-[630px]:hidden">New</span>
          <span className="sr-only min-[630px]:not-sr-only">Request Appointment</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="w-full max-w-[95%] sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request New Appointment</DialogTitle>
          <DialogDescription>
            Provide your preferred date and time for your appointment. 
            An administrator will review and confirm your schedule.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="appointmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appointment Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    onOpenChange={(open) => {
                      // Close other open dropdowns when opening this one
                      setCalendarOpen(false);
                      setResidentSearchOpen(false);
                      setSelectsOpen(open);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select appointment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(AppointmentType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {titleCase(type.replace(/_/g, " "))}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {field.value === AppointmentType.DOCUMENT_PICKUP
                      ? "Request a time to pick up your requested documents" 
                      : "Request a meeting for subpoena related matters"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="residentId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Resident (Optional)</FormLabel>
                  <div className="relative w-full" ref={residentDropdownRef}>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                      onClick={() => {
                        setResidentSearchOpen(!residentSearchOpen);
                        setCalendarOpen(false); // Close calendar if open
                      }}
                      type="button"
                    >
                      {field.value && selectedResident
                        ? `${selectedResident.firstName} ${selectedResident.lastName}${selectedResident.bahayToroSystemId ? ` (${selectedResident.bahayToroSystemId})` : ""}`
                        : "Select a resident (optional)"
                      }
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                    {residentSearchOpen && (
                      <div className="absolute top-full z-[60] mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                        <div className="relative flex items-center border-b px-3">
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
                                : residents?.length === 0 
                                  ? "No residents available." 
                                  : "Type to search for residents."}
                            </div>
                          ) : (
                            <div className="overflow-hidden p-1 text-foreground">
                              {filteredResidents?.map((resident) => (
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
                                  {resident.firstName} {resident.lastName}
                                  {resident.bahayToroSystemId && <span className="ml-1 text-muted-foreground">({resident.bahayToroSystemId})</span>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <FormDescription>
                    Optional - select a specific resident for this appointment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="preferredDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Preferred Date</FormLabel>
                  <div className="relative" ref={calendarRef}>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                      onClick={() => {
                        setCalendarOpen(!calendarOpen);
                        setResidentSearchOpen(false); // Close resident dropdown if open
                      }}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                    
                    {calendarOpen && (
                      <div className="absolute left-0 top-full z-50 mt-1">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(date);
                              setCalendarOpen(false);
                            }
                          }}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const day = date.getDay();
                            return date < today || day === 0 || day === 6;
                          }}
                          initialFocus
                          className="rounded-md border bg-white shadow-md"
                        />
                      </div>
                    )}
                  </div>
                  <FormDescription>
                    Mon-Fri, future dates only
                  </FormDescription>
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
                    onOpenChange={(open) => {
                      // Close other open dropdowns when opening this one
                      setCalendarOpen(false);
                      setResidentSearchOpen(false);
                      setSelectsOpen(open);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your preferred time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(TimeSlot).map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {formatTimeSlot(slot)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select your preferred time of day
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requests or information..."
                      className="resize-none"
                      {...field}
                      onClick={() => {
                        // Close open dropdowns when clicking in textarea
                        setCalendarOpen(false);
                        setResidentSearchOpen(false);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional - provide any relevant details about your appointment request
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="w-full flex-col gap-2 sm:flex-row">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}