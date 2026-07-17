import { getAllLocations } from "@/actions/location.action";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import AdminHeader from "@/components/admin-header";
import { getAllClasses } from "@/actions/class-action";
import { getLoggedInUser } from "@/utils/get-user";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user =  await getLoggedInUser();

  if(!user) return redirect('/');
  
    const [classes,locations] = await Promise.all([getAllClasses(),getAllLocations()]);

    const classData = classes.data.map((cls) => ({
      id: cls.id,
      name: cls.name,
      type: cls.type,
      instructor: cls.instructor,
      description: cls.description,
      image: cls.image,
      capacity: cls.capacity,
      status: cls.status,
      locationId: cls.locationId,
      startsAt: cls.startsAt,
    }));


  return (
    <>
      <AdminHeader title="Dashboard overview" description="Today across all Mercer studios" />
      <DashboardShell userId={user.session.userId} classes={classData} locations={locations} />
    </>
  );
}
