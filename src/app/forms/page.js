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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createStudent, getPrograms, createProgram, createAgent, getAgents, createInscription, getStudents } from '@/utils/api'

export default function FormsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [programs, setPrograms] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [agents, setAgents] = useState([])
  const [students, setStudents] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
      try {
        const [programsData, agentsData, studentsData] = await Promise.all([
          getPrograms(),
          getAgents(),
          getStudents()
        ])
        setPrograms(programsData)
        setAgents(agentsData)
        setStudents(studentsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  async function onSubmitStudent(event) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const studentData = Object.fromEntries(formData)

    try {
      await createStudent(studentData)
      toast({
        title: 'Éxito',
        description: 'El estudiante ha sido registrado correctamente.',
      })
      router.push('/forms')
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'Hubo un problema al registrar el estudiante. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmitProgram(event) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const programData = Object.fromEntries(formData)

    try {
      await createProgram(programData)
      toast({
        title: 'Éxito',
        description: 'El programa ha sido registrado correctamente.',
      })
      const updatedPrograms = await getPrograms()
      setPrograms(updatedPrograms)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'Hubo un problema al registrar el programa. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmitAgent(event) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const agentData = Object.fromEntries(formData)

    try {
      await createAgent(agentData)
      toast({
        title: 'Éxito',
        description: 'El agente ha sido registrado correctamente.',
      })
      const updatedAgents = await getAgents()
      setAgents(updatedAgents)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'Hubo un problema al registrar el agente. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

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
        <h1 className="text-3xl font-semibold mb-4 text-foreground">Formularios de Registro</h1>
        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="student">Estudiante</TabsTrigger>
            <TabsTrigger value="program">Programa</TabsTrigger>
            <TabsTrigger value="agent">Agente</TabsTrigger>
            <TabsTrigger value="inscription">Inscripción</TabsTrigger>
          </TabsList>
          <TabsContent value="student">
            <form onSubmit={onSubmitStudent} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="cedula_estudiantes">Cédula</Label>
                <Input id="cedula_estudiantes" name="cedula_estudiantes" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo_documento">Tipo de Documento</Label>
                <Select name="tipo_documento">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cedula">Cédula</SelectItem>
                    <SelectItem value="pasaporte">Pasaporte</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido1">Primer Apellido</Label>
                <Input id="apellido1" name="apellido1" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido2">Segundo Apellido</Label>
                <Input id="apellido2" name="apellido2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombre1">Primer Nombre</Label>
                <Input id="nombre1" name="nombre1" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombre2">Segundo Nombre</Label>
                <Input id="nombre2" name="nombre2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" name="telefono" type="tel" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input id="direccion" name="direccion" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="correo">Correo Electrónico</Label>
                <Input id="correo" name="correo" type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="programa_id">Programa</Label>
                <Select name="programa_id">
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
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                                Registrar Estudiante
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="program">
            <form onSubmit={onSubmitProgram} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="nombre_programa">Nombre del Programa</Label>
                <Input id="nombre_programa" name="nombre_programa" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="snies_programa">SNIES del Programa</Label>
                <Input id="snies_programa" name="snies_programa" />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                                Registrar Programa
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="agent">
            <form onSubmit={onSubmitAgent} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="nombre_agente">Nombre del Agente</Label>
                <Input id="nombre_agente" name="nombre_agente" required />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                                Registrar Agente
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="inscription">
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
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </Dashboard>
  )
}