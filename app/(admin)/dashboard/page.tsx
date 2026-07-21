import { getAllLocations } from "@/actions/location.action";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import AdminHeader from "@/components/admin-header";
import { getAllClasses } from "@/actions/class-action";
import { getLoggedInUser } from "@/utils/get-user";
import { redirect } from "next/navigation";
import { getAllBookings } from "@/actions/booking.action";
import { getAllWaitListEntries } from "@/actions/waitlist.action";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getLoggedInUser();

  if (!user) return redirect("/");

  const [classes, bookings, waitlist, locations] = await Promise.all([
    getAllClasses(),
    getAllBookings(),
    getAllWaitListEntries(),
    getAllLocations(),
  ]);

  const classData = classes?.data
    ? classes.data.map((cls: any) => ({
        id: cls.id,
        name: cls.name,
        type: cls.type,
        instructor: cls.instructor,
        description: cls.description,
        image: cls.image,
        capacity: cls.capacity,
        status: cls.status,
        locationId: cls.locationId,
        location: cls.location?.name || "Unknown",
        remaining: cls.remaining ?? cls.capacity,
        startsAt: cls.startsAt,
        endsAt: cls.endsAt,
      }))
    : [];

  const bookingsData = Array.isArray(bookings)
    ? bookings.map((b: any) => ({
        customer: b.customerName,
        email: b.customerEmail,
        className: b.class?.name || "Unknown",
        status: b.status,
        createdAt: b.createdAt,
        classType: b.class?.type || "Unknown",
      }))
    : [];

  const waitlistData = Array.isArray(waitlist)
    ? waitlist.map((w: any) => ({
        name: w.customerName,
        email: w.customerEmail,
        class: w.class?.name || "Unknown",
        location: w.class?.location?.name || "Unknown",
        status: w.status,
      }))
    : [];

  return (
    <>
      <AdminHeader
        title="Dashboard overview"
        description="Today across all Mercer studios"
      />
      <DashboardShell
        userId={user.session.userId}
        classData={classData}
        locations={locations}
        bookings={bookingsData}
        waitlist={waitlistData}
      />
    </>
  );
}
