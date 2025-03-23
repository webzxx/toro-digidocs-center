import { withAuth } from "@/lib/withAuth";
import { db } from "@/lib/db";
import CertificateAdmin from './_components/CertificateAdmin';

async function CertificatesPage() {
  // Initial data fetch for SSR
  const certificates = await db.certificateRequest.findMany({
    take: 10,
    orderBy: {
      requestDate: 'desc'
    },
    include: {
      resident: {
        select: {
          firstName: true,
          lastName: true,
          bahayToroSystemId: true
        }
      },
      payments: {
        where: {
          isActive: true
        },
        select: {
          id: true,
          paymentStatus: true,
          amount: true,
          paymentDate: true
        }
      }
    }
  });

  // Count total certificates for pagination
  const totalCount = await db.certificateRequest.count();

  return (
    <main className="flex flex-col gap-2 lg:gap-2 min-h-[90vh] w-full">
      <CertificateAdmin initialCertificates={JSON.stringify(certificates)} initialTotal={totalCount} />
    </main>
  );
}

export default withAuth(CertificatesPage, { allowedRoles: ["ADMIN"] });