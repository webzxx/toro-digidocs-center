"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { CertificateStatus, CertificateType } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CertificateTable from "./CertificateTable";

const ITEMS_PER_PAGE = 10;

interface CertificateAdminProps {
  initialCertificates: string,
  initialTotal: number;
}

export default function CertificateAdmin({ initialCertificates, initialTotal }: CertificateAdminProps) {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("ALL");
  const [type, setType] = useState<string>("ALL");
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Track if this is the initial load
  const previousDataRef = useRef({
    certificates: JSON.parse(initialCertificates),
    total: initialTotal,
    page: 1,
    totalPages: Math.ceil(initialTotal / ITEMS_PER_PAGE)
  })


  useEffect(() => {
    // If status or type changes from initial values, mark initial load as complete
    if (status !== "ALL" || type !== "ALL") {
        setIsInitialLoad(false);
    }
  }, [status, type]);



  // Fetch certificates with pagination and filtering
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['certificates', page, status, type],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', ITEMS_PER_PAGE.toString());
      if (status !== "ALL") params.set('status', status);
      if (type !== "ALL") params.set('type', type);
      console.log('Fetching certificates with params', params.toString());
      const res = await fetch(`/api/admin/certificates?${params}`);
      if (!res.ok) throw new Error('Failed to fetch certificates');
      const data = await res.json();
      console.log('Certificates data', data);
      previousDataRef.current = data;
      return data;
    },
    staleTime: 0,
    initialData: previousDataRef.current,
    // Skip initial load if status or type is not 'ALL'
    enabled: !(isInitialLoad && initialCertificates.length > 0),
  });

  const certificates = data?.certificates || [];
  const totalPages = data?.totalPages || Math.ceil(initialTotal / ITEMS_PER_PAGE);
  const totalCertificates = data?.total || initialTotal;

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-col items-start justify-between pb-4 border-b md:gap-4 md:flex-row md:items-center md:justify-between">  
        <div>
          <CardTitle className="text-2xl font-bold text-green-primary">Certificate Requests</CardTitle>
          <CardDescription>Manage all certificate requests for Barangay Bahay Toro</CardDescription>
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              {Object.keys(CertificateStatus).map((key) => (
                <SelectItem key={key} value={key}>{key.replace(/_/g, ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="md:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              {Object.keys(CertificateType).map((key) => (
                <SelectItem key={key} value={key}>{key.replace(/_/g, ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-green-primary" />
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-red-500">Error loading certificates. Please try again.</p>
          </div>
        ) : certificates.length > 0 ? (
          <>
            <div className="relative w-full overflow-x-auto">
              {isFetching && <LoaderComponent/>}
              <CertificateTable certificates={certificates} isLoading={isFetching} />
            </div>
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * ITEMS_PER_PAGE + 1} to {Math.min(page * ITEMS_PER_PAGE, totalCertificates)} of {totalCertificates} certificates
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(old => Math.max(old - 1, 1))} 
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
                  onClick={() => setPage(old => old < totalPages ? old + 1 : old)} 
                  disabled={isFetching || page >= totalPages}
                  className="px-1 min-[500px]:px-3"
                >
                  <span className="hidden min-[500px]:inline">Next</span> <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="relative flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-20">
            {isFetching && <LoaderComponent/>}
            <div className="flex flex-col items-center text-center">
              <h3 className="text-2xl font-bold tracking-tight">No Certificate Requests</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Certificate requests will be shown here when they are submitted.
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
    )
}