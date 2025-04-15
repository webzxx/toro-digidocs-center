import { withAuth, WithAuthProps } from "@/lib/auth/withAuth";
import { db } from "@/lib/db";
import { residentWithRelations } from "@/types/shared";
import ResidentsClient from "./_components/ResidentsClient";

async function ResidentsPage({ user }: WithAuthProps) {
  const userId = parseInt(user.id as unknown as string);
  
  // Fetch all residents linked to the current user
  const userResidents = await db.resident.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    ...residentWithRelations,
  });

  return (
    <main className='flex min-h-[90vh] w-full flex-col gap-2'>
      <ResidentsClient userResidents={userResidents} />
    </main>
  );
}

export default withAuth(ResidentsPage, { allowedRoles: ["USER"], adminOverride: false });