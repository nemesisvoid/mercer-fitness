'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageSize?: number
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 5,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize },
    },
  })

  const { pageIndex, pageSize: currentPageSize } = table.getState().pagination
  const totalRows = data.length
  const from = pageIndex * currentPageSize + 1
  const to = Math.min((pageIndex + 1) * currentPageSize, totalRows)

  return (
    <div className='flex flex-col gap-0'>
      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse text-sm'>
          {/* Header */}
          <thead>
            <tr className='border-b border-slate-200 bg-slate-50/70'>
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className='px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-slate-400 whitespace-nowrap'
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody className='divide-y divide-slate-100'>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='group transition-colors duration-100 hover:bg-slate-50/80 data-[state=selected]:bg-emerald-50/40'
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className='px-5 py-3.5 align-middle text-sm text-slate-700'
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className='py-16 text-center'
                >
                  <div className='flex flex-col items-center gap-2'>
                    <span className='flex h-10 w-10 items-center justify-center rounded-full bg-slate-100'>
                      <svg className='h-5 w-5 text-slate-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' />
                      </svg>
                    </span>
                    <p className='text-sm font-medium text-slate-500'>No results found</p>
                    <p className='text-xs text-slate-400'>Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-5 py-3'>
        <div className='flex items-center gap-4'>
          <p className='text-xs text-slate-400'>
            {totalRows > 0 ? (
              <>
                Showing <span className='font-semibold text-slate-600'>{from}–{to}</span> of{' '}
                <span className='font-semibold text-slate-600'>{totalRows}</span> rows
              </>
            ) : (
              'No data'
            )}
          </p>
          <div className='flex items-center gap-2'>
            <span className='text-xs text-slate-400'>Rows per page</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
              className='h-7 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Controls */}
        <div className='flex items-center gap-1'>
          {/* First page */}
          <PaginationButton
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label='First page'
          >
            <ChevronsLeft className='h-3.5 w-3.5' />
          </PaginationButton>

          {/* Previous */}
          <PaginationButton
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label='Previous page'
          >
            <ChevronLeft className='h-3.5 w-3.5' />
          </PaginationButton>

          {/* Page numbers */}
          <div className='flex items-center gap-0.5 px-1'>
            {Array.from({ length: table.getPageCount() }, (_, i) => i).map((page) => (
              <button
                key={page}
                onClick={() => table.setPageIndex(page)}
                className={`flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-xs font-medium transition-all duration-150 ${
                  pageIndex === page
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                {page + 1}
              </button>
            ))}
          </div>

          {/* Next */}
          <PaginationButton
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label='Next page'
          >
            <ChevronRight className='h-3.5 w-3.5' />
          </PaginationButton>

          {/* Last page */}
          <PaginationButton
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            aria-label='Last page'
          >
            <ChevronsRight className='h-3.5 w-3.5' />
          </PaginationButton>
        </div>
      </div>
    </div>
  )
}

function PaginationButton({
  children,
  disabled,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className='flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-all duration-150 hover:bg-slate-100 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-30'
      {...props}
    >
      {children}
    </button>
  )
}