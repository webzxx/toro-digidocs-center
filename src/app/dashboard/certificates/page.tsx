"use client";

import { CertificateRequest } from '@prisma/client'
import React, { useState, useEffect, useCallback } from 'react'
import { fetchCertificates } from './actions'
import CertificateTable from '@/components/CertificateTable';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
export default function CertificatesPage() {
  const { data: session } = useSession();
  const [certificates, setCertificates] = useState<CertificateRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const loadCertificates = useCallback(() => {
    setLoading(true);
    fetchCertificates().then((fetchedCertificates) => {
      setCertificates(fetchedCertificates);
      setLoading(false);
    }).catch(error => {
      console.error("Failed to fetch certificates:", error);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadCertificates();
  }, [loadCertificates]);

  return (
    <main className="flex flex-col gap-2 lg:gap-2 min-h-[90vh] w-full">
      {loading ? (
        <div>Loading...</div>
      ) : certificates && certificates.length > 0 ? (
        <CertificateTable certificates={certificates} onReload={loadCertificates} />
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              No Certificate Requests
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Certificate requests will be shown here when they are submitted.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}