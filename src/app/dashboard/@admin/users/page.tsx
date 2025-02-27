import { withAuth } from "@/lib/withAuth";
import { db } from "@/lib/db";
import UserTable from '@/components/UserTable';

async function UsersPage() {
  const users = await db.user.findMany();

  return (
    <main className="flex flex-col gap-2 lg:gap-2 min-h-[90vh] w-full">
      {users && users.length > 0 ? (
        <UserTable users={users} />
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no users
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Users will be shown here including their roles.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

export default withAuth(UsersPage, { allowedRoles: ["ADMIN"] });