import type { ReactNode } from "react"

import { Button } from "@workspace/ui/atoms/button"
import { Skeleton } from "@workspace/ui/atoms/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/atoms/table"

export type DataTableColumn<T> = {
  key: string
  header: string
  cell: (row: T) => ReactNode
  className?: string
}

type DataTableProps<T> = {
  columns: DataTableColumn<T>[]
  data: T[]
  isLoading?: boolean
  emptyMessage?: string
  getRowKey: (row: T) => string
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  emptyMessage = "Nenhum registo encontrado.",
  getRowKey,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <p className="text-muted-foreground rounded-2xl border border-dashed p-8 text-center text-sm">
        {emptyMessage}
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.key} className={col.className}>
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={getRowKey(row)}>
            {columns.map((col) => (
              <TableCell key={col.key} className={col.className}>
                {col.cell(row)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

type PaginationProps = {
  page: number
  perPage: number
  total: number
  onPageChange: (page: number) => void
}

export function DataTablePagination({
  page,
  perPage,
  total,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / perPage))

  return (
    <div className="mt-4 flex items-center justify-between gap-4">
      <p className="text-muted-foreground text-sm">
        {total} registo{total !== 1 ? "s" : ""} · página {page} de {totalPages}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Seguinte
        </Button>
      </div>
    </div>
  )
}
