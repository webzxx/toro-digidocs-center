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
  
  // Serialize the data to avoid date serialization issues
  const serializedUsers = JSON.parse(JSON.stringify(users));

  return (
    <main className="flex min-h-[90vh] w-full flex-col gap-2">
      <UserAdmin initialUsers={serializedUsers} initialTotal={totalCount} />
    </main>
  );
}

export default withAuth(UsersPage, { allowedRoles: ["ADMIN"] });