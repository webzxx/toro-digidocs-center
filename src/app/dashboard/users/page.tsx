"use client";

import { User } from '@prisma/client'
import React, { useState, useEffect, useCallback } from 'react'
import { fetchUsers } from './actions'
import UserTable from '@/components/UserTable';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function UsersPage() {
  const { data: session, update } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const loadUsers = useCallback(() => {
    setLoading(true);
    fetchUsers().then((fetchedUsers) => {
      setUsers(fetchedUsers);
      setLoading(false);
      const role = fetchedUsers.find((user) => user.id.toString() === session?.user?.id)?.role;
      update({ role }); // Update the role in the session
    });
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <main className="flex flex-col gap-2 lg:gap-2 min-h-[90vh] w-full">
      {loading ? (
        <div>Loading...</div>
      ) : users && users.length > 0 ? (
        <UserTable users={users} onReload={loadUsers} />
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