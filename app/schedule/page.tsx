import { ScheduleExperience } from '@/components/classes/ScheduleExperience';
import { Footer } from '@/components/shared/Footer';
import { Navbar } from '@/components/shared/Navbar';

export default function SchedulePage() {
  return (
    <>
      <Navbar />
      <ScheduleExperience />
      <Footer />
    </>
  );
}
