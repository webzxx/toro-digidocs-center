"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppointmentRequestInput, appointmentRequestSchema } from "@/types/types";
import { AppointmentStatus, AppointmentType, TimeSlot } from "@prisma/client";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Plus } from "lucide-react";
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

interface AppointmentFormProps {
  initialData?: Partial<AppointmentRequestInput>;
  onSuccess?: () => void;
}

export default function AppointmentForm({ initialData, onSuccess }: AppointmentFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
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
    enabled: open && form.watch("appointmentType") === "DOCUMENT_PICKUP",
  });
  
  // Fetch residents if needed
  const { data: residents } = useQuery({
    queryKey: ["residents-for-appointment"],
    queryFn: async () => {
      const response = await fetch("/api/admin/residents?limit=100");
      if (!response.ok) throw new Error("Failed to fetch residents");
      return response.json();
    },
    enabled: open,
  });
  
  // Handle form submission
  const onSubmit = async (values: AppointmentRequestInput) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create appointment");
      }
      
      toast({
        title: "Success",
        description: "Appointment created successfully",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      
      form.reset();
      setOpen(false);
      if (onSuccess) onSuccess();
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
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                  <FormItem>
                    <FormLabel>Certificate for Pickup</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select certificate" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {certificates?.certificates?.map((cert: any) => (
                          <SelectItem key={cert.id} value={cert.id.toString()}>
                            {cert.referenceNumber} - {cert.resident.firstName} {cert.resident.lastName}
                          </SelectItem>
                        )) || (
                          <SelectItem value="loading" disabled>
                            Loading certificates...
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="residentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resident (Optional)</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select resident" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {residents?.residents?.map((resident: any) => (
                        <SelectItem key={resident.id} value={resident.id.toString()}>
                          {resident.firstName} {resident.lastName} ({resident.bahayToroSystemId})
                        </SelectItem>
                      )) || (
                        <SelectItem value="loading" disabled>
                          Loading residents...
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="preferredDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
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