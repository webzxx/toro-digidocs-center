import { db } from "@/lib/db";
import AppointmentAdmin from "./_components/AppointmentAdmin";
import { adminAppointmentWithRelations, ResidentForAppointment } from "@/types/types";
import { withAuth } from "@/lib/auth/withAuth";

async function AppointmentsPage() {
  // Initial data fetch for SSR - limited to first page only
  const appointments = await db.appointment.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    ...adminAppointmentWithRelations,
  });
  
  // Count total appointments for pagination
  const totalCount = await db.appointment.count();
  
  // Fetch all residents for the appointment form
  const residents = await db.resident.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      bahayToroSystemId: true,
      userId: true,
    },
    orderBy: {
      lastName: "asc",
    },
  }) as ResidentForAppointment[];
  
  // Serialize the data to avoid date serialization issues
  const serializedAppointments = JSON.parse(JSON.stringify(appointments));
  const serializedResidents = JSON.parse(JSON.stringify(residents));
  
  return (
    <main className="flex min-h-[90vh] w-full flex-col gap-2">
      <AppointmentAdmin 
        initialAppointments={serializedAppointments} 
        initialTotal={totalCount}
        residents={serializedResidents}
      />
    </main>
  );
}

export default withAuth(AppointmentsPage, { allowedRoles: ["ADMIN"] });