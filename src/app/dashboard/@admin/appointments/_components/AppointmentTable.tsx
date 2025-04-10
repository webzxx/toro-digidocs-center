"use client";

import React from "react";
import { Appointment, AppointmentStatus, AppointmentType } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTimeShort } from "@/lib/utils";
import { getAppointmentStatusBadge, getAppointmentTypeBadge } from "@/components/utils/badges";
import AppointmentActions from "./AppointmentActions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";
import { AdminAppointment } from "@/types/types";

interface AppointmentTableProps {
  appointments: AdminAppointment[];
  isLoading?: boolean;
  refetch: () => void;
}

export default function AppointmentTable({ appointments, isLoading = false, refetch }: AppointmentTableProps) {
  // Function to check if the appointment is a pending request
  const isPendingRequest = (appointment: AdminAppointment) => {
    return appointment.status === AppointmentStatus.REQUESTED;
  };
  
  // Function to get the background color class for the row
  const getRowClassName = (appointment: AdminAppointment) => {
    let baseClass = "";
    
    // Apply loading animation if isLoading is true
    if (isLoading) {
      baseClass = "animate-pulse bg-gradient-to-r from-transparent via-gray-200/60 to-transparent bg-[length:400%_100%] bg-[0%_0] transition-all";
    } 
    // Apply special styling for pending requests
    else if (isPendingRequest(appointment)) {
      baseClass = "bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/30 dark:hover:bg-purple-950/50 relative";
    }
    
    return baseClass;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-44">Reference</TableHead>
          <TableHead className="hidden md:table-cell">Requester</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="hidden sm:table-cell">Schedule</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden sm:table-cell">Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments && appointments.length > 0 ? (
          appointments.map((appointment) => (
            <TableRow key={appointment.id} className={getRowClassName(appointment)}>
              <TableCell>
                <div className="flex items-center gap-2 font-medium">
                  {appointment.referenceNumber}
                  
                  {isPendingRequest(appointment) && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex-shrink-0">
                            <span className="relative flex h-3 w-3">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
                              <span className="relative inline-flex h-3 w-3 rounded-full bg-purple-500"></span>
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Pending appointment request</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div className="text-xs text-muted-foreground md:hidden">
                  {appointment.user?.username}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div>
                  <div className="font-medium">{appointment.user?.username}</div>
                  <div className="text-xs text-muted-foreground">{appointment.user?.email}</div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {appointment.appointmentType === AppointmentType.DOCUMENT_PICKUP
                      ? "Document Pickup"
                      : "Subpoena Meeting"}
                  </div>
                  {appointment.resident && (
                    <div className="text-xs text-muted-foreground">
                      {appointment.resident.firstName} {appointment.resident.lastName}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {appointment.scheduledDateTime ? (
                  <div className="flex flex-col">
                    <span>{formatDateTimeShort(new Date(appointment.scheduledDateTime))}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(appointment.scheduledDateTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <span>{formatDateTimeShort(new Date(appointment.preferredDate))}</span>
                    <span className="text-xs text-muted-foreground">
                      {appointment.preferredTimeSlot === "MORNING" ? "Morning" : "Afternoon"}
                    </span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                {getAppointmentStatusBadge(appointment.status)}
                {isPendingRequest(appointment) && (
                  <div className="mt-1 flex items-center gap-1 md:hidden">
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertCircle className="h-4 w-4 text-purple-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Needs scheduling</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span className="text-xs text-muted-foreground">Needs scheduling</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {formatDateTimeShort(new Date(appointment.createdAt))}
              </TableCell>
              <TableCell className="text-right">
                <AppointmentActions 
                  appointment={{
                    ...appointment,
                    resident: appointment.resident ? {
                      ...appointment.resident,
                      bahayToroSystemId: appointment.resident.bahayToroSystemId || "",
                    } : null,
                  }}
                  refetch={refetch}
                />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              No appointments found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}