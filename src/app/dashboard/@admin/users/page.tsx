import { withAuth } from "@/lib/auth/withAuth";
import { db } from "@/lib/db";
import UserAdmin from "./_components/UserAdmin";

async function UsersPage() {
  // Initial data fetch for SSR - limited to first page only
  const users = await db.user.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Count total users for pagination
  const totalCount = await db.user.count();

  return (
    <main className="flex flex-col gap-2 lg:gap-2 min-h-[90vh] w-full">
      <UserAdmin initialUsers={JSON.stringify(users)} initialTotal={totalCount} />
    </main>
  );
}

export default withAuth(UsersPage, { allowedRoles: ["ADMIN"] });