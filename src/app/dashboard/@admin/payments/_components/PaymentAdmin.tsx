"use client";

import { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { CertificateRequest, Payment, PaymentMethod, PaymentStatus, Resident } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PaymentTable from "./PaymentTable";
import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";
import { getPaymentStatusBadge } from "@/components/utils";
import ManualPaymentButton from "./ManualPaymentButton";

const ITEMS_PER_PAGE = 10;

type PaymentWithDetails = Payment & {
  certificateRequest?: CertificateRequest & {
    referenceNumber: string;
    certificateType: string;
    resident: Pick<Resident, "firstName" | "lastName" | "bahayToroSystemId">;
  };
};

interface PaymentAdminProps {
  initialPayments: PaymentWithDetails[];
  initialTotal: number;
  initialCertificates: CertificateRequest[];
}

export default function PaymentAdmin({ initialPayments, initialTotal, initialCertificates }: PaymentAdminProps) {
  // Query states for URL parameters
  const [page, setPage] = useQueryState("page", { defaultValue: 1, parse: Number });
  const [status, setStatus] = useQueryState("status", { defaultValue: "ALL" });
  const [method, setMethod] = useQueryState("method", { defaultValue: "ALL" });
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  
  // Track if this is the initial load
  const isInitialLoadRef = useRef(true);
  
  // Keep track of previous data for optimistic UI updates
  const previousDataRef = useRef({
    payments: initialPayments,
    total: initialTotal,
    page: 1,
    totalPages: Math.ceil(initialTotal / ITEMS_PER_PAGE),
  });
  
  // Fetch payments with pagination, filtering, and search
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["payments", page, status, method, search],
    queryFn: async () => {
      // When a query executes, we're no longer in the initial load
      isInitialLoadRef.current = false;
      
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", ITEMS_PER_PAGE.toString());
      if (status !== "ALL") params.set("status", status);
      if (method !== "ALL") params.set("method", method);
      if (search) params.set("search", search);
      
      const res = await fetch(`/api/admin/payments?${params}`);
      if (!res.ok) throw new Error("Failed to fetch payments");
      const data = await res.json();
      
      previousDataRef.current = data;
      return data;
    },
    staleTime: 0,
    placeholderData: !isInitialLoadRef.current || 
                  (status === "ALL" && 
                   method === "ALL" &&
                   search === "") ?
      previousDataRef.current : undefined,
    // Check if we should skip the initial query
    enabled: !(isInitialLoadRef.current && 
              status === "ALL" &&
              method === "ALL" && 
              search === "" && 
              initialPayments.length > 0),
  });

  // For certificates that need payment, we'll use the server-provided data
  // and refresh it only when a new payment is added
  const { data: certificatesData, refetch: refetchCertificates } = useQuery({
    queryKey: ["certificate-requests-for-payment"],
    queryFn: async () => {
      const res = await fetch("/api/admin/certificates?status=AWAITING_PAYMENT&limit=100");
      if (!res.ok) throw new Error("Failed to fetch certificate requests");
      const data = await res.json();
      return data.certificates;
    },
    initialData: initialCertificates,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value || null);
    setPage(1); // Reset to first page on search change
  };

  // Function to handle successful payment creation
  const handlePaymentSuccess = () => {
    refetch();
    refetchCertificates();
  };

  // Get the payments data to display
  const payments = data?.payments || [];
  const totalPages = data?.totalPages || Math.ceil(initialTotal / ITEMS_PER_PAGE);
  const totalPayments = data?.total || initialTotal;
  const certificates = certificatesData || initialCertificates;

  return (
    <Card className="shadow-md">
      <CardHeader className="@container flex flex-col items-start justify-between pb-4 border-b space-y-4">  
        <div className="w-full flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-green-primary">Payments</CardTitle>
            <CardDescription>Manage all payments for certificate requests</CardDescription>
          </div>
          <ManualPaymentButton 
            certificates={certificates}
            onSuccess={handlePaymentSuccess}
          />
        </div>
        <div className="@lg:flex-row w-full flex flex-col gap-2 sm:gap-4">
          <div className="relative w-full">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search payments by reference number or resident name..."
              value={search || ""}
              onChange={handleSearchChange}
              className="pl-8 w-full"
            />
          </div>
          <div className="flex flex-col gap-2 @sm:flex-row space-y-0 @sm:space-x-2 w-full">
            <Select value={method} onValueChange={(value) => {
              setMethod(value);
              setPage(1);
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Methods</SelectItem>
                {Object.keys(PaymentMethod).map((key) => (
                  <SelectItem key={key} value={key}>{key.replace(/_/g, " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={status} onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                {Object.keys(PaymentStatus).map((key) => (
                  <SelectItem key={key} value={key}>{getPaymentStatusBadge(key as PaymentStatus)}</SelectItem>
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
            <p className="text-red-500">Error loading payments. Please try again.</p>
          </div>
        ) : payments.length > 0 ? (
          <>
            <div className="relative w-full overflow-x-auto">
              {isFetching && <LoaderComponent/>}
              <PaymentTable payments={payments} certificates={certificates} isLoading={isFetching} refetch={refetch} />
            </div>
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(page * ITEMS_PER_PAGE, totalPayments)} of {totalPayments} payments
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(Math.max(page - 1, 1))} 
                  disabled={page === 1 || isFetching}
                  className="px-1 min-[500px]:px-3"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> <span className="hidden min-[500px]:inline">Previous</span>
                </Button>
                <div className="text-sm text-nowrap">
                  <span className="hidden min-[500px]:inline">Page</span> {page} of {totalPages}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(page < totalPages ? page + 1 : page)} 
                  disabled={isFetching || page >= totalPages}
                  className="px-1 min-[500px]:px-3"
                >
                  <span className="hidden min-[500px]:inline">Next</span> <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="relative flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-20 m-6">
            {isFetching && <LoaderComponent/>}
            <div className="flex flex-col items-center text-center">
              <h3 className="text-2xl font-bold tracking-tight">No Payments</h3>
              <p className="text-sm text-muted-foreground mb-3">
                No payments match your current filter criteria.
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
    <div className="absolute inset-0 bg-white/60 flex justify-center items-center pt-10 z-10">
      <Loader2 className="h-8 w-8 animate-spin text-green-primary" />
    </div>
  );
}