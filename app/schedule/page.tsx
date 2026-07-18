import { ScheduleExperience } from '@/components/classes/ScheduleExperience';
import { Footer } from '@/components/shared/Footer';
import { Navbar } from '@/components/shared/Navbar';
import { getAllClasses } from '@/actions/class-action';

export default async function SchedulePage() {

  const classes = await getAllClasses();
  const classData = classes?.data ? classes.data.map((cls: any) => ({
    id: cls.id,
    name: cls.name,
    type: cls.type,
    instructor: cls.instructor,
    description: cls.description,
    image: cls.image,
    capacity: cls.capacity,
    status: cls.status,
    locationId: cls.locationId,
    location: cls.location?.name || 'Unknown',
    remaining: cls.remaining ?? cls.capacity,
    startsAt: cls.startsAt,
  })) : [];
  return (
    <>
      <Navbar />
      <ScheduleExperience classData={classData} />
      <Footer />
    </>
  );
}
