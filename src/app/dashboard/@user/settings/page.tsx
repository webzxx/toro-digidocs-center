import { withAuth, WithAuthProps } from "@/lib/auth/withAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { User as UserIcon, Mail, Shield, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { db } from "@/lib/db";

async function SettingsPage({ user }: WithAuthProps) {
  // Convert the session user ID (string) to a number for Prisma query
  const userId = parseInt(user.id as unknown as string);
  
  // Fetch the complete user data from Prisma DB
  const fullUser = await db.user.findUnique({
    where: { id: userId }
  });

  if (!fullUser) {
    throw new Error("User not found");
  }

  return (
    <main className="flex flex-col gap-2 lg:gap-2 min-h-[90vh] w-full">
      <Card className="shadow-md">
        <CardHeader className="px-7 flex flex-row items-center justify-between border-b pb-4">
          <div>
            <CardTitle className="text-2xl font-bold text-green-primary">Account Settings</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 max-w-2xl">
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <UserIcon className="h-5 w-5 text-green-700" />
              </div>
              <div className="space-y-1 flex-1">
                <Label className="text-muted-foreground text-sm">Username</Label>
                <p className="font-medium">{fullUser.username}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Mail className="h-5 w-5 text-blue-700" />
              </div>
              <div className="space-y-1 flex-1">
                <Label className="text-muted-foreground text-sm">Email Address</Label>
                <p className="font-medium">{fullUser.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <Shield className="h-5 w-5 text-purple-700" />
              </div>
              <div className="space-y-1 flex-1">
                <Label className="text-muted-foreground text-sm">Account Type</Label>
                <p className="font-medium">{fullUser.role}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <Calendar className="h-5 w-5 text-amber-700" />
              </div>
              <div className="space-y-1 flex-1">
                <Label className="text-muted-foreground text-sm">Account Created</Label>
                <p className="font-medium">{formatDate(fullUser.createdAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default withAuth(SettingsPage, { allowedRoles: ["USER"], adminOverride: false });