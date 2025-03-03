import { withAuth, WithAuthProps } from "@/lib/withAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

function SettingsPage({ user }: WithAuthProps) {
  return (
    <div className='flex flex-col gap-4 lg:p-4'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label>Username</Label>
              <p className="text-sm text-gray-500">{user.username}</p>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <div className="space-y-2">
              <Label>Account Type</Label>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(SettingsPage, { allowedRoles: ["USER"], adminOverride: false });