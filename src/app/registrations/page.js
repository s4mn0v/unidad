'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Dashboard from '@/components/dashboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { createInscription, getPrograms, getStudents } from '@/utils/api'

export default function InscripcionesPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [programs, setPrograms] = useState([])
  const [students, setStudents] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
      try {
        const [programsData, studentsData] = await Promise.all([
          getPrograms(),
          getStudents()
        ])
        setPrograms(programsData)
        setStudents(studentsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  async function onSubmitInscription(event) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const inscriptionData = Object.fromEntries(formData)

    try {
      await createInscription(inscriptionData)
      toast({
        title: 'Éxito',
        description: 'La inscripción ha sido registrada correctamente.',
      })
      router.push('/registrations')
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'Hubo un problema al registrar la inscripción. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dashboard>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold mb-4 text-foreground">Formulario de Inscripción</h1>
        <form onSubmit={onSubmitInscription} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="cedula_inscripciones">Cédula del Estudiante</Label>
            <Select name="cedula_inscripciones" required>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione el estudiante" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.cedula_estudiantes} value={student.cedula_estudiantes}>
                    {`${student.nombre1} ${student.apellido1} - ${student.cedula_estudiantes}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="programa_id">Programa</Label>
            <Select name="programa_id" required>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione el programa" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((program) => (
                  <SelectItem key={program.programa_id} value={program.programa_id.toString()}>
                    {program.nombre_programa}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fecha_inscripcion">Fecha de Inscripción</Label>
            <Input id="fecha_inscripcion" name="fecha_inscripcion" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jornada">Jornada</Label>
            <Select name="jornada" required>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione la jornada" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diurna">Diurna</SelectItem>
                <SelectItem value="nocturna">Nocturna</SelectItem>
                <SelectItem value="fines_de_semana">Fines de Semana</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
                        Registrar Inscripción
          </Button>
        </form>
      </div>
      <Toaster />
    </Dashboard>
  )
}