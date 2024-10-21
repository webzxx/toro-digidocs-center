"use client";

import React, { useState, useEffect, useCallback } from 'react'
import { fetchResidents } from './actions'
import ResidentTable from '@/components/ResidentTable';
import { ResidentWithTypes } from '@/types/types';

export default function ResidentsPage() {
  const [residents, setResidents] = useState<ResidentWithTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadResidents = useCallback(() => {
    setLoading(true);
    fetchResidents().then((fetchedResidents) => {
      setResidents(fetchedResidents);
      console.log(fetchedResidents);
      setLoading(false);
    }).catch(error => {
      console.error("Failed to fetch residents:", error);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadResidents();
  }, [loadResidents]);

  return (
    <main className="flex flex-col gap-2 lg:gap-2 min-h-[90vh] w-full">
      {loading ? (
        <div>Loading...</div>
      ) : residents && residents.length > 0 ? (
        <ResidentTable residents={residents} onReload={loadResidents} />
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              No Residents
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Residents will be shown here when a certificate request is submitted.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}