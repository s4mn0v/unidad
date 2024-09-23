'use client'

import { useState, useEffect, useCallback } from 'react'
import Dashboard from '@/components/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getInscriptions, getPrograms } from '@/utils/api'
import ActionButtons from '@/components/action-button'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import DynamicTable from '@/components/dynamic-table'
import ReloadButton from '@/components/reload-button'

const ITEM_TYPE = 'inscripcion'
const ID_FIELD = 'inscripcion_id'
const AUTO_REFRESH_INTERVAL = 60000 // 60 segundos

const SCHEMA = [
  { name: 'inscripcion_id', label: 'ID', type: 'text' },
  { name: 'cedula', label: 'Cédula', type: 'text' },
  { name: 'nombre', label: 'Nombre', type: 'text' },
  { name: 'date', label: 'Fecha de Inscripción', type: 'date' },
  { name: 'carrera', label: 'Carrera', type: 'select', options: [] },
  { name: 'jornada', label: 'Jornada', type: 'text' },
  { name: 'nacimiento', label: 'Fecha de Nacimiento', type: 'date' },
]

export default function Inscripciones() {
  const [inscriptions, setInscriptions] = useState([])
  const [programs, setPrograms] = useState([])
  const [filteredInscriptions, setFilteredInscriptions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')
  const [inscriptionsPerPage, setInscriptionsPerPage] = useState(10)
  const [showSummary, setShowSummary] = useState(true)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [inscriptionsData, programsData] = await Promise.all([getInscriptions(), getPrograms()])
      setInscriptions(inscriptionsData)
      setFilteredInscriptions(inscriptionsData)
      setPrograms(programsData)
      
      // Update SCHEMA with program options
      SCHEMA.find(field => field.name === 'carrera').options = programsData.map(program => ({
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
    const filtered = inscriptions.filter(inscription => 
      Object.values(inscription).some(value => 
        value && value.toString().toLowerCase().includes(term)
      )
    )
    setFilteredInscriptions(filtered)
  }

  const handleSort = (column) => {
    const newDirection = column === sortColumn && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortColumn(column)
    setSortDirection(newDirection)

    const sorted = [...filteredInscriptions].sort((a, b) => {
      if (a[column] < b[column]) return newDirection === 'asc' ? -1 : 1
      if (a[column] > b[column]) return newDirection === 'asc' ? 1 : -1
      return 0
    })
    setFilteredInscriptions(sorted)
  }

  const totalInscriptions = inscriptions.length
  const averageCareers = programs.length > 0 ? (totalInscriptions / programs.length).toFixed(2) : 0
  const averageAge = inscriptions.length > 0 ? 
    (inscriptions.reduce((sum, inscription) => {
      const birthDate = new Date(inscription.nacimiento)
      const ageDifMs = Date.now() - birthDate.getTime()
      const ageDate = new Date(ageDifMs)
      return sum + Math.abs(ageDate.getUTCFullYear() - 1970)
    }, 0) / inscriptions.length).toFixed(2) : 0

  const handleDelete = useCallback((inscriptionId) => {
    setInscriptions(prevInscriptions => prevInscriptions.filter(insc => insc[ID_FIELD] !== inscriptionId))
    setFilteredInscriptions(prevFiltered => prevFiltered.filter(insc => insc[ID_FIELD] !== inscriptionId))
    toast({
      title: 'Éxito',
      description: 'La inscripción ha sido eliminada correctamente.',
    })
  }, [toast])

  const handleUpdate = useCallback((updatedInscription) => {
    setInscriptions(prevInscriptions => 
      prevInscriptions.map(insc => 
        insc[ID_FIELD] === updatedInscription[ID_FIELD] ? updatedInscription : insc
      )
    )
    setFilteredInscriptions(prevFiltered => 
      prevFiltered.map(insc => 
        insc[ID_FIELD] === updatedInscription[ID_FIELD] ? updatedInscription : insc
      )
    )
    toast({
      title: 'Éxito',
      description: 'Los datos de la inscripción han sido actualizados correctamente.',
    })
  }, [toast])

  const columns = SCHEMA.map(field => ({
    key: field.name,
    label: field.label,
    sortable: true,
    render: field.name === 'carrera' 
      ? (item) => programs.find(p => p.programa_id === item.carrera)?.nombre_programa || 'N/A'
      : field.name === 'date' || field.name === 'nacimiento'
      ? (item) => new Date(item[field.name]).toLocaleDateString()
      : undefined
  }))

  const renderActions = useCallback((inscription) => (
    <ActionButtons
      item={inscription}
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
          <h1 className="text-3xl font-semibold text-foreground">Inscripciones</h1>
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
                <CardTitle className="text-sm font-medium">Total Inscripciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalInscriptions}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Promedio por Carrera</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageCareers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Promedio de Edades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageAge}</div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="space-y-4">
          <Input
            placeholder="Buscar inscripciones..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <DynamicTable
            data={filteredInscriptions}
            columns={columns}
            onSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            itemsPerPage={inscriptionsPerPage}
            onItemsPerPageChange={setInscriptionsPerPage}
            renderActions={renderActions}
          />
        </div>
      </Dashboard>
      <Toaster />
    </main>
  )
}