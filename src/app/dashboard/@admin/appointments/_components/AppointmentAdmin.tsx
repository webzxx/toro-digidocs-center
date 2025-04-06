"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, Check, ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { Appointment, AppointmentStatus } from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isToday } from "date-fns";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";
import AppointmentTable from "./AppointmentTable";
import AppointmentForm from "./AppointmentForm";

const ITEMS_PER_PAGE = 10;

type AppointmentWithDetails = Appointment & {
  resident: {
    firstName: string;
    lastName: string;
    bahayToroSystemId: string | null;
  };
};

interface AppointmentAdminProps {
  initialAppointments: AppointmentWithDetails[];
  initialTotal: number;
}

export default function AppointmentAdmin({ initialAppointments, initialTotal }: AppointmentAdminProps) {
  // Query states for URL parameters
  const [page, setPage] = useQueryState("page", { defaultValue: 1, parse: Number });
  const [status, setStatus] = useQueryState("status", { defaultValue: "ALL" });
  const [date, setDate] = useQueryState("date");
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  
  // Local state for date picker
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date ? new Date(date) : undefined);
  
  // Track if this is the initial load
  const isInitialLoadRef = useRef(true);
  
  // Keep track of previous data for optimistic UI updates
  const previousDataRef = useRef({
    appointments: initialAppointments,
    total: initialTotal,
    page: 1,
    totalPages: Math.ceil(initialTotal / ITEMS_PER_PAGE),
  });
  
  // Fetch appointments with pagination, filtering, and search
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["appointments", page, status, date, search],
    queryFn: async () => {
      // When a query executes, we're no longer in the initial load
      isInitialLoadRef.current = false;
      
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", ITEMS_PER_PAGE.toString());
      if (status !== "ALL") params.set("status", status);
      if (date) params.set("date", date);
      if (search) params.set("search", search);
      
      const res = await fetch(`/api/admin/appointments?${params}`);
      if (!res.ok) throw new Error("Failed to fetch appointments");
      const data = await res.json();
      
      previousDataRef.current = data;
      return data;
    },
    staleTime: 0,
    placeholderData: !isInitialLoadRef.current || 
                  (status === "ALL" && 
                   !date &&
                   search === "") ?
      previousDataRef.current : undefined,
    // Check if we should skip the initial query
    enabled: !(isInitialLoadRef.current && 
              status === "ALL" &&
              !date && 
              search === "" && 
              initialAppointments.length > 0),
  });
  
  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value || null);
    setPage(1); // Reset to first page on search change
  };
  
  // Handle date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setSelectedDate(selectedDate);
    if (selectedDate) {
      setDate(format(selectedDate, "yyyy-MM-dd"));
    } else {
      setDate(null);
    }
    setPage(1); // Reset to first page on date change
  };

  // Function to handle successful appointment creation or update
  const handleAppointmentSuccess = () => {
    refetch();
  };

  // Get the appointments data to display
  const appointments = data?.appointments || initialAppointments;
  const totalPages = data?.totalPages || Math.ceil(initialTotal / ITEMS_PER_PAGE);
  const totalAppointments = data?.total || initialTotal;

  return (
    <Card className="shadow-md">
      <CardHeader className="@container flex flex-col items-start justify-between pb-4 border-b space-y-4">  
        <div className="w-full flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-green-primary">Appointments</CardTitle>
            <CardDescription>Manage all resident appointment schedules</CardDescription>
          </div>
          <AppointmentForm onSuccess={handleAppointmentSuccess} />
        </div>
        <div className="@lg:flex-row w-full flex flex-col gap-2 sm:gap-4">
          <div className="relative w-full">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search appointments by resident name or ID..."
              value={search || ""}
              onChange={handleSearchChange}
              className="pl-8 w-full"
            />
          </div>
          <div className="flex flex-row gap-2 space-y-0 space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[180px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                />
                {selectedDate && (
                  <div className="p-2 border-t flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDateSelect(undefined)}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            
            <Select value={status} onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                {Object.keys(AppointmentStatus).map((key) => (
                  <SelectItem key={key} value={key}>{key.replace(/_/g, " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-green-primary" />
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-red-500">Error loading appointments. Please try again.</p>
          </div>
        ) : (
          <AppointmentTable 
            appointments={appointments} 
            onSuccess={handleAppointmentSuccess}
          />
        )}
        
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <p className="text-sm text-muted-foreground">
            Showing {appointments.length} of {totalAppointments} appointments
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <p className="text-sm font-medium">
              Page {page} of {totalPages}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}