"use client";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter, 
} from "@/components/ui/card";
import { Appointment, CertificateRequest, Resident } from "@prisma/client";
import { Calendar, Clock, FileText, Info, MapPin, User, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatDateTime, formatDateOnly, formatTime, formatAppointmentType } from "@/lib/utils";
import { useState } from "react";
import NewAppointmentButton, { Resident as ResidentType } from "./NewAppointmentButton";
import { useRouter } from "next/navigation";
import { cancelAppointment } from "../../appointments/actions";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getAppointmentStatusBadge } from "@/components/utils";
import { getAppointmentTypeIcon } from "@/components/utils/icons";

type AppointmentWithRelations = Appointment & {
  resident: Resident | null;
  certificateRequest: CertificateRequest | null;
};

type AppointmentsClientProps = {
  appointments: AppointmentWithRelations[];
  residents: ResidentType[];
  userId: number;
};

export default function AppointmentsClient({ 
  appointments, 
  residents,
  userId, 
}: AppointmentsClientProps) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "past" | "pending">("all");
  const [isLoading, setIsLoading] = useState<number | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<number | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Filter appointments based on the selected filter
  const filteredAppointments = appointments.filter(appointment => {
    const now = new Date();
    
    // Special case for pending filter - handle REQUESTED appointments
    if (filter === "pending") {
      return appointment.status === "REQUESTED";
    }
    
    // Special case for CANCELLED appointments - they should always show in "past" and "all" filters
    if (appointment.status === "CANCELLED") {
      return filter === "all" || filter === "past";
    }
    
    // For appointments without scheduledDateTime that aren't REQUESTED or CANCELLED, skip them
    if (!appointment.scheduledDateTime && 
        appointment.status !== "REQUESTED") {
      return false;
    }
    
    // For REQUESTED appointments show in "all" filter but not in date-specific filters
    if (appointment.status === "REQUESTED") {
      return filter === "all";
    }
    
    // Now we can safely use scheduledDateTime for other appointment types
    const appointmentDate = new Date(appointment.scheduledDateTime!);
    
    switch (filter) {
    case "upcoming":
      return appointmentDate >= now && appointment.status !== "COMPLETED";
    case "past":
      return appointmentDate < now || 
          appointment.status === "COMPLETED";
    default: // "all"
      return true;
    }
  });

  // Group appointments by their status for the summary footer
  const statusCounts = appointments.reduce((counts, appointment) => {
    counts[appointment.status] = (counts[appointment.status] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  // Handle appointment cancellation
  const handleCancelAppointment = async (appointmentId: number) => {
    try {
      setIsLoading(appointmentId);
      const result = await cancelAppointment(appointmentId);
      
      if (!result.success) {
        toast({
          title: "Failed to cancel appointment",
          description: result.serverError || "An unexpected error occurred",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Appointment cancelled",
        description: `Appointment ${result.data?.referenceNumber} has been cancelled successfully.`,
      });
      
      // Refresh the appointments list
      router.refresh();
      
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
      setConfirmCancel(null);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="px-7 flex flex-row items-center justify-between border-b pb-4">
        <div>
          <CardTitle className="text-2xl font-bold text-green-primary">My Appointments</CardTitle>
          <CardDescription>Request and manage your appointments</CardDescription>
        </div>
        <NewAppointmentButton userId={userId} residents={residents} />
      </CardHeader>
      
      <div className="px-6 py-3 border-b flex sm:items-center justify-between sm:flex-row flex-col items-start gap-2 sm:gap-0">
        <div className="flex items-center space-x-2">
          <Button 
            variant={filter === "all" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button 
            variant={filter === "pending" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter("pending")}
          >
            Pending
          </Button>
          <Button 
            variant={filter === "upcoming" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter("upcoming")}
          >
            Upcoming
          </Button>
          <Button 
            variant={filter === "past" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilter("past")}
          >
            Past
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? "s" : ""}
        </div>
      </div>
      
      <CardContent className="p-6">
        {filteredAppointments.length > 0 ? (
          <ScrollArea className="max-h-[500px] pr-4">
            <Accordion type="single" collapsible className="w-full">
              {filteredAppointments.map((appointment) => (
                <AccordionItem 
                  key={appointment.id} 
                  value={appointment.id.toString()} 
                  className="border border-muted rounded-lg mb-3 overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline [&>svg]:text-muted-foreground [&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0">
                    <div className="flex flex-1 items-center justify-between">
                      <div className='flex flex-col items-start text-start'>
                        <div className="flex items-center gap-2">
                          {getAppointmentTypeIcon(appointment.appointmentType)}
                          <h4 className="font-medium">{formatAppointmentType(appointment.appointmentType)}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">Ref: {appointment.referenceNumber}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-right mr-2">
                          <div className="font-medium">
                            {appointment.status === "REQUESTED" 
                              ? "Awaiting Schedule"
                              : appointment.scheduledDateTime ? formatDateOnly(appointment.scheduledDateTime) : "Not scheduled"
                            }
                          </div>
                          <div className="text-muted-foreground">
                            {appointment.status === "REQUESTED"
                              ? "Request Pending"
                              : appointment.scheduledDateTime ? formatTime(appointment.scheduledDateTime) : "TBD"
                            }
                          </div>
                        </div>
                        {getAppointmentStatusBadge(appointment.status)}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-1">
                    <div className="grid gap-3 text-sm">
                      {appointment.status === "REQUESTED" ? (
                        <div className="grid grid-cols-1 gap-3">
                          <div className="p-3 bg-purple-50 rounded-md text-purple-700 text-center">
                            Your appointment request is being reviewed by the staff. 
                            You will be notified once it's approved and scheduled.
                          </div>
                          
                          {/* Show the preferred date and time slot for requested appointments */}
                          <div className="grid grid-cols-2 gap-1 mt-2">
                            <div className="text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Preferred Date:
                            </div>
                            <div>{formatDateOnly(appointment.preferredDate)}</div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-1">
                            <div className="text-muted-foreground flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Preferred Time:
                            </div>
                            <div>
                              {appointment.preferredTimeSlot === "MORNING" 
                                ? "Morning (8:00 AM - 12:00 PM)" 
                                : "Afternoon (1:00 PM - 5:00 PM)"}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          {appointment.scheduledDateTime && (
                            <div className="grid grid-cols-2 gap-1">
                              <div className="text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Date & Time:
                              </div>
                              <div>{formatDateTime(appointment.scheduledDateTime)}</div>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-2 gap-1">
                            <div className="text-muted-foreground flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Duration:
                            </div>
                            <div>{appointment.duration} minutes</div>
                          </div>
                        </>
                      )}
                      
                      {appointment.resident && (
                        <div className="grid grid-cols-2 gap-1">
                          <div className="text-muted-foreground flex items-center gap-1">
                            <User className="h-4 w-4" />
                            Resident:
                          </div>
                          <div>{appointment.resident.firstName} {appointment.resident.lastName}</div>
                        </div>
                      )}
                      
                      {appointment.appointmentType === "DOCUMENT_PICKUP" && appointment.certificateRequest && (
                        <div className="grid grid-cols-2 gap-1">
                          <div className="text-muted-foreground flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            Document:
                          </div>
                          <div>{appointment.certificateRequest.certificateType.replace(/_/g, " ")}</div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          Location:
                        </div>
                        <div>Barangay Bahay Toro Office</div>
                      </div>
                      
                      {appointment.notes && (
                        <div className="grid grid-cols-2 gap-1">
                          <div className="text-muted-foreground flex items-center gap-1">
                            <Info className="h-4 w-4" />
                            Notes:
                          </div>
                          <div>{appointment.notes}</div>
                        </div>
                      )}
                      
                      {(appointment.status === "REQUESTED" || appointment.status === "SCHEDULED") && (
                        <div className="flex justify-end gap-2 mt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent accordion from toggling
                              setConfirmCancel(appointment.id);
                            }}
                            disabled={isLoading === appointment.id}
                          >
                            {isLoading === appointment.id ? "Cancelling..." : "Cancel"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-10 border border-dashed rounded-lg">
            <Calendar className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium">No appointments found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {filter === "all" 
                ? "Request your first appointment to see it here"
                : filter === "pending"
                  ? "You have no pending appointment requests"
                  : filter === "upcoming"
                    ? "You have no upcoming appointments"
                    : "You have no past appointments"
              }
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t p-4 flex justify-between text-sm text-muted-foreground">
        <div>Total appointments: {appointments.length}</div>
        <div className="flex gap-3">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="flex items-center">
              <div className="w-2 h-2 rounded-full mr-1" 
                style={{ 
                  backgroundColor: 
                    status === "REQUESTED" ? "#8b5cf6" :
                      status === "SCHEDULED" ? "#3b82f6" : 
                        status === "CONFIRMED" ? "#10b981" :
                          status === "COMPLETED" ? "#059669" :
                            status === "CANCELLED" ? "#ef4444" :
                              status === "RESCHEDULED" ? "#f59e0b" :
                                "#6b7280",
                }}
              />
              <span>{status.charAt(0) + status.slice(1).toLowerCase().replace("_", " ")}: {count}</span>
            </div>
          ))}
        </div>
      </CardFooter>
      
      {/* Confirmation Dialog for Cancelling Appointments */}
      <AlertDialog open={confirmCancel !== null} onOpenChange={() => setConfirmCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading !== null}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmCancel && handleCancelAppointment(confirmCancel)}
              disabled={isLoading !== null}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading !== null ? "Cancelling..." : "Yes, Cancel Appointment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}