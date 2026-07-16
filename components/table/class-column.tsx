'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Edit, TrashIcon } from 'lucide-react'
import { CapacityBadge } from '../ui/CapacityBadge'
import { Badge } from '../ui/Badge'

export type Classes = {
    title: string
    instructor: string
    location: string
    capacity: number
    remaining: number
    status?: string
}

/** Call this to get columns with edit/delete callbacks wired in. */
export function createColumns({
    onEdit,
}: {
    onEdit: (row: Classes) => void
}): ColumnDef<Classes>[] {
    return [
        {
            accessorKey: 'title',
            header: 'Class',
            cell: ({ row }) => (
                <div className='font-heading text-sm font-semibold text-slate-950'>
                    {row.original.title}
                </div>
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
                        >
                            <TrashIcon className='h-4 w-4' />
                        </button>
                    </div>
                )
            },
        },
    ]
}
