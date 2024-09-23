'use client'

import { useState, useEffect, useCallback } from 'react'
import Dashboard from '@/components/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getEstudiantesActivos } from '@/utils/api'
import DynamicTable from '@/components/dynamic-table'
import ActionButtons from '@/components/action-button'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import ReloadButton from '@/components/reload-button'

const ITEM_TYPE = 'estudiante_activo'
const ID_FIELD = 'cedula_estudiantes_activos'
const AUTO_REFRESH_INTERVAL = 60000 // 60 seconds

const SCHEMA = [
  { name: 'cedula_estudiantes_activos', label: 'Cédula', type: 'text' },
  { name: 'apellido1', label: 'P. Apellido', type: 'text' },
  { name: 'apellido2', label: 'S. Ape', type: 'text' },
  { name: 'nombre1', label: 'P. Nombre', type: 'text' },
  { name: 'nombre2', label: 'S. Nom', type: 'text' },
  { name: 'telefono', label: 'Teléfono', type: 'text' },
  { name: 'estado_u', label: 'Estado', type: 'text' },
  { name: 'jornada', label: 'Jornada', type: 'text' },
  { name: 'sheetname', label: 'Programa', type: 'text' },
  { name: 'filename', label: 'Archivo', type: 'text' },
]

export default function EstudiantesActivos() {
  const [estudiantesActivos, setEstudiantesActivos] = useState([])
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
      const data = await getEstudiantesActivos()
      setEstudiantesActivos(data)
      setFilteredEstudiantes(data)
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
    const filtered = estudiantesActivos.filter(estudiante => 
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
    setEstudiantesActivos(prevEstudiantes => prevEstudiantes.filter(est => est[ID_FIELD] !== estudianteId))
    setFilteredEstudiantes(prevFiltered => prevFiltered.filter(est => est[ID_FIELD] !== estudianteId))
    toast({
      title: 'Éxito',
      description: 'El estudiante activo ha sido eliminado correctamente.',
    })
  }, [toast])

  const handleUpdate = useCallback((updatedEstudiante) => {
    setEstudiantesActivos(prevEstudiantes => 
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
      description: 'Los datos del estudiante activo han sido actualizados correctamente.',
    })
  }, [toast])

  const columns = SCHEMA.map(field => ({
    key: field.name,
    label: field.label,
    sortable: true,
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

  const totalEstudiantes = estudiantesActivos.length
  const estadosDistribution = estudiantesActivos.reduce((acc, est) => {
    acc[est.estado_u] = (acc[est.estado_u] || 0) + 1
    return acc
  }, {})

  return (
    <main>
      <Dashboard>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold text-foreground">Estudiantes Activos</h1>
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
                <CardTitle className="text-sm font-medium">Total Estudiantes Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEstudiantes}</div>
              </CardContent>
            </Card>
            {Object.entries(estadosDistribution).map(([estado, count]) => (
              <Card key={estado}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Estado: {estado}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{count}</div>
                  <p className="text-xs text-muted-foreground">
                    {((count / totalEstudiantes) * 100).toFixed(2)}% del total
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <Input
            placeholder="Buscar estudiantes activos..."
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