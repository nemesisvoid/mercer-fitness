import { ClockIcon, DumbbellIcon, HomeIcon, LayoutDashboard, TicketIcon } from "lucide-react";

export const adminSidebarLinks = [
    {
        title:'Overview',
        href:'/dashboard',
        icon: LayoutDashboard
    },
    {
        title:'Classes',
        href:'/classes',
        icon: DumbbellIcon
    },
    {
        title:'Bookings',
        href:'/bookings',
        icon: TicketIcon
    },
    
    {
        title:'Waitlist',
        href:'/waitlist',
        icon:ClockIcon
    }
    
]