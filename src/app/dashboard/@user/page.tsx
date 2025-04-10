import { withAuth, WithAuthProps } from "@/lib/auth/withAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  getUserCertificateStatusCounts, 
  getUserCertificates, 
  getUserAppointments, 
  getUserResidents, 
  getUserPendingPayments,
} from "../dashboard-utils";
import { formatDistanceToNow, format } from "date-fns";
import Link from "next/link";
import { 
  getCertificateStatusIcon, 
  getCertificateStatusBadge,
  getAppointmentStatusBadge,
} from "@/components/utils";
import { DollarSign } from "lucide-react";

async function UserDashboard({ user }: WithAuthProps) {
  const userId = parseInt(user.id as unknown as string);
  
  // Fetch all required data using centralized utilities
  const { pendingCount, processingCount, completedCount, readyForPickupCount } = await getUserCertificateStatusCounts(userId);
  const userCertificates = await getUserCertificates(userId);
  const pendingPayments = await getUserPendingPayments(userId);
  const userAppointments = await getUserAppointments(userId);
  const userResidents = await getUserResidents(userId);
  
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to Bahay Toro DigiDocs Center, {user.username}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {format(new Date(), "MMMM d, yyyy")}
          </p>
        </div>
      </div>

      {/* Main stats cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Certificates
            </CardTitle>
            <div className="!mt-[2px]">{getCertificateStatusIcon("PENDING")}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Processing Certificates
            </CardTitle>
            <div className="!mt-[2px]">{getCertificateStatusIcon("PROCESSING")}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processingCount}</div>
            <p className="text-xs text-muted-foreground">
              In progress
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ready for Pickup
            </CardTitle>
            <div className="!mt-[2px]">{getCertificateStatusIcon("READY_FOR_PICKUP")}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readyForPickupCount}</div>
            <p className="text-xs text-muted-foreground">
              Available for collection
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Certificates
            </CardTitle>
            <div className="!mt-[2px]">{getCertificateStatusIcon("COMPLETED")}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">
              Successfully delivered
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User profiles section */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* My residents */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>My Resident Profiles</CardTitle>
            <CardDescription>
              Your registered resident profiles in Barangay Bahay Toro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userResidents.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">No resident profiles found</p>
                </div>
              ) : (
                userResidents.slice(0, 3).map((resident) => (
                  <div key={resident.id} className="border-b pb-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {resident.firstName} {resident.lastName}
                      </p>
                      <div className="flex items-center">
                        <p className="text-xs text-muted-foreground">
                          {resident.bahayToroSystemId || "ID Pending"}
                        </p>
                        <span className="px-1.5 text-muted-foreground">•</span>
                        <p className="text-xs text-muted-foreground">
                          {resident.gender}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="pt-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/residents">Go to Resident Profiles</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Notice */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-amber-500" />
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingPayments > 0 ? (
              <>
                <div className="text-amber-600 mb-2 font-medium">
                  You have {pendingPayments} pending payment{pendingPayments !== 1 ? "s" : ""}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete your payments to process your certificate requests.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/certificates?status=AWAITING_PAYMENT">
                    View Pending Payments
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <div className="text-green-600 font-medium mb-2">No pending payments</div>
                <p className="text-sm text-muted-foreground">
                  All your certificate requests are paid or don't require payment at this time.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent activities section */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Recent certificate requests */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>My Certificates</CardTitle>
            <CardDescription>
              Recent certificate requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userCertificates.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">No certificate requests found</p>
                </div>
              ) : (
                userCertificates.slice(0, 3).map((cert) => (
                  <div key={cert.id} className="border-b pb-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {cert.certificateType.replace(/_/g, " ")}
                        </p>
                        <div className="flex flex-wrap items-center text-xs text-muted-foreground">
                          <span className="inline-block break-words max-w-full">
                            {cert.referenceNumber}
                          </span>
                          <span className="px-1.5">•</span>
                          <span className="inline-block max-w-full">
                            {formatDistanceToNow(new Date(cert.requestDate), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      {getCertificateStatusBadge(cert.status)}
                    </div>
                  </div>
                ))
              )}
              
              <div className="pt-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/certificates">Go to Certificates</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming appointments */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>My Appointments</CardTitle>
            <CardDescription>
              Your upcoming appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userAppointments.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">No upcoming appointments</p>
                </div>
              ) : (
                userAppointments.slice(0, 3).map((appt) => (
                  <div key={appt.id} className="border-b pb-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {appt.appointmentType.replace(/_/g, " ")}
                        </p>
                        <div className="flex items-center">
                          <p className="text-xs text-muted-foreground">
                            {appt.scheduledDateTime 
                              ? format(new Date(appt.scheduledDateTime), "MMM d, h:mm a")
                              : "Time slot pending"}
                          </p>
                          {appt.resident && (
                            <>
                              <span className="px-1.5 text-muted-foreground">•</span>
                              <p className="text-xs text-muted-foreground">
                                {appt.resident.firstName} {appt.resident.lastName}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      {getAppointmentStatusBadge(appt.status)}
                    </div>
                  </div>
                ))
              )}
              
              <div className="pt-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/appointments">Go to Appointments</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
    </>
  );
}

export default withAuth(UserDashboard);