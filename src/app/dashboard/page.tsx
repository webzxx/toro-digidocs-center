import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { BarChartComponent } from './_components/bar-chart'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
// import { BarChartBetter } from './_components/bar-chart-better'

export default async function Dashboard() {

  return (
    <div className='flex flex-row justify-center items-start flex-wrap px-4 pt-4 gap-4'>
      <Card className='w-[20rem]'>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-medium">
            Pending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5</div>
        </CardContent>
      </Card>
      <Card className='w-[20rem]'>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-medium">
            Processing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5</div>
        </CardContent>
      </Card>
      <Card className='w-[20rem]'>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-medium">
            Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5</div>
        </CardContent>
      </Card>
      <div className='flex flex-wrap gap-2'>
        {/* <BarChartComponent />
        <BarChartBetter /> */}
      </div>
      <div className='grid sm:grid-cols-1 w-full gap-3'>
        <Card className="">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Certificates Requests</CardTitle>
              <CardDescription>
                Manage Certification Request
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              {/* <Link href="/dashboard/projects">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link> */}
            </Button>
          </CardHeader>
          <CardContent>
            <div style={{ maxHeight: '320px', overflowY: 'auto' }}> {/* Adjust maxHeight according to your design */}
              <main className="flex flex-col gap-2 lg:gap-2 h-[300px] w-full">
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
                  <div className="flex flex-col items-center text-center">
                    <h3 className="text-xl font-bold tracking-tight">
                      
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      
                    </p>
                  </div>
                </div>
              </main>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}