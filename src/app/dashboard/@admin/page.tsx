import { withAuth } from '@/lib/auth/withAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusCounts } from "../dashboard-utils";

async function AdminDashboard() {
  const { pendingCount, processingCount, completedCount } = await StatusCounts();
  return (
    <div className='flex flex-row justify-center items-start flex-wrap lg:px-4 lg:pt-4 gap-4'>
      <Card className='w-[20rem]'>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-medium">
            Pending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingCount}</div>
        </CardContent>
      </Card>
      <Card className='w-[20rem]'>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-medium">
            Processing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{processingCount}</div>
        </CardContent>
      </Card>
      <Card className='w-[20rem]'>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-medium">
            Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedCount}</div>
        </CardContent>
      </Card>
      <div className='flex flex-wrap gap-2'>
        {/* Add any additional charts or components here */}
      </div>
    </div>
  );
}

export default withAuth(AdminDashboard, { allowedRoles: ["ADMIN"] });