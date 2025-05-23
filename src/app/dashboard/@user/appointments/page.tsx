import { withAuth, WithAuthProps } from "@/lib/auth/withAuth";
import { db } from "@/lib/db";
import AppointmentsClient from "./_components/AppointmentsClient";
import { userAppointmentWithRelations, userResidentForAppointment } from "@/types/user";

async function AppointmentsPage({ user }: WithAuthProps) {
  const userId = parseInt(user.id as unknown as string);
  
  // Fetch all appointments linked to the current user
  const userAppointments = await db.appointment.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      scheduledDateTime: "asc",
    },
    ...userAppointmentWithRelations,
  });
  
  // Fetch all residents linked to the current user
  const userResidents = await db.resident.findMany({
    where: {
      userId: userId,
    },
    ...userResidentForAppointment,
  });

  // Serialize the data to avoid "only plain objects can be passed to Client Components" warning
  const serializedAppointments = JSON.parse(JSON.stringify(userAppointments));
  const serializedResidents = JSON.parse(JSON.stringify(userResidents));

  return (
    <main className='flex min-h-[90vh] w-full flex-col gap-2'>
      <AppointmentsClient 
        appointments={serializedAppointments} 
        residents={serializedResidents}
        userId={userId} 
      />
    </main>
  );
}

export default withAuth(AppointmentsPage, { allowedRoles: ["USER"], adminOverride: false });