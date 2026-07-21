import AdminHeader from "@/components/admin-header";

export const dynamic = "force-dynamic";

const AdminWaitlistPage = () => {
  return (
    <>
      <AdminHeader title="Waitlist" description="Manage class waitlists and notify members." />
      <div className="p-4 sm:p-6 lg:p-8">
        <div>AdminWaitlistPage</div>
      </div>
    </>
  )
}

export default AdminWaitlistPage