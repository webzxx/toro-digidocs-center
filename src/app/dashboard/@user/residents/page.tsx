import { withAuth, WithAuthProps } from "@/lib/withAuth";
import { db } from "@/lib/db";
import { ResidentWithTypes } from "@/types/types";
import ResidentsClient from "@/components/ResidentsClient";

async function ResidentsPage({ user }: WithAuthProps) {
  const userId = parseInt(user.id as unknown as string);
  
  // Fetch all residents linked to the current user
  const userResidents = await db.resident.findMany({
    where: {
      userId: userId,
    },
    include: {
      address: true,
      emergencyContact: true,
      proofOfIdentity: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  }) as ResidentWithTypes[];

  return (
    <main className="flex flex-col gap-4 p-4">
      <ResidentsClient userResidents={userResidents} />
    </main>
  );
}

export default withAuth(ResidentsPage, { allowedRoles: ["USER"], adminOverride: false });