'use client'

import { useState, useEffect, useCallback } from 'react'
import Dashboard from '@/components/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getStudents, getPrograms } from '@/utils/api'
import DynamicTable from '@/components/dynamic-table'
import ActionButtons from '@/components/action-button'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import ReloadButton from '@/components/reload-button'

const ITEM_TYPE = 'estudiante'
const ID_FIELD = 'cedula_estudiantes'
const AUTO_REFRESH_INTERVAL = 60000 // 60 seconds

const SCHEMA = [
  { name: 'cedula_estudiantes', label: 'Cédula', type: 'text' },
  { name: 'tipo_documento', label: 'T.D.', type: 'text' },
  { name: 'apellido1', label: 'P. Apellido', type: 'text' },
  { name: 'apellido2', label: 'S. Apellido', type: 'text' },
  { name: 'nombre1', label: 'P. Nombre', type: 'text' },
  { name: 'nombre2', label: 'S. Nombre', type: 'text' },
  { name: 'telefono', label: 'Teléfono', type: 'text' },
  { name: 'direccion', label: 'Dirección', type: 'text' },
  { name: 'correo', label: 'Correo', type: 'email' },
  { name: 'programa_id', label: 'Programa', type: 'select', options: [] },
]

export default function Students() {
  const [students, setStudents] = useState([])
  const [programs, setPrograms] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')
  const [studentsPerPage, setStudentsPerPage] = useState(10)
  const [showSummary, setShowSummary] = useState(true)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [studentsData, programsData] = await Promise.all([getStudents(), getPrograms()])
      setStudents(studentsData)
      setFilteredStudents(studentsData)
      setPrograms(programsData)
      
      // Update SCHEMA with program options
      SCHEMA.find(field => field.name === 'programa_id').options = programsData.map(program => ({
        value: program.programa_id,
        label: program.nombre_programa
      }))
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: 'Error',
        description: 'Hubo un problema al cargar los datos. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchData()
    const intervalId = setInterval(fetchData, AUTO_REFRESH_INTERVAL)
    return () => clearInterval(intervalId)
  }, [fetchData])

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase()
    setSearchTerm(term)
    const filtered = students.filter(student => 
      Object.values(student).some(value => 
        value && value.toString().toLowerCase().includes(term)
      )
    )
    setFilteredStudents(filtered)
  }

  const handleSort = (column) => {
    const newDirection = column === sortColumn && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortColumn(column)
    setSortDirection(newDirection)

    const sorted = [...filteredStudents].sort((a, b) => {
      if (a[column] < b[column]) return newDirection === 'asc' ? -1 : 1
      if (a[column] > b[column]) return newDirection === 'asc' ? 1 : -1
      return 0
    })
    setFilteredStudents(sorted)
  }

  const handleDelete = useCallback((studentId) => {
    setStudents(prevStudents => prevStudents.filter(student => student[ID_FIELD] !== studentId))
    setFilteredStudents(prevFiltered => prevFiltered.filter(student => student[ID_FIELD] !== studentId))
    toast({
      title: 'Éxito',
      description: 'El estudiante ha sido eliminado correctamente.',
    })
  }, [toast])

  const handleUpdate = useCallback((updatedStudent) => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student[ID_FIELD] === updatedStudent[ID_FIELD] ? updatedStudent : student
      )
    )
    setFilteredStudents(prevFiltered => 
      prevFiltered.map(student => 
        student[ID_FIELD] === updatedStudent[ID_FIELD] ? updatedStudent : student
      )
    )
    toast({
      title: 'Éxito',
      description: 'Los datos del estudiante han sido actualizados correctamente.',
    })
  }, [toast])

  const columns = SCHEMA.map(field => ({
    key: field.name,
    label: field.label,
    sortable: true,
    render: field.name === 'programa_id' 
      ? (item) => programs.find(p => p.programa_id === item.programa_id)?.nombre_programa || 'N/A'
      : undefined
  }))

  const renderActions = useCallback((student) => (
    <ActionButtons
      item={student}
      onDelete={handleDelete}
      onUpdate={handleUpdate}
      itemType={ITEM_TYPE}
      schema={SCHEMA}
      idField={ID_FIELD}
    />
  ), [handleDelete, handleUpdate])

  return (
    <main>
      <Dashboard>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold text-foreground">Estudiantes</h1>
          <div className="flex space-x-2">
            <ReloadButton onClick={fetchData} loading={loading} />
            <Button onClick={() => setShowSummary(!showSummary)}>
              {showSummary ? 'Ocultar Resumen' : 'Mostrar Resumen'}
            </Button>
          </div>
        </div>

        {showSummary && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{students.length}</div>
              </CardContent>
            </Card>
            {programs.map(program => {
              const count = students.filter(student => student.programa_id === program.programa_id).length
              const percentage = (count / students.length * 100).toFixed(2)
              return (
                <Card key={program.programa_id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{program.nombre_programa}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{percentage}%</div>
                    <p className="text-xs text-muted-foreground">{count} estudiantes</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        <div className="space-y-4">
          <Input
            placeholder="Buscar estudiantes..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <DynamicTable
            data={filteredStudents}
            columns={columns}
            onSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            itemsPerPage={studentsPerPage}
            onItemsPerPageChange={setStudentsPerPage}
            renderActions={renderActions}
          />
        </div>
      </Dashboard>
      <Toaster />
    </main>
  )
}