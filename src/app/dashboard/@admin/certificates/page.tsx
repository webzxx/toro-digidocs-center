import { withAuth } from "@/lib/auth/withAuth";
import { db } from "@/lib/db";
import CertificateAdmin from "./_components/CertificateAdmin";
import { adminCertificateWithRelations } from "@/types/admin";

async function CertificatesPage() {
  // Initial data fetch for SSR
  const certificates = await db.certificateRequest.findMany({
    take: 10,
    orderBy: {
      requestDate: "desc",
    },
    ...adminCertificateWithRelations,
  });

  // Count total certificates for pagination
  const totalCount = await db.certificateRequest.count();
  
  // Serialize the data to avoid date serialization issues
  const serializedCertificates = JSON.parse(JSON.stringify(certificates));

  return (
    <main className="flex min-h-[90vh] w-full flex-col gap-2">
      <CertificateAdmin initialCertificates={serializedCertificates} initialTotal={totalCount} />
    </main>
  );
}

export default withAuth(CertificatesPage, { allowedRoles: ["ADMIN"] });