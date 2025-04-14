"use client";

import { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { CivilStatus, Gender, Sector } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ResidentTable from "./ResidentTable";
import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";
import { getCivilStatusBadge, getGenderBadge, getSectorBadge } from "@/components/utils";
import { ResidentWithRelations } from "@/types/shared";

const ITEMS_PER_PAGE = 10;

interface ResidentAdminProps {
  initialResidents: ResidentWithRelations[];
  initialTotal: number;
}

export default function ResidentAdmin({ initialResidents, initialTotal }: ResidentAdminProps) {
  // Query states for URL parameters
  const [page, setPage] = useQueryState("page", { defaultValue: 1, parse: Number });
  const [gender, setGender] = useQueryState("gender", { defaultValue: "ALL" });
  const [status, setStatus] = useQueryState("status", { defaultValue: "ALL" });
  const [sector, setSector] = useQueryState("sector", { defaultValue: "ALL" });
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  
  // Track if this is the initial load
  const isInitialLoadRef = useRef(true);
  
  // Keep track of previous data for optimistic UI updates
  const previousDataRef = useRef({
    residents: initialResidents,
    total: initialTotal,
    page: 1,
    totalPages: Math.ceil(initialTotal / ITEMS_PER_PAGE),
  });

  // Fetch residents with pagination, filtering, and search
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["residents", page, gender, status, sector, search],
    queryFn: async () => {
      // When a query executes, we're no longer in the initial load
      isInitialLoadRef.current = false;
      
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", ITEMS_PER_PAGE.toString());
      if (gender !== "ALL") params.set("gender", gender);
      if (status !== "ALL") params.set("status", status);
      if (sector !== "ALL") params.set("sector", sector);
      if (search) params.set("search", search);
      
      const res = await fetch(`/api/admin/residents?${params}`);
      if (!res.ok) throw new Error("Failed to fetch residents");
      const data = await res.json();
      
      previousDataRef.current = data;
      return data;
    },
    staleTime: 0,
    initialData: isInitialLoadRef.current ? previousDataRef.current : undefined,
    // Use the previous data as a placeholder while loading
    // This is useful for keeping the UI responsive while data is being fetched
    placeholderData: !isInitialLoadRef.current || 
                  (gender === "ALL" && 
                  status === "ALL" && 
                  sector === "ALL" && 
                  search === "" &&
                  page === 1 ) ?
      previousDataRef.current : undefined,
    // Check if we should skip the initial query
    enabled: !(isInitialLoadRef.current && 
              gender === "ALL" && 
              status === "ALL" && 
              sector === "ALL" && 
              search === "" && 
              page === 1 &&
              initialResidents.length > 0),
  });

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value || null);
    setPage(1); // Reset to first page on search change
  };

  // Handle gender filter changes
  const handleGenderChange = (value: string) => {
    setGender(value || null);
    setPage(1);
  };

  // Handle sector filter changes
  const handleSectorChange = (value: string) => {
    setSector(value || null);
    setPage(1);
  };

  // Handle status filter changes
  const handleStatusChange = (value: string) => {
    setStatus(value || null);
    setPage(1);
  };

  // Get the residents data to display
  const residents = data?.residents || [];
  const totalPages = data?.totalPages || Math.ceil(initialTotal / ITEMS_PER_PAGE);
  const totalResidents = data?.total || initialTotal;

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-col items-start justify-between space-y-4 border-b pb-4 @container">  
        <div>
          <CardTitle className="text-2xl font-bold text-green-primary">Residents</CardTitle>
          <CardDescription>Manage all residents of Barangay Bahay Toro</CardDescription>
        </div>
        <div className="flex w-full flex-col gap-2 @3xl:flex-row sm:gap-4">
          <div className="relative basis-3/4">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or ID..."
              value={search || ""}
              onChange={handleSearchChange}
              className="w-full pl-8"
            />
          </div>
          
          <div className="flex w-full flex-grow flex-col gap-2 @md:flex-row sm:space-x-2 sm:space-y-0">
            <Select value={gender} onValueChange={handleGenderChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Genders</SelectItem>
                {Object.keys(Gender).map((key) => (
                  <SelectItem key={key} value={key}>{getGenderBadge(key as Gender)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by civil status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                {Object.keys(CivilStatus).map((key) => (
                  <SelectItem key={key} value={key}>{getCivilStatusBadge(key as CivilStatus)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sector} onValueChange={handleSectorChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Sectors</SelectItem>
                {Object.keys(Sector).map((key) => (
                  <SelectItem key={key} value={key}>{getSectorBadge(key as Sector)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-green-primary" />
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-red-500">Error loading residents. Please try again.</p>
          </div>
        ) : residents.length > 0 ? (
          <>
            <div className="relative w-full overflow-x-auto">
              {isFetching && <LoaderComponent/>}
              <ResidentTable residents={residents} isLoading={isFetching} refetch={refetch} />
            </div>
            <div className="flex items-center justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(page * ITEMS_PER_PAGE, totalResidents)} of {totalResidents} residents
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(Math.max(page - 1, 1))} 
                  disabled={page === 1 || isFetching}
                  className="px-1 min-[500px]:px-3"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" /> <span className="hidden min-[500px]:inline">Previous</span>
                </Button>
                <div className="text-nowrap text-sm">
                  <span className="hidden min-[500px]:inline">Page</span> {page} of {totalPages}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(page < totalPages ? page + 1 : page)} 
                  disabled={isFetching || page >= totalPages}
                  className="px-1 min-[500px]:px-3"
                >
                  <span className="hidden min-[500px]:inline">Next</span> <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="relative m-6 flex flex-1 items-center justify-center rounded-lg border border-dashed py-20 shadow-sm">
            {isFetching && <LoaderComponent/>}
            <div className="flex flex-col items-center text-center">
              <h3 className="text-2xl font-bold tracking-tight">No Residents</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                No residents match your current filter criteria.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LoaderComponent() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 pt-10">
      <Loader2 className="h-8 w-8 animate-spin text-green-primary" />
    </div>
  );
}