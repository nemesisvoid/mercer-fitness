import AdminHeader from "@/components/admin-header";

export const dynamic = "force-dynamic";

const AdminClassesPage = () => {
  return (
    <>
      <AdminHeader title="Classes" description="Manage your studio classes and schedules." />
      <div className="p-4 sm:p-6 lg:p-8">
        <div>AdminClassesPage</div>
      </div>
    </>
  )
}

export default AdminClassesPage