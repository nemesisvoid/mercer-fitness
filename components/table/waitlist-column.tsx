'use client'
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/Button"
import { EditIcon } from "lucide-react"



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
    header:'Status'
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