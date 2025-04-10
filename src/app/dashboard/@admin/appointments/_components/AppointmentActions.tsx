"use client";

import React, { useState } from "react";
import { Appointment, AppointmentStatus } from "@prisma/client";
import {
  MoreHorizontal,
  CalendarIcon,
  CheckCircle,
  XCircle,
  Trash,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { 
  approveAppointment,
  completeAppointment,
  cancelAppointment,
  markNoShow,
  rescheduleAppointment,
  deleteAppointment,
} from "../actions";

// Define form schema for scheduling appointments
const scheduleFormSchema = z.object({
  scheduledDate: z.date({
    required_error: "Please select a date",
  }),
  scheduledTime: z.string({
    required_error: "Please select a time",
  }),
  notes: z.string().optional(),
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

// Define form schema for cancellation reason
const cancelFormSchema = z.object({
  reason: z.string().min(1, "Please provide a reason for cancellation"),
});

type CancelFormValues = z.infer<typeof cancelFormSchema>;

interface AppointmentActionsProps {
  appointment: Appointment & {
    user: {
      username: string;
      email: string;
    };
    resident?: {
      firstName: string;
      lastName: string;
      bahayToroSystemId: string;
    } | null;
    certificateRequest?: {
      referenceNumber: string;
    } | null;
  };
  onActionComplete: () => void;
}

export default function AppointmentActions({
  appointment,
  onActionComplete,
}: AppointmentActionsProps) {
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    action: "complete" | "noshow" | "delete";
    title: string;
    description: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Setup form for scheduling appointment
  const scheduleForm = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: appointment.scheduledDateTime
      ? {
        scheduledDate: new Date(appointment.scheduledDateTime),
        scheduledTime: format(new Date(appointment.scheduledDateTime), "HH:mm"),
        notes: appointment.notes || "",
      }
      : {
        scheduledDate: new Date(appointment.preferredDate), // Use the preferred date from the appointment request
        scheduledTime: appointment.preferredTimeSlot === "MORNING" ? "08:00" : "13:00", // Set appropriate default time based on preferred time slot
        notes: appointment.notes || "",
      },
  });

  // Setup form for cancellation reason
  const cancelForm = useForm<CancelFormValues>({
    resolver: zodResolver(cancelFormSchema),
    defaultValues: {
      reason: "",
    },
  });

  // Handle appointment scheduling
  const handleScheduleAppointment = async (values: ScheduleFormValues) => {
    setIsLoading(true);
    try {
      // Combine date and time
      const scheduledDateTime = new Date(values.scheduledDate);
      const [hours, minutes] = values.scheduledTime.split(":").map(Number);
      scheduledDateTime.setHours(hours, minutes, 0, 0);

      // Call server action to schedule appointment
      const result = await (appointment.status === AppointmentStatus.RESCHEDULED ? 
        rescheduleAppointment(appointment.id, scheduledDateTime) : 
        approveAppointment(appointment.id, scheduledDateTime));

      if (result.success) {
        toast({
          title: "Appointment scheduled",
          description: `Appointment has been scheduled for ${format(scheduledDateTime, "PPP")} at ${format(scheduledDateTime, "h:mm a")}`,
        });
        
        setIsScheduleDialogOpen(false);
        
        // Ensure pointer-events are reset after successful action
        document.body.style.pointerEvents = "";
        setTimeout(() => {
          document.body.style.pointerEvents = "";
        }, 100);
        
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        onActionComplete();
      } else {
        throw new Error(result.error || "Failed to schedule appointment");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to schedule appointment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle appointment cancellation
  const handleCancelAppointment = async (values: CancelFormValues) => {
    setIsLoading(true);
    try {
      const result = await cancelAppointment(appointment.id, values.reason);

      if (result.success) {
        toast({
          title: "Appointment cancelled",
          description: "The appointment has been cancelled successfully",
        });
        
        setIsCancelDialogOpen(false);
        
        // Ensure pointer-events are reset after successful action
        document.body.style.pointerEvents = "";
        setTimeout(() => {
          document.body.style.pointerEvents = "";
        }, 100);
        
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        onActionComplete();
      } else {
        throw new Error(result.error || "Failed to cancel appointment");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel appointment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle confirm action
  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    
    setIsLoading(true);
    try {
      let result;
      
      switch (confirmAction.action) {
      case "complete":
        result = await completeAppointment(appointment.id);
        break;
      case "noshow":
        result = await markNoShow(appointment.id);
        break;
      case "delete":
        result = await deleteAppointment(appointment.id);
        break;
      }

      if (result.success) {
        toast({
          title: "Success",
          description: `Appointment ${
            confirmAction.action === "delete" 
              ? "deleted" 
              : confirmAction.action === "complete" 
                ? "marked as completed" 
                : "marked as no-show"
          } successfully`,
        });
        
        setIsConfirmDialogOpen(false);
        
        // Ensure pointer-events are reset after successful action
        document.body.style.pointerEvents = "";
        setTimeout(() => {
          document.body.style.pointerEvents = "";
        }, 100);
        
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        onActionComplete();
      } else {
        throw new Error(result.error || `Failed to ${confirmAction.action} appointment`);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${confirmAction.action} appointment`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Open confirm dialog with appropriate action
  const openConfirmDialog = (action: "complete" | "noshow" | "delete") => {
    let title = "";
    let description = "";
    
    switch (action) {
    case "complete":
      title = "Complete Appointment";
      description = "Mark this appointment as completed? This indicates the appointment took place successfully.";
      break;
    case "noshow":
      title = "Mark as No-Show";
      description = "Mark this appointment as a no-show? This indicates the resident did not attend the scheduled appointment.";
      break;
    case "delete":
      title = "Delete Appointment";
      description = "Are you sure you want to delete this appointment? This action cannot be undone.";
      break;
    }
    
    setConfirmAction({ action, title, description });
    setIsConfirmDialogOpen(true);
  };

  // Dialog open/close handlers with pointer event reset
  const handleScheduleDialogChange = (open: boolean) => {
    setIsScheduleDialogOpen(open);
    if (!open) {
      // Add slight delay to avoid UI flickering
      setTimeout(() => {
        document.body.style.pointerEvents = ""; // Reset pointer events
      }, 100);
    }
  };

  const handleCancelDialogChange = (open: boolean) => {
    setIsCancelDialogOpen(open);
    if (!open) {
      setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 100);
    }
  };

  const handleConfirmDialogChange = (open: boolean) => {
    setIsConfirmDialogOpen(open);
    if (!open) {
      setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 100);
    }
  };

  // Manual button click handlers with cleanup
  const handleScheduleCloseButtonClick = () => {
    setIsScheduleDialogOpen(false);
    document.body.style.pointerEvents = ""; // Reset immediately
    // Also add a small delay for extra safety
    setTimeout(() => {
      document.body.style.pointerEvents = "";
    }, 100);
  };

  const handleCancelCloseButtonClick = () => {
    setIsCancelDialogOpen(false);
    document.body.style.pointerEvents = "";
    setTimeout(() => {
      document.body.style.pointerEvents = "";
    }, 100);
  };

  const handleConfirmCloseButtonClick = () => {
    setIsConfirmDialogOpen(false);
    document.body.style.pointerEvents = "";
    setTimeout(() => {
      document.body.style.pointerEvents = "";
    }, 100);
  };

  // Determine available actions based on current status
  const canSchedule = ([AppointmentStatus.REQUESTED, AppointmentStatus.RESCHEDULED] as AppointmentStatus[]).includes(appointment.status);
  const canComplete = appointment.status === AppointmentStatus.SCHEDULED;
  const canNoShow = appointment.status === AppointmentStatus.SCHEDULED;
  const canCancel = ([AppointmentStatus.SCHEDULED] as AppointmentStatus[]).includes(appointment.status);
  const canReschedule = ([AppointmentStatus.SCHEDULED] as AppointmentStatus[]).includes(appointment.status);
  const canDelete = true; // Allow deletion for all appointment statuses including COMPLETED
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {canSchedule && (
            <DropdownMenuItem onClick={() => setIsScheduleDialogOpen(true)}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {appointment.status === AppointmentStatus.RESCHEDULED ? "Reschedule" : "Schedule"}
            </DropdownMenuItem>
          )}
          {canReschedule && (
            <DropdownMenuItem onClick={() => setIsScheduleDialogOpen(true)}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              Reschedule
            </DropdownMenuItem>
          )}
          {canComplete && (
            <DropdownMenuItem onClick={() => openConfirmDialog("complete")}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Completed
            </DropdownMenuItem>
          )}
          {canNoShow && (
            <DropdownMenuItem onClick={() => openConfirmDialog("noshow")}>
              <XCircle className="mr-2 h-4 w-4" />
              Mark as No-Show
            </DropdownMenuItem>
          )}
          {canCancel && (
            <DropdownMenuItem onClick={() => setIsCancelDialogOpen(true)}>
              <Clock className="mr-2 h-4 w-4" />
              Cancel
            </DropdownMenuItem>
          )}
          {canDelete && (
            <DropdownMenuItem 
              onClick={() => openConfirmDialog("delete")}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={handleScheduleDialogChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {appointment.status === AppointmentStatus.RESCHEDULED ? "Reschedule" : "Schedule"} Appointment
            </DialogTitle>
            <DialogDescription>
              Set the date and time for this appointment.
            </DialogDescription>
          </DialogHeader>
          <Form {...scheduleForm}>
            <form onSubmit={scheduleForm.handleSubmit(handleScheduleAppointment)} className="space-y-4">
              <FormField
                control={scheduleForm.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
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
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={scheduleForm.control}
                name="scheduledTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={scheduleForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Add any notes about this appointment"
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleScheduleCloseButtonClick}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Cancel Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={handleCancelDialogChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling this appointment.
            </DialogDescription>
          </DialogHeader>
          <Form {...cancelForm}>
            <form onSubmit={cancelForm.handleSubmit(handleCancelAppointment)} className="space-y-4">
              <FormField
                control={cancelForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Cancellation</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter reason for cancellation"
                        className="resize-none min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCancelCloseButtonClick}>
                  Back
                </Button>
                <Button type="submit" variant="destructive" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Cancel Appointment
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={handleConfirmDialogChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{confirmAction?.title}</DialogTitle>
            <DialogDescription>
              {confirmAction?.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleConfirmCloseButtonClick}>
              Cancel
            </Button>
            <Button 
              variant={confirmAction?.action === "delete" ? "destructive" : "default"}
              onClick={handleConfirmAction}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}