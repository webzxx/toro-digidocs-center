import { withAuth } from "@/lib/auth/withAuth";
import { db } from "@/lib/db";
import ResidentAdmin from "./_components/ResidentAdmin";

async function ResidentsPage() {
  // Initial data fetch for SSR - limited to first page only
  const residents = await db.resident.findMany({
    take: 10,
    orderBy: {
      lastName: "asc",
    },
    include: {
      address: true,
      emergencyContact: true,
      proofOfIdentity: true,
    },
  });

  // Count total residents for pagination
  const totalCount = await db.resident.count();

  return (
    <main className="flex flex-col gap-2 lg:gap-2 min-h-[90vh] w-full">
      <ResidentAdmin initialResidents={JSON.stringify(residents)} initialTotal={totalCount} />
    </main>
  );
}

export default withAuth(ResidentsPage, { allowedRoles: ["ADMIN"] });