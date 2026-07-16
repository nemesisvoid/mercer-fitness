import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface AdminHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

const AdminHeader = ({ title, description, children }: AdminHeaderProps) => {
  return (
    <header className='sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/85 p-4 backdrop-blur-xl sm:px-6 lg:px-8'>
      <div className='flex items-center gap-4'>
        <SidebarTrigger />
        <div>
          <h1 className='font-heading text-xl font-bold text-slate-950'>{title}</h1>
          {description && <p className='text-sm text-slate-500'>{description}</p>}
        </div>
      </div>
      <div className='flex items-center gap-4'>
        {children}
      </div>
    </header>
  );
};

export default AdminHeader;