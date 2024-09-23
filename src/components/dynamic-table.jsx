'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function DynamicTable({ 
  data, 
  columns, 
  onSort, 
  sortColumn, 
  sortDirection, 
  itemsPerPage = 10,
  onItemsPerPageChange,
  renderActions
}) {
  const [currentPage, setCurrentPage] = useState(1)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const handleSort = (column) => {
    if (column.sortable) {
      onSort(column.key)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select value={itemsPerPage.toString()} onValueChange={(value) => onItemsPerPageChange(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Items por página" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 por página</SelectItem>
            <SelectItem value="20">20 por página</SelectItem>
            <SelectItem value="50">50 por página</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                <Button variant="ghost" onClick={() => handleSort(column)}>
                  {column.label}
                  {sortColumn === column.key && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
            ))}
            {renderActions && <TableHead>Acciones</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((item) => (
            <TableRow key={item.id || item[columns[0].key]}>
              {columns.map((column) => (
                <TableCell key={`${item.id || item[columns[0].key]}-${column.key}`}>
                  {column.render ? column.render(item) : item[column.key]}
                </TableCell>
              ))}
              {renderActions && (
                <TableCell>
                  {renderActions(item)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center space-x-2">
        {Array.from({ length: Math.ceil(data.length / itemsPerPage) }, (_, i) => (
          <Button
            key={i}
            variant={currentPage === i + 1 ? 'default' : 'outline'}
            onClick={() => paginate(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </div>
    </div>
  )
}