import { withAuth } from "@/lib/auth/withAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { 
  getAdminCertificateStatusCounts, 
  getAdminRecentCertificates, 
  getAdminUpcomingAppointments, 
  getAdminUserStats, 
  getAdminPaymentStats, 
  getAdminResidentStats, 
} from "../dashboard-utils";
import { formatDistanceToNow, format } from "date-fns";
import { 
  ArrowUpRight,
  User,
  Home,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { 
  getCertificateStatusIcon, 
  getAppointmentStatusIcon, 
  getCertificateStatusBadge,
  getAppointmentStatusBadge,
} from "@/components/utils";

async function AdminDashboard() {
  // Fetch all required data using centralized utilities
  const { pendingCount, processingCount, completedCount } = await getAdminCertificateStatusCounts();
  const recentCertificates = await getAdminRecentCertificates();
  const upcomingAppointments = await getAdminUpcomingAppointments();
  const { totalUsers, newUsersThisMonth } = await getAdminUserStats();
  const { totalPayments, totalAmount, pendingPayments } = await getAdminPaymentStats();
  const { totalResidents, newResidentsThisMonth } = await getAdminResidentStats();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of the Bahay Toro DigiDocs Center
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
        <Card className="relative group">
          <Link href="/dashboard/certificates?status=PENDING" className="absolute inset-0 z-10" aria-label="View pending certificates" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Certificates
            </CardTitle>
            {getCertificateStatusIcon("PENDING")}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Awaiting review & approval
              </p>
              <ArrowUpRight className="h-4 w-4 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="relative group">
          <Link href="/dashboard/certificates?status=PROCESSING" className="absolute inset-0 z-10" aria-label="View processing certificates" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Processing Certificates
            </CardTitle>
            {getCertificateStatusIcon("PROCESSING")}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processingCount}</div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Currently being processed
              </p>
              <ArrowUpRight className="h-4 w-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="relative group">
          <Link href="/dashboard/certificates?status=COMPLETED" className="absolute inset-0 z-10" aria-label="View completed certificates" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Certificates
            </CardTitle>
            {getCertificateStatusIcon("COMPLETED")}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Successfully delivered to residents
              </p>
              <ArrowUpRight className="h-4 w-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="relative group">
          <Link href="/dashboard/appointments?status=REQUESTED" className="absolute inset-0 z-10" aria-label="View upcoming appointments" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Appointments
            </CardTitle>
            {getAppointmentStatusIcon("REQUESTED")}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Scheduled for the next few days
              </p>
              <ArrowUpRight className="h-4 w-4 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary stats */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="relative group">
          <Link href="/dashboard/users" className="absolute inset-0 z-10" aria-label="View users" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <User className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <div className="flex justify-between items-center">
              <div className="flex items-center pt-1">
                <TrendingUp className="h-3.5 w-3.5 text-green-500 mr-1" />
                <span className="text-xs text-green-500">+{newUsersThisMonth}</span>
                <span className="text-xs text-muted-foreground ml-1">this month</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="relative group">
          <Link href="/dashboard/residents" className="absolute inset-0 z-10" aria-label="View residents" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Residents</CardTitle>
            <Home className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResidents}</div>
            <div className="flex justify-between items-center">
              <div className="flex items-center pt-1">
                <TrendingUp className="h-3.5 w-3.5 text-green-500 mr-1" />
                <span className="text-xs text-green-500">+{newResidentsThisMonth}</span>
                <span className="text-xs text-muted-foreground ml-1">this month</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="relative group">
          <Link href="/dashboard/payments?status=PENDING" className="absolute inset-0 z-10" aria-label="View pending payments" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{totalAmount.toFixed(2)}</div>
            <div className="flex justify-between items-center">
              <div className="flex items-center pt-1">
                <span className="text-xs text-muted-foreground">{totalPayments} successful payments</span>
                <span className="text-xs text-amber-500 ml-2">{pendingPayments} pending</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activities section */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Recent certificate requests */}
        <Card className="col-span-1">
          <CardHeader className="flex justify-between items-start">
            <div>
              <CardTitle>Recent Certificate Requests</CardTitle>
              <CardDescription>
                Latest certificate requests from residents
              </CardDescription>
            </div>
            <Link 
              href="/dashboard/certificates" 
              className="text-sm text-blue-500 hover:underline flex items-center"
            >
              View all
              <ArrowUpRight className="ml-1 h-3 w-3 flex-shrink-0" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCertificates.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent certificate requests</p>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      {recentCertificates.filter(c => c.status === "PENDING").length} pending • {recentCertificates.filter(c => c.status === "AWAITING_PAYMENT").length} awaiting payment
                    </span>
                  </div>
                  {recentCertificates.map((cert) => (
                    <div key={cert.id} className="relative group">
                      <Link href={`/dashboard/certificates?search=${cert.referenceNumber}`} className="absolute inset-0 z-10" aria-label={`View certificate ${cert.referenceNumber}`} />
                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {cert.resident.firstName} {cert.resident.lastName}
                          </p>
                          <div className="flex flex-wrap items-center text-xs text-muted-foreground">
                            <span className="inline-block max-w-full break-words">
                              {cert.certificateType.replace(/_/g, " ")}
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
                  ))}
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <Link href="/dashboard/certificates?status=PENDING" className="text-sm text-blue-500 hover:underline flex items-center">
              Pending certificates
              <ArrowUpRight className="ml-1 h-3 w-3 flex-shrink-0" />
            </Link>
            <Link href="/dashboard/certificates?status=AWAITING_PAYMENT" className="text-sm text-blue-500 hover:underline flex items-center">
              Awaiting payment
              <ArrowUpRight className="ml-1 h-3 w-3 flex-shrink-0" />
            </Link>
          </CardFooter>
        </Card>

        {/* Upcoming appointments */}
        <Card className="col-span-1">
          <CardHeader className="flex justify-between items-start">
            <div>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>
                Scheduled appointments with residents
              </CardDescription>
            </div>
            <Link 
              href="/dashboard/appointments" 
              className="text-sm text-blue-500 hover:underline flex items-center"
            >
              View all
              <ArrowUpRight className="ml-1 h-3 w-3 flex-shrink-0" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming appointments</p>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      {upcomingAppointments.filter(a => a.status === "REQUESTED").length} requesting • {upcomingAppointments.filter(a => a.status === "SCHEDULED").length} scheduled
                    </span>
                  </div>
                  {upcomingAppointments.map((appt) => (
                    <div key={appt.id} className="relative group">
                      <Link href={`/dashboard/appointments?search=${appt.referenceNumber}`} className="absolute inset-0 z-10" aria-label={`View appointment ${appt.referenceNumber}`} />
                      <div className="flex items-center justify-between border-b pb-2">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {appt.resident ? `${appt.resident.firstName} ${appt.resident.lastName}` : appt.user.username}
                          </p>
                          <div className="flex flex-wrap items-center text-xs text-muted-foreground">
                            <span className="inline-block break-words max-w-full">
                              {appt.appointmentType.replace(/_/g, " ")}
                            </span>
                            <span className="px-1.5">•</span>
                            <span className="inline-block max-w-full">
                              {appt.scheduledDateTime 
                                ? format(new Date(appt.scheduledDateTime), "MMM d, h:mm a")
                                : "Time slot pending"}
                            </span>
                          </div>
                        </div>
                        {getAppointmentStatusBadge(appt.status)}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <Link href="/dashboard/appointments?status=REQUESTED" className="text-sm text-blue-500 hover:underline flex items-center">
              Requested appointments
              <ArrowUpRight className="ml-1 h-3 w-3 flex-shrink-0" />
            </Link>
            <Link href="/dashboard/appointments?status=SCHEDULED" className="text-sm text-blue-500 hover:underline flex items-center">
              Scheduled appointments
              <ArrowUpRight className="ml-1 h-3 w-3 flex-shrink-0" />
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      {/* Quick Actions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              href="/dashboard/certificates?status=AWAITING_PAYMENT"
              className="flex flex-col p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Process Payments</h3>
                {getCertificateStatusIcon("AWAITING_PAYMENT")}
              </div>
              <p className="text-xs text-gray-600">Review and process pending certificate payments</p>
            </Link>
            
            <Link 
              href="/dashboard/certificates?status=UNDER_REVIEW"
              className="flex flex-col p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Review Certificates</h3>
                {getCertificateStatusIcon("UNDER_REVIEW")}
              </div>
              <p className="text-xs text-gray-600">Review certificate requests in the verification queue</p>
            </Link>
            
            <Link 
              href="/dashboard/appointments?status=REQUESTED"
              className="flex flex-col p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Schedule Appointments</h3>
                {getAppointmentStatusIcon("REQUESTED")}
              </div>
              <p className="text-xs text-gray-600">Assign time slots to requested appointments</p>
            </Link>
            
            <Link 
              href="/dashboard/certificates?status=READY_FOR_PICKUP"
              className="flex flex-col p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Ready for Pickup</h3>
                {getCertificateStatusIcon("READY_FOR_PICKUP")}
              </div>
              <p className="text-xs text-gray-600">View certificates ready for resident pickup</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default withAuth(AdminDashboard, { allowedRoles: ["ADMIN"] });