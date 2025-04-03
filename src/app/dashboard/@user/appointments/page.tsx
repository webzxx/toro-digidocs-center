import { withAuth, WithAuthProps } from "@/lib/auth/withAuth";
import { db } from "@/lib/db";
import AppointmentsClient from "./_components/AppointmentsClient";

async function AppointmentsPage({ user }: WithAuthProps) {
  const userId = parseInt(user.id as unknown as string);
  
  // Fetch all appointments linked to the current user
  const userAppointments = await db.appointment.findMany({
    where: {
      userId: userId,
    },
    include: {
      resident: true,
      certificateRequest: true,
    },
    orderBy: {
      scheduledDateTime: "asc",
    },
  });

  // Serialize the data to avoid "only plain objects can be passed to Client Components" warning
  const serializedAppointments = JSON.parse(JSON.stringify(userAppointments));

  return (
    <main className='flex flex-col gap-2 min-h-[90vh] w-full'>
      <AppointmentsClient 
        appointments={serializedAppointments} 
        userId={userId} 
      />
    </main>
  );
}

export default withAuth(AppointmentsPage, { allowedRoles: ["USER"], adminOverride: false });