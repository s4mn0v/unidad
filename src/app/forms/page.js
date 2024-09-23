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
  const [agents, setAgents] = useState([])
  const [students, setStudents] = useState([])
  const [errors, setErrors] = useState({})
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

  const validateField = (name, value) => {
    let error = ''
    if (!value) {
      error = 'Este campo es requerido'
    } else if ((name === 'cedula_estudiantes' || name === 'telefono') && value.length > 11) {
      error = 'Este campo no puede tener más de 11 dígitos'
    } else if ((name === 'cedula_estudiantes' || name === 'telefono') && !/^\d+$/.test(value)) {
      error = 'Este campo solo debe contener números'
    } else if ((name.startsWith('apellido') || name.startsWith('nombre')) && !/^[a-zA-Z\s]+$/.test(value)) {
      error = 'Este campo solo debe contener letras y espacios'
    } else if (name === 'correo' && !/\S+@\S+\.\S+/.test(value)) {
      error = 'Ingrese un correo electrónico válido'
    }
    return error
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  async function onSubmitStudent(event) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const studentData = Object.fromEntries(formData)

    const formErrors = Object.keys(studentData).reduce((acc, key) => {
      const error = validateField(key, studentData[key])
      if (error) acc[key] = error
      return acc
    }, {})

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      setIsLoading(false)
      return
    }

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

    const formErrors = Object.keys(programData).reduce((acc, key) => {
      const error = validateField(key, programData[key])
      if (error) acc[key] = error
      return acc
    }, {})

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      setIsLoading(false)
      return
    }

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

    const formErrors = Object.keys(agentData).reduce((acc, key) => {
      const error = validateField(key, agentData[key])
      if (error) acc[key] = error
      return acc
    }, {})

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      setIsLoading(false)
      return
    }

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

  return (
    <Dashboard>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold mb-4 text-foreground">Formularios de Registro</h1>
        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="student">Estudiante</TabsTrigger>
            <TabsTrigger value="program">Programa</TabsTrigger>
            <TabsTrigger value="agent">Agente</TabsTrigger>
          </TabsList>
          <TabsContent value="student">
            <form onSubmit={onSubmitStudent} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="cedula_estudiantes">Cédula</Label>
                <Input 
                  id="cedula_estudiantes" 
                  name="cedula_estudiantes" 
                  required 
                  onChange={handleInputChange}
                />
                {errors.cedula_estudiantes && <p className="text-red-500 text-sm">{errors.cedula_estudiantes}</p>}
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
                <Input 
                  id="apellido1" 
                  name="apellido1" 
                  required 
                  onChange={handleInputChange}
                />
                {errors.apellido1 && <p className="text-red-500 text-sm">{errors.apellido1}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido2">Segundo Apellido</Label>
                <Input 
                  id="apellido2" 
                  name="apellido2" 
                  onChange={handleInputChange}
                />
                {errors.apellido2 && <p className="text-red-500 text-sm">{errors.apellido2}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombre1">Primer Nombre</Label>
                <Input 
                  id="nombre1" 
                  name="nombre1" 
                  required 
                  onChange={handleInputChange}
                />
                {errors.nombre1 && <p className="text-red-500 text-sm">{errors.nombre1}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombre2">Segundo Nombre</Label>
                <Input 
                  id="nombre2" 
                  name="nombre2" 
                  onChange={handleInputChange}
                />
                {errors.nombre2 && <p className="text-red-500 text-sm">{errors.nombre2}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input 
                  id="telefono" 
                  name="telefono" 
                  type="tel" 
                  onChange={handleInputChange}
                />
                {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input id="direccion" name="direccion" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="correo">Correo Electrónico</Label>
                <Input 
                  id="correo" 
                  name="correo" 
                  type="email" 
                  onChange={handleInputChange}
                />
                {errors.correo && <p className="text-red-500 text-sm">{errors.correo}</p>}
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
                <Input 
                  id="nombre_programa" 
                  name="nombre_programa" 
                  required 
                  onChange={handleInputChange}
                />
                {errors.nombre_programa && <p className="text-red-500 text-sm">{errors.nombre_programa}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="snies_programa">SNIES del Programa</Label>
                <Input 
                  id="snies_programa" 
                  name="snies_programa"
                  onChange={handleInputChange}
                />
                {errors.snies_programa && <p className="text-red-500 text-sm">{errors.snies_programa}</p>}
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
                <Input 
                  id="nombre_agente" 
                  name="nombre_agente" 
                  required 
                  onChange={handleInputChange}
                />
                {errors.nombre_agente && <p className="text-red-500 text-sm">{errors.nombre_agente}</p>}
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
        </Tabs>
      </div>
      <Toaster />
    </Dashboard>
  )
}