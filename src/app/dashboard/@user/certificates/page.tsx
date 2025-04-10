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
            // Include all payment details we need to display
            select: {
              transactionReference: true,
              amount: true,
              paymentStatus: true,
              paymentMethod: true,
              createdAt: true,
              updatedAt: true,
              paymentDate: true,
            },
          },
        },
      },
    },  
  });

  // Serialize the data to avoid "only plain objects can be passed to Client Components" warning
  const serializedResidents = JSON.parse(JSON.stringify(residents));

  return (
    <main className='flex min-h-[90vh] w-full flex-col gap-2'>
      <CertificatesClient residents={serializedResidents} />
    </main>
  );
}

export default withAuth(CertificatesPage, { allowedRoles: ["USER"], adminOverride: false });