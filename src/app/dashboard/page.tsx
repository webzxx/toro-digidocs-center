import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { BarChartComponent } from './_components/bar-chart'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
// import { BarChartBetter } from './_components/bar-chart-better'
import { db } from "@/lib/db";

const StatusCounts = async () => {
  const status = await db.certificateRequest.findMany({
    select: {
      status: true
    }
  })
  const pendingCount = status.filter((s) => s.status === 'PENDING').length
  const processingCount = status.filter((s) => s.status === 'PROCESSING').length
  const completedCount = status.filter((s) => s.status === 'COMPLETED').length

  return { pendingCount, processingCount, completedCount }
}

export default async function Dashboard() {
  const { pendingCount, processingCount, completedCount } = await StatusCounts()

  return (
    <div className='flex flex-row justify-center items-start flex-wrap px-4 pt-4 gap-4'>
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
        {/* <BarChartComponent />
        <BarChartBetter /> */}
      </div>
    </div>
  )
}