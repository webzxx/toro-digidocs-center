import { withAuth, WithAuthProps } from "@/lib/auth/withAuth";
import { db } from "@/lib/db";
import CertificatesClient from "./_components/CertificatesClient";
import RequestCertificateButton from "./_components/RequestCertificateButton";

async function CertificatesPage({ user }: WithAuthProps) {
  const userId = parseInt(user.id as unknown as string); // Convert string to number
  // Fetch residents and their certificate requests including payment information
  const residents = await db.resident.findMany({
    where: {
      userId: userId,
    },
    include: {
      certificateRequests: {
        include: {
          payments: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
      },
    },  
  });

  // Serialize the data to avoid "only plain objects can be passed to Client Components" warning
  const serializedResidents = JSON.parse(JSON.stringify(residents));

  const hasCertificates = residents.some(resident => resident.certificateRequests.length > 0);

  return (
    <main className='flex flex-col gap-2 lg:gap-2 min-h-[90vh] w-full'>
      {hasCertificates ? (
        <CertificatesClient
          residents={serializedResidents}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no certificates
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Your certificate requests will be shown here.
            </p>
            <RequestCertificateButton residents={serializedResidents} />
          </div>
        </div>
      )}
    </main>
  );
}

export default withAuth(CertificatesPage, { allowedRoles: ["USER"], adminOverride: false });