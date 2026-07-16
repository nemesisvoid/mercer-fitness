// import { AdminNavbar } from "@/components/navbar/AdminNavbar";
import AdminSidebar from '@/components/admin-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

const AdminLayout = ({children}:{
    children:React.ReactNode
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">

        <SidebarProvider>
            <AdminSidebar/>
            <main className="w-full flex-1 flex flex-col">
              {children}
            </main>
        </SidebarProvider>
    </div>
  )
}

export default AdminLayout