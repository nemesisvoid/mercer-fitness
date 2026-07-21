'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/Button"
import { User } from "lucide-react"
import { Badge } from "../ui/Badge"

export type Bookings = {
    customer: string
    email: string
    className: string
    status: string
    createdAt?: Date
    classType?: string
}

export const columns: ColumnDef<Bookings>[] = [
  {
    accessorKey: 'customer',
    header: 'Customer',
    cell: ({ row }) => {
        const booking = row.original
        return (
            <span className='flex items-center gap-3'>
                <span className='flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white'>
                    <User className='h-4 w-4' />
                </span>
                <span className='font-heading text-sm font-semibold text-slate-950'>{booking.customer}</span>
            </span>
        )
    }
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <div className='text-sm text-slate-600'>{row.original.email}</div>
  },
  {
    accessorKey: 'className',
    header: 'Class',
    cell: ({ row }) => <div className='text-sm text-slate-600'>{row.original.className}</div>
  },
  {
    id: 'location',
    header: 'Location',
    cell: () => <div className='text-sm text-slate-600'>Mercer SoHo</div>
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
        const booking = row.original
        const variant = booking.status === 'CONFIRMED' ? 'emerald' : booking.status === 'CANCELLED' ? 'red' : 'slate';
        return (
            <Badge variant={variant}>
                {booking.status}
            </Badge>
        )
    }
  },
  {
    header: 'Actions',
    id: 'actions',
    cell: ({ row }) => {
      const bookingData = row.original
      return (
        <Button variant='ghost' className='px-3 py-2' onClick={() => console.log(bookingData)}>
            View
        </Button>
      )
    }
  }
]