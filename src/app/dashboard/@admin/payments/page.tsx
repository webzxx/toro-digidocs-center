import { withAuth } from "@/lib/auth/withAuth";
import { db } from "@/lib/db";
import PaymentAdmin from "./_components/PaymentAdmin";

async function PaymentsPage() {
  // Initial data fetch for SSR - limited to first page only
  const payments = await db.payment.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      certificateRequest: {
        select: {
          referenceNumber: true,
          certificateType: true,
          resident: {
            select: {
              firstName: true,
              lastName: true,
              bahayToroSystemId: true,
            },
          },
        },
      },
    },
  });

  // Count total payments for pagination
  const totalCount = await db.payment.count();
  
  // Serialize the data to avoid date serialization issues
  const serializedPayments = JSON.parse(JSON.stringify(payments));

  return (
    <main className="flex flex-col gap-2 lg:gap-2 min-h-[90vh] w-full">
      <PaymentAdmin initialPayments={serializedPayments} initialTotal={totalCount} />
    </main>
  );
}

export default withAuth(PaymentsPage, { allowedRoles: ["ADMIN"] });