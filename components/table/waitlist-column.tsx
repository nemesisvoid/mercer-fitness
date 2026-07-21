'use client'
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/Button"
import { EditIcon } from "lucide-react"
import { Badge } from "../ui/Badge"



export type Waitlist = {
    name:string
    email:string
    class:string
    location:string
    status:string


}

export const columns:ColumnDef<Waitlist>[] = [
  {
    accessorKey:'name',
    header:'Name'
  },
  {
    accessorKey:'email',
    header:'Email'
  },
  {
    accessorKey:'class',
    header:'Class'
  },
  {
    accessorKey:'location',
    header:'Location'
  },
  {
    accessorKey:'status',
    header:'Status',
    cell: ({ row }) => {
      const waitlist = row.original;
      const variant = waitlist.status === 'CONFIRMED' ? 'emerald' : 
                      waitlist.status === 'WAITING' ? 'amber' : 
                      waitlist.status === 'OFFERED' ? 'sky' : 
                      waitlist.status === 'CANCELLED' ? 'red' : 'slate';
      return (
        <Badge variant={variant}>
          {waitlist.status}
        </Badge>
      )
    }
  },
  {
    header:'Actions',
    id:'actions',
    cell:({row}) => {
      const bookingData = row.original
      return (
        <Button
        variant='ghost'
        onClick={() => console.log(bookingData)}
        >
          <EditIcon className='h-4 w-4'/>
        </Button>
      )
    }
  }

]