import {
  ScheduleClass,
} from "@/components/classes/ScheduleClass";
import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";
import { getAllClasses } from "@/actions/class-action";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const classes = await getAllClasses();
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
        activeWaitlistCount: cls.activeWaitlistCount ?? 0,
        startsAt: cls.startsAt,
      }))
    : [];
  return (
    <>
      <Navbar />
      <ScheduleClass classData={classData} />
      <Footer />
    </>
  );
}
