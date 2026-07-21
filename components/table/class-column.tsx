'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Edit, Eye, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import { CapacityBadge } from '../ui/CapacityBadge'
import { Badge } from '../ui/Badge'
import { format, isToday, isTomorrow, isPast, formatDistanceToNow } from 'date-fns'

export type Classes = {
    id: string
    name: string
    instructor: string
    location: string
    capacity: number
    remaining: number
    status?: string
    type?: string
    description?: string
    locationId?: string
    startsAt?: Date
    endsAt?: Date
    image?: string
}

/** Call this to get columns with edit/delete callbacks wired in. */
export function createColumns({
    onEdit,
    onDelete,
}: {
    onEdit: (row: Classes) => void
    onDelete: (row: Classes) => void
}): ColumnDef<Classes>[] {
    return [
        {
            accessorKey: 'name',
            header: 'Class',
            cell: ({ row }) => (
                <Link
                    href={`/classes/${row.original.id}`}
                    className='font-heading text-sm font-semibold text-slate-950 hover:text-emerald-600 transition-colors'
                >
                    {row.original.name}
                </Link>
            ),
        },
        {
            accessorKey: 'instructor',
            header: 'Instructor',
            cell: ({ row }) => (
                <div className='text-sm text-slate-600'>{row.original.instructor}</div>
            ),
        },
        {
            accessorKey: 'startsAt',
            header: 'Schedule',
            cell: ({ row }) => {
                const startsAt = row.original.startsAt ? new Date(row.original.startsAt) : null;
                if (!startsAt) return <div className='text-sm text-slate-600'>—</div>;
                
                const formatted = isPast(startsAt)
                    ? formatDistanceToNow(startsAt, { addSuffix: true })
                    : isToday(startsAt)
                    ? `Today, ${format(startsAt, "h:mm a")}`
                    : isTomorrow(startsAt)
                    ? `Tomorrow, ${format(startsAt, "h:mm a")}`
                    : format(startsAt, "MMM d, h:mm a");
                
                return <div className='text-sm text-slate-600'>{formatted}</div>;
            },
        },
        {
            accessorKey: 'location',
            header: 'Location',
            cell: ({ row }) => (
                <div className='text-sm text-slate-600'>{row.original.location}</div>
            ),
        },
        {
            accessorKey: 'capacity',
            header: 'Capacity',
            cell: ({ row }) => {
                const item = row.original
                return (
                    <div className='w-36'>
                        <CapacityBadge remaining={item.remaining} capacity={item.capacity} />
                    </div>
                )
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const item = row.original
                if (item.status === 'CANCELLED') return <Badge variant="red">Cancelled</Badge>;
                if (item.status === 'COMPLETED') return <Badge variant="slate">Completed</Badge>;
                
                return (
                    <Badge variant={item.remaining === 0 ? 'amber' : 'emerald'}>
                        {item.remaining === 0 ? 'Waitlist' : 'Active'}
                    </Badge>
                )
            },
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => {
                const classData = row.original
                return (
                    <div className='flex gap-2 text-slate-500'>
                    <Link
                        href={`/classes/${classData.id}`}
                        className='rounded-lg p-2 hover:bg-emerald-50 hover:text-emerald-600 transition-colors'
                        aria-label='View details'
                    >
                        <Eye className='h-4 w-4' />
                    </Link>
                    <button
                        className='rounded-lg p-2 hover:bg-slate-100 hover:text-slate-800 transition-colors'
                        aria-label='Edit'
                        onClick={() => onEdit(classData)}
                    >
                        <Edit className='h-4 w-4' />
                    </button>
                    <button
                        className='rounded-lg p-2 hover:bg-red-50 hover:text-red-500 transition-colors'
                        aria-label='Delete'
                        onClick={() => onDelete(classData)}
                    >
                        <TrashIcon className='h-4 w-4' />
                    </button>
                </div>
                )
            },
        },
    ]
}
