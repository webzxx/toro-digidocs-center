import { withAuth, WithAuthProps } from "@/lib/auth/withAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { User as UserIcon, Mail, Shield, Calendar, LockKeyhole } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { db } from "@/lib/db";
import { ChangePasswordForm } from "./_components/ChangePasswordForm";

async function SettingsPage({ user }: WithAuthProps) {
  // Convert the session user ID (string) to a number for Prisma query
  const userId = parseInt(user.id as unknown as string);
  
  // Fetch the complete user data from Prisma DB
  const fullUser = await db.user.findUnique({
    where: { id: userId },
  });

  if (!fullUser) {
    throw new Error("User not found");
  }

  return (
    <main className="flex min-h-[90vh] w-full flex-col gap-4">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between border-b px-7 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold text-green-primary">Account Information</CardTitle>
            <CardDescription>View your account details</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid max-w-2xl gap-6">
            <div className="flex items-center gap-4 rounded-lg border bg-slate-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <UserIcon className="h-5 w-5 text-green-700" />
              </div>
              <div className="flex-1 space-y-1">
                <Label className="text-sm text-muted-foreground">Username</Label>
                <p className="font-medium">{fullUser.username}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 rounded-lg border bg-slate-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Mail className="h-5 w-5 text-blue-700" />
              </div>
              <div className="flex-1 space-y-1">
                <Label className="text-sm text-muted-foreground">Email Address</Label>
                <p className="font-medium">{fullUser.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 rounded-lg border bg-slate-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <Shield className="h-5 w-5 text-purple-700" />
              </div>
              <div className="flex-1 space-y-1">
                <Label className="text-sm text-muted-foreground">Account Type</Label>
                <p className="font-medium">{fullUser.role}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 rounded-lg border bg-slate-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <Calendar className="h-5 w-5 text-amber-700" />
              </div>
              <div className="flex-1 space-y-1">
                <Label className="text-sm text-muted-foreground">Account Created</Label>
                <p className="font-medium">{formatDateTime(fullUser.createdAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between border-b px-7 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold text-green-primary">Security</CardTitle>
            <CardDescription>Update your password</CardDescription>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <LockKeyhole className="h-5 w-5 text-green-700" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </main>
  );
}

export default withAuth(SettingsPage, { allowedRoles: ["USER"], adminOverride: false });