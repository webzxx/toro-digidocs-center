import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Certificates() {
    return (
      <div className='flex flex-row justify-center items-start flex-wrap px-4 pt-4 gap-4'>
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
  