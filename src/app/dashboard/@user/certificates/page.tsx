import { withAuth, WithAuthProps } from "@/lib/auth/withAuth";
import { db } from "@/lib/db";
import CertificatesClient from "./_components/CertificatesClient";

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

  return (
    <main className='flex flex-col gap-2 lg:gap-2 min-h-[90vh] w-full'>
      <CertificatesClient residents={serializedResidents} />
    </main>
  );
}

export default withAuth(CertificatesPage, { allowedRoles: ["USER"], adminOverride: false });