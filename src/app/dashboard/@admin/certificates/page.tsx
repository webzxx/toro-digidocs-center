import { withAuth } from "@/lib/auth/withAuth";
import { db } from "@/lib/db";
import CertificateAdmin from "./_components/CertificateAdmin";
import { adminCertificateWithRelations } from "@/types/types";

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

  return (
    <main className="flex flex-col gap-2 min-h-[90vh] w-full">
      <CertificateAdmin initialCertificates={JSON.stringify(certificates)} initialTotal={totalCount} />
    </main>
  );
}

export default withAuth(CertificatesPage, { allowedRoles: ["ADMIN"] });