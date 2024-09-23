'use client'

import { useState, useEffect, useCallback } from 'react'
import Dashboard from '@/components/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getEstudiantesMoodle, getPrograms } from '@/utils/api'
import DynamicTable from '@/components/dynamic-table'
import ActionButtons from '@/components/action-button'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import ReloadButton from '@/components/reload-button'

const ITEM_TYPE = 'estudiante_moodle'
const ID_FIELD = 'cedula_estudiantes_moodle'
const AUTO_REFRESH_INTERVAL = 60000 // 60 seconds

const SCHEMA = [
  { name: 'cedula_estudiantes_moodle', label: 'Cédula', type: 'text' },
  { name: 'programa_id', label: 'Programa', type: 'select', options: [] },
]

export default function EstudiantesMoodle() {
  const [estudiantesMoodle, setEstudiantesMoodle] = useState([])
  const [programs, setPrograms] = useState([])
  const [filteredEstudiantes, setFilteredEstudiantes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')
  const [estudiantesPerPage, setEstudiantesPerPage] = useState(10)
  const [showSummary, setShowSummary] = useState(true)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [estudiantesData, programsData] = await Promise.all([getEstudiantesMoodle(), getPrograms()])
      setEstudiantesMoodle(estudiantesData)
      setFilteredEstudiantes(estudiantesData)
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
    const filtered = estudiantesMoodle.filter(estudiante => 
      Object.values(estudiante).some(value => 
        value && value.toString().toLowerCase().includes(term)
      )
    )
    setFilteredEstudiantes(filtered)
  }

  const handleSort = (column) => {
    const newDirection = column === sortColumn && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortColumn(column)
    setSortDirection(newDirection)

    const sorted = [...filteredEstudiantes].sort((a, b) => {
      if (a[column] < b[column]) return newDirection === 'asc' ? -1 : 1
      if (a[column] > b[column]) return newDirection === 'asc' ? 1 : -1
      return 0
    })
    setFilteredEstudiantes(sorted)
  }

  const handleDelete = useCallback((estudianteId) => {
    setEstudiantesMoodle(prevEstudiantes => prevEstudiantes.filter(est => est[ID_FIELD] !== estudianteId))
    setFilteredEstudiantes(prevFiltered => prevFiltered.filter(est => est[ID_FIELD] !== estudianteId))
    toast({
      title: 'Éxito',
      description: 'El estudiante Moodle ha sido eliminado correctamente.',
    })
  }, [toast])

  const handleUpdate = useCallback((updatedEstudiante) => {
    setEstudiantesMoodle(prevEstudiantes => 
      prevEstudiantes.map(est => 
        est[ID_FIELD] === updatedEstudiante[ID_FIELD] ? updatedEstudiante : est
      )
    )
    setFilteredEstudiantes(prevFiltered => 
      prevFiltered.map(est => 
        est[ID_FIELD] === updatedEstudiante[ID_FIELD] ? updatedEstudiante : est
      )
    )
    toast({
      title: 'Éxito',
      description: 'Los datos del estudiante Moodle han sido actualizados correctamente.',
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

  const renderActions = useCallback((estudiante) => (
    <ActionButtons
      item={estudiante}
      onDelete={handleDelete}
      onUpdate={handleUpdate}
      itemType={ITEM_TYPE}
      schema={SCHEMA}
      idField={ID_FIELD}
    />
  ), [handleDelete, handleUpdate])

  const totalEstudiantes = estudiantesMoodle.length
  const programDistribution = programs.map(program => {
    const count = estudiantesMoodle.filter(est => est.programa_id === program.programa_id).length
    return {
      ...program,
      count,
      percentage: ((count / totalEstudiantes) * 100).toFixed(2)
    }
  })

  const averageProgramPercentage = programDistribution.length > 0
    ? (programDistribution.reduce((sum, program) => sum + parseFloat(program.percentage), 0) / programDistribution.length).toFixed(2)
    : 0

  return (
    <main>
      <Dashboard>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold text-foreground">Estudiantes Moodle</h1>
          <div className="flex space-x-2">
            <ReloadButton onClick={fetchData} loading={loading} />
            <Button onClick={() => setShowSummary(!showSummary)}>
              {showSummary ? 'Ocultar Resumen' : 'Mostrar Resumen'}
            </Button>
          </div>
        </div>

        {showSummary && (
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Estudiantes Moodle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEstudiantes}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Promedio de Estudiantes por Programa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageProgramPercentage}%</div>
                <p className="text-xs text-muted-foreground">
                  Basado en {programs.length} programas
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="space-y-4">
          <Input
            placeholder="Buscar estudiantes Moodle..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <DynamicTable
            data={filteredEstudiantes}
            columns={columns}
            onSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            itemsPerPage={estudiantesPerPage}
            onItemsPerPageChange={setEstudiantesPerPage}
            renderActions={renderActions}
          />
        </div>
      </Dashboard>
      <Toaster />
    </main>
  )
}