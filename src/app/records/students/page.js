'use client'

import { useState, useEffect } from 'react'
import Dashboard from '@/components/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { getStudents, getPrograms } from '@/utils/api'

export default function Students() {
  const [students, setStudents] = useState([])
  const [programs, setPrograms] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [studentsPerPage, setStudentsPerPage] = useState(10)
  const [showSummary, setShowSummary] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [studentsData, programsData] = await Promise.all([getStudents(), getPrograms()])
        setStudents(studentsData)
        setFilteredStudents(studentsData)
        setPrograms(programsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase()
    setSearchTerm(term)
    const filtered = students.filter(student => 
      student.nombre1.toLowerCase().includes(term) ||
      student.apellido1.toLowerCase().includes(term) ||
      student.cedula_estudiantes.toLowerCase().includes(term)
    )
    setFilteredStudents(filtered)
    setCurrentPage(1)
  }

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }

    const sorted = [...filteredStudents].sort((a, b) => {
      if (a[column] < b[column]) return sortDirection === 'asc' ? -1 : 1
      if (a[column] > b[column]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
    setFilteredStudents(sorted)
  }

  const indexOfLastStudent = currentPage * studentsPerPage
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const totalStudents = students.length
  const programDistribution = programs.map(program => {
    const count = students.filter(student => student.programa_id === program.programa_id).length
    const percentage = (count / totalStudents * 100).toFixed(2)
    return { ...program, count, percentage }
  })

  return (
    <main>
      <Dashboard>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold text-foreground">Estudiantes</h1>
          <Button onClick={() => setShowSummary(!showSummary)}>
            {showSummary ? 'Ocultar Resumen' : 'Mostrar Resumen'}
          </Button>
        </div>

        {showSummary && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStudents}</div>
              </CardContent>
            </Card>
            {programDistribution.map(program => (
              <Card key={program.programa_id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{program.nombre_programa}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{program.percentage}%</div>
                  <p className="text-xs text-muted-foreground">{program.count} estudiantes</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <Input
            placeholder="Buscar estudiantes..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="flex justify-between items-center">
            <Select value={studentsPerPage.toString()} onValueChange={(value) => setStudentsPerPage(Number(value))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estudiantes por página" />
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
                <TableHead className="w-[100px]">
                  <Button variant="ghost" onClick={() => handleSort('cedula_estudiantes')}>
                    Cédula
                    {sortColumn === 'cedula_estudiantes' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('nombre1')}>
                    Nombre
                    {sortColumn === 'nombre1' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('apellido1')}>
                    Apellido
                    {sortColumn === 'apellido1' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>Programa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentStudents.map((student) => (
                <TableRow key={student.cedula_estudiantes}>
                  <TableCell className="font-medium">{student.cedula_estudiantes}</TableCell>
                  <TableCell>{student.nombre1}</TableCell>
                  <TableCell>{student.apellido1}</TableCell>
                  <TableCell>{programs.find(p => p.programa_id === student.programa_id)?.nombre_programa || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-center space-x-2">
            {Array.from({ length: Math.ceil(filteredStudents.length / studentsPerPage) }, (_, i) => (
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
      </Dashboard>
    </main>
  )
}