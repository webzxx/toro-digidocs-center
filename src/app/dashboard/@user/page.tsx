import { withAuth, WithAuthProps } from "@/lib/auth/withAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function UserDashboard({ user }: WithAuthProps) {
  return (
    <div className='flex flex-row justify-center items-start flex-wrap lg:px-4 lg:pt-4 gap-4'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>My Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome, {user.username}!</p>
          {/* Add user-specific content here */}
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(UserDashboard, { allowedRoles: ["USER"], adminOverride: false });