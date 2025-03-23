import { withAuth, WithAuthProps } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sampleAppointments = [
  {
    id: 1,
    date: "2024-01-20",
    time: "10:00 AM",
    purpose: "Document Request",
    status: "Scheduled"
  },
  {
    id: 2,
    date: "2024-01-22",
    time: "2:30 PM",
    purpose: "Certificate Pickup",
    status: "Pending"
  },
];

function AppointmentsPage({ user }: WithAuthProps) {
  return (
    <main className='flex flex-col gap-2 lg:gap-2 min-h-[90vh] w-full'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>My Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {sampleAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{appointment.purpose}</p>
                  <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  appointment.status === 'Scheduled' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default withAuth(AppointmentsPage, { allowedRoles: ["USER"], adminOverride: false });