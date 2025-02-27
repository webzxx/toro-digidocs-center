import { withAuth } from "@/lib/withAuth";
import { db } from "@/lib/db";
import CertificateTable from '@/components/CertificateTable';

async function CertificatesPage() {
  const certificates = await db.certificateRequest.findMany();

  return (
    <main className="flex flex-col gap-2 lg:gap-2 min-h-[90vh] w-full">
      {certificates && certificates.length > 0 ? (
        <CertificateTable certificates={certificates} />
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

export default withAuth(CertificatesPage, { allowedRoles: ["ADMIN"] });