import { getAllLocations } from "@/actions/location.action";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default async function DashboardPage() {
    const locations = await getAllLocations();
  return <DashboardShell locations={locations} />;
}
