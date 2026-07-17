'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  BarChart3,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Edit,
  Eye,
  Filter,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sparkles,
  User,
  Users,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { bookings, classes } from '@/lib/data';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CapacityBadge } from '@/components/ui/CapacityBadge';
import { ClassFormSheet } from '@/components/dashboard/ClassFormSheet';
import { DataTable } from '@/components/table/DataTable';
import { createColumns, type Classes } from '@/components/table/class-column';
import { columns as bookingColumns } from '@/components/table/booking-column';
import { createClass } from '@/actions/class-action';

const nav = [
  { icon: LayoutDashboard, label: 'Overview', active: true },
  { icon: Calendar, label: 'Manage Classes' },
  { icon: Users, label: 'Bookings' },
  { icon: Clock, label: 'Waitlist' },
  { icon: Settings, label: 'Settings' },
];

export function DashboardShell({ userId, locations,classData }: { userId:string, locations: Location[],classData: Classes[] }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Classes | null>(null);



  return (
    <div className='flex-1 w-full'>
      <div className='px-4 py-8 sm:px-6 lg:px-8'>
        <DashboardOverview />
        <div className='mt-8 grid gap-6 xl:grid-cols-[1fr_380px]'>
          <ManageClasses
            onCreate={() => setIsCreateOpen(true)}
            onEdit={(cls) => setEditingClass(cls)}
          />
          <RightRail />
        </div>
        <BookingManagement />
        <WaitlistManagement />
      </div>

      {/* Create sheet */}
      <ClassFormSheet
        locations={locations}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={async(values) => {
          const res = await createClass(userId, values)
          console.log('New class:', values);
          return res;
        }}
      />

      {/* Edit sheet — opens when a row's Edit button is clicked.
          The `key` forces a full remount whenever a different class is selected,
          so react-hook-form always re-initialises with the correct defaultValues. */}
      <ClassFormSheet
        key={editingClass?.title ?? '__edit__'}
        locations={locations}
        open={Boolean(editingClass)}
        onOpenChange={(open) => { if (!open) setEditingClass(null); }}
        defaultValues={editingClass ? {
          name: editingClass.title,
          instructor: editingClass.instructor,
          capacity: editingClass.capacity,
        } : undefined}
        onSubmit={(values) => {
          console.log('Updated class:', values);
          setEditingClass(null);
        }}
      />
    </div>
  );
}

function DashboardOverview() {
  const cards = [
    { icon: Calendar, label: 'Upcoming classes', value: '42', badge: '+8%' },
    { icon: CheckCircle2, label: "Today's bookings", value: '318', badge: '+14%' },
    { icon: Clock, label: 'Waitlist count', value: '27', badge: 'Live' },
    { icon: XCircle, label: 'Cancelled classes', value: '2', badge: 'Low' },
  ];

  return (
    <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}>
            <Card className='p-5'>
              <div className='flex items-center justify-between'>
                <span className='flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700'>
                  <Icon className='h-6 w-6' />
                </span>
                <Badge variant={index === 2 ? 'amber' : 'emerald'}>{card.badge}</Badge>
              </div>
              <p className='mt-5 font-heading text-3xl font-bold text-slate-950'>{card.value}</p>
              <p className='mt-1 text-sm text-slate-500'>{card.label}</p>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

function ManageClasses({
  onCreate,
  onEdit,
}: {
  onCreate: () => void;
  onEdit: (cls: Classes) => void;
}) {
  const columns = createColumns({ onEdit });

  return (
    <Card className='overflow-hidden'>
      <div className='flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='font-heading text-xl font-semibold text-slate-950'>Manage classes</h2>
          <p className='mt-1 text-sm text-slate-500'>Search, duplicate, edit, cancel, or inspect capacity.</p>
        </div>
        <div className='flex gap-2'>
          <Button variant='secondary'>
            <Filter className='h-4 w-4' /> Filter
          </Button>
          <Button onClick={onCreate}>
            <Plus className='h-4 w-4' /> Create Class
          </Button>
        </div>
      </div>
      <div className='p-5'>
        <DataTable columns={columns} data={classes as any} />
      </div>
    </Card>
  );
}

function RightRail() {
  return (
    <div className='space-y-6'>
      <Card className='p-5'>
        <div className='flex items-center justify-between'>
          <h2 className='font-heading text-xl font-semibold text-slate-950'>Mini analytics</h2>
          <BarChart3 className='h-5 w-5 text-slate-400' />
        </div>
        <div className='mt-6 flex h-48 items-end gap-3'>
          {[42, 68, 52, 84, 73, 96, 88].map((height, index) => (
            <motion.div
              key={height}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: index * 0.06, duration: 0.55 }}
              className='flex-1 rounded-t-xl bg-gradient-to-t from-emerald-600 to-sky-400'
            />
          ))}
        </div>
        <p className='mt-4 text-sm text-slate-500'>Booking conversion by day, placeholder data.</p>
      </Card>
   
    </div>
  );
}

function BookingManagement() {
  return (
    <Card className='mt-8 overflow-hidden'>
      <div className='border-b border-slate-200 p-5'>
        <h2 className='font-heading text-xl font-semibold text-slate-950'>Booking management</h2>
      </div>
      <div className='p-5'>
        <DataTable columns={bookingColumns} data={bookings} />
      </div>
    </Card>
  );
}

function WaitlistManagement() {
  return (
    <Card className='mt-8 p-5'>
      <div className='grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center'>
        <div>
          <h2 className='font-heading text-xl font-semibold text-slate-950'>Waitlist management</h2>
          <p className='mt-1 text-sm text-slate-500'>Promote, remove, or resend 30-minute confirmation offers.</p>
        </div>
        <div className='flex gap-3'>
          <Button variant='secondary'>Resend Email</Button>
          <Button>Promote Next</Button>
        </div>
      </div>
      <div className='mt-5 grid gap-3 md:grid-cols-3'>
        {['Position #1 · HIIT Circuit', 'Offer expires in 18m', '3 members waiting'].map(item => (
          <div
            key={item}
            className='rounded-2xl bg-slate-50 p-4 font-heading text-sm font-medium text-slate-700'>
            {item}
          </div>
        ))}
      </div>
    </Card>
  );
}
