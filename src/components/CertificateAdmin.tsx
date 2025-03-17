"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { CertificateStatus, CertificateType } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CertificateTable from "./CertificateTable";

const ITEMS_PER_PAGE = 10;

interface CertificateAdminProps {
  initialCertificates: any[];
  initialTotal: number;
}

export default function CertificateAdmin({ initialCertificates, initialTotal }: CertificateAdminProps) {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("ALL");
  const [type, setType] = useState<string>("ALL");
  
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
      return res.json();
    },
    staleTime: 0,
    initialData: {
      certificates: initialCertificates,
      total: initialTotal,
      page: 1,
      totalPages: Math.ceil(initialTotal / ITEMS_PER_PAGE)
    }
  });

  const certificates = data?.certificates || [];
  const totalPages = data?.totalPages || Math.ceil(initialTotal / ITEMS_PER_PAGE);
  const totalCertificates = data?.total || initialTotal;

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
        <div>
          <CardTitle className="text-2xl font-bold text-green-primary">Certificate Requests</CardTitle>
          <CardDescription>Manage all certificate requests for Barangay Bahay Toro</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
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
            <SelectTrigger className="w-[180px]">
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
            <div className="relative">
              {isFetching && (
                <div className="absolute inset-0 bg-white/60 flex justify-center items-center pt-10 z-10">
                  <Loader2 className="h-8 w-8 animate-spin text-green-primary" />
                </div>
              )}
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
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <div className="text-sm">
                  Page {page} of {totalPages}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(old => old < totalPages ? old + 1 : old)} 
                  disabled={isFetching || page >= totalPages}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-20">
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