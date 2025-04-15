"use client";

import { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { User, UserRole } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UserTable from "./UserTable";
import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";
import CreateUserButton from "./CreateUserButton";

const ITEMS_PER_PAGE = 10;

interface UserAdminProps {
  initialUsers: User[];
  initialTotal: number;
}

export default function UserAdmin({ initialUsers, initialTotal }: UserAdminProps) {
  // Query states for URL parameters
  const [page, setPage] = useQueryState("page", { defaultValue: 1, parse: Number });
  const [role, setRole] = useQueryState("role", { defaultValue: "ALL" });
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  
  // Track if this is the initial load
  const isInitialLoadRef = useRef(true);
  
  // Keep track of previous data for optimistic UI updates
  const previousDataRef = useRef({
    users: initialUsers,
    total: initialTotal,
    page: 1,
    totalPages: Math.ceil(initialTotal / ITEMS_PER_PAGE),
  });
  
  // Fetch users with pagination, filtering, and search
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["users", page, role, search],
    queryFn: async () => {
      // When a query executes, we're no longer in the initial load
      isInitialLoadRef.current = false;
      
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", ITEMS_PER_PAGE.toString());
      if (role !== "ALL") params.set("role", role);
      if (search) params.set("search", search);
      
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      
      previousDataRef.current = data;
      return data;
    },
    staleTime: 0,
    initialData: isInitialLoadRef.current ? previousDataRef.current : undefined,
    placeholderData: !isInitialLoadRef.current || 
                  (role === "ALL" && 
                  search === "" &&
                  page === 1) ?
      previousDataRef.current : undefined,
    // Check if we should skip the initial query
    enabled: !(isInitialLoadRef.current && 
              role === "ALL" && 
              search === "" && 
              page === 1 &&
              initialUsers.length > 0),
  });

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value || null);
    setPage(1); // Reset to first page on search change
  };

  // Handle role selection
  const handleRoleChange = (selected: string) => {
    setRole(selected);
    setPage(1); // Reset to first page on role change
  };

  // Get the users data to display
  const users = data?.users || [];
  const totalPages = data?.totalPages || Math.ceil(initialTotal / ITEMS_PER_PAGE);
  const totalUsers = data?.total || initialTotal;

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-col items-start justify-between space-y-4 border-b pb-4 @container">  
        <div>
          <CardTitle className="text-2xl font-bold text-green-primary">Users</CardTitle>
          <CardDescription>Manage all users of Barangay Bahay Toro</CardDescription>
        </div>
        <div className="flex w-full flex-col gap-2 @xl:flex-row sm:gap-4">
          <div className="relative basis-1/2">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users by username or email..."
              value={search || ""}
              onChange={handleSearchChange}
              className="w-full pl-8"
            />
          </div>
          <div className="flex basis-1/2 flex-col gap-2 space-y-0 @sm:flex-row @sm:space-x-2">
            <Select value={role} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                {Object.keys(UserRole).map((key) => (
                  <SelectItem key={key} value={key}>{key}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-end">
              <CreateUserButton />
            </div>
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
            <p className="text-red-500">Error loading users. Please try again.</p>
          </div>
        ) : users.length > 0 ? (
          <>
            <div className="relative w-full overflow-x-auto">
              {isFetching && <LoaderComponent/>}
              <UserTable users={users} isLoading={isFetching} refetch={refetch} />
            </div>
            <div className="flex items-center justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(page * ITEMS_PER_PAGE, totalUsers)} of {totalUsers} users
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
          <div className="relative flex flex-1 items-center justify-center rounded-lg border border-dashed py-20 shadow-sm">
            {isFetching && <LoaderComponent/>}
            <div className="flex flex-col items-center text-center">
              <h3 className="text-2xl font-bold tracking-tight">No Users</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                No users match your current filter criteria.
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