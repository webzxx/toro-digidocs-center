import { db } from "@/lib/db";
import AppointmentAdmin from "./_components/AppointmentAdmin";

async function AppointmentsPage() {
  // Initial data fetch for SSR - limited to first page only
  const appointments = await db.appointment.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          username: true,
          email: true,
        },
      },
      resident: {
        select: {
          firstName: true,
          lastName: true,
          bahayToroSystemId: true,
        },
      },
    },
  });
  
  // Count total appointments for pagination
  const totalCount = await db.appointment.count();
  
  // Serialize the data to avoid date serialization issues
  const serializedAppointments = JSON.parse(JSON.stringify(appointments));
  
  return (
    <main className="flex flex-col gap-2 min-h-[90vh] w-full">
      <AppointmentAdmin 
        initialAppointments={serializedAppointments} 
        initialTotal={totalCount}
      />
    </main>
  );
}

export default AppointmentsPage;