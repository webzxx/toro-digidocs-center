"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppointmentRequestInput, appointmentRequestSchema, ResidentForAppointment } from "@/types/types";
import { AppointmentStatus, AppointmentType, TimeSlot } from "@prisma/client";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Plus, Check, ChevronsUpDown, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
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
  residents: ResidentForAppointment[];
}

export default function AppointmentForm({ initialData, onSuccess, residents }: AppointmentFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [residentSearchOpen, setResidentSearchOpen] = useState(false);
  const [filteredResidents, setFilteredResidents] = useState<ResidentForAppointment[]>([]);
  const [residentSearchValue, setResidentSearchValue] = useState("");
  const [selectsOpen, setSelectsOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // Add ref for detecting outside clicks
  const residentDropdownRef = useRef<HTMLDivElement>(null);
  
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
    },
  });

  // Reset document body pointer events when dialog, calendar, or select closes
  useEffect(() => {
    if (!open || (!residentSearchOpen && !selectsOpen && !calendarOpen)) {
      // Add slight delay to ensure animations complete
      setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 100);
    }
    
    return () => {
      document.body.style.pointerEvents = "";
    };
  }, [open, residentSearchOpen, selectsOpen, calendarOpen]);
  
  // Filter residents based on search input
  useEffect(() => {
    if (open) {
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
        // Don't pass admin userId - the server action will retrieve the resident's userId
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
      setResidentSearchValue("");
      setSelectsOpen(false);
      setCalendarOpen(false);
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
    }
    
    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [residentSearchOpen]);

  // Find selected resident details
  const selectedResident = residents.find(
    (resident) => resident.id === form.watch("residentId"),
  );
  
  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button 
          className="w-10 gap-2 p-0 min-[530px]:w-auto min-[530px]:px-4 min-[530px]:py-2"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden min-[530px]:block min-[640px]:hidden">Add</span>
          <span className="sr-only min-[640px]:not-sr-only">New Appointment</span>
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
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
                    onOpenChange={setSelectsOpen}
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
                        ? `${selectedResident.firstName} ${selectedResident.lastName} ${selectedResident.bahayToroSystemId ? `(${selectedResident.bahayToroSystemId})` : ""}`
                        : "Select resident"
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
                          {filteredResidents.length === 0 ? (
                            <div className="py-6 text-center text-sm">
                              {residentSearchValue.length > 0 
                                ? "No residents found." 
                                : "Type to search for residents."}
                            </div>
                          ) : (
                            <div className="overflow-hidden p-1 text-foreground">
                              {filteredResidents.map((resident) => (
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
                                  {resident.firstName} {resident.lastName} {resident.bahayToroSystemId && `(${resident.bahayToroSystemId})`}
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
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="preferredDate"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Preferred Date</FormLabel>
                    <Popover onOpenChange={setCalendarOpen}>
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
                      onOpenChange={setSelectsOpen}
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
                      className="min-h-[80px] resize-none"
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