"use client";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { useState } from "react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { createAppointmentRequest } from "../../appointments/actions";
import { AppointmentRequestInput } from "@/types/types";
import { AppointmentType, TimeSlot } from "@prisma/client";
import { useRouter } from "next/navigation";

// Form validation schema
const appointmentFormSchema = z.object({
  appointmentType: z.enum([AppointmentType.DOCUMENT_PICKUP, AppointmentType.SUBPOENA_MEETING]),
  preferredDate: z.date({
    required_error: "A preferred date is required",
  }),
  preferredTimeSlot: z.enum([TimeSlot.MORNING, TimeSlot.AFTERNOON], {
    required_error: "Please select your preferred time slot",
  }),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface NewAppointmentButtonProps {
  userId: number;
}

export default function NewAppointmentButton({ userId }: NewAppointmentButtonProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Set default form values
  const defaultValues: Partial<AppointmentFormValues> = {
    appointmentType: AppointmentType.DOCUMENT_PICKUP,
    preferredTimeSlot: TimeSlot.MORNING,
    notes: "",
  };

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues,
  });

  async function onSubmit(data: AppointmentFormValues) {
    try {
      setIsSubmitting(true);

      // Prepare appointment request data 
      const appointmentData: AppointmentRequestInput = {
        appointmentType: data.appointmentType,
        preferredDate: data.preferredDate.toISOString().split("T")[0], // Just the date part
        preferredTimeSlot: data.preferredTimeSlot,
        notes: data.notes,
      };
      
      // Submit to the server action
      const result = await createAppointmentRequest(appointmentData);
      
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="gap-2 p-0 w-10 min-[500px]:px-4 min-[500px]:py-2 min-[500px]:w-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span className="hidden min-[500px]:block min-[630px]:hidden">New</span>
          <span className="sr-only min-[630px]:not-sr-only">Request Appointment</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] max-w-[95%] w-full">
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
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select appointment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={AppointmentType.DOCUMENT_PICKUP}>Document Pickup</SelectItem>
                      <SelectItem value={AppointmentType.SUBPOENA_MEETING}>Subpoena Meeting</SelectItem>
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
                            format(field.value, "PPP")
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
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => {
                          // Disable past dates and weekends
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const day = date.getDay();
                          return date < today || day === 0 || day === 6;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your preferred time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={TimeSlot.MORNING}>Morning (8:00 AM - 12:00 PM)</SelectItem>
                      <SelectItem value={TimeSlot.AFTERNOON}>Afternoon (1:00 PM - 5:00 PM)</SelectItem>
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
                    />
                  </FormControl>
                  <FormDescription>
                    Optional - provide any relevant details about your appointment request
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="sm:flex-row flex-col gap-2 w-full">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
                className="sm:w-auto w-full"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="sm:w-auto w-full"
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