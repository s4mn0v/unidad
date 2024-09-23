'use client'

import { useState, useEffect, useCallback } from 'react'
import Dashboard from '@/components/dashboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { getPrograms, createStudent } from '@/utils/api'

const SCHEMA = [
  { name: 'cedula_estudiantes', label: 'Cédula', type: 'text' },
  { name: 'tipo_documento', label: 'Tipo de Documento', type: 'select', options: [
    { value: 'cedula', label: 'Cédula' },
    { value: 'pasaporte', label: 'Pasaporte' },
    { value: 'otro', label: 'Otro' }
  ]},
  { name: 'apellido1', label: 'Primer Apellido', type: 'text' },
  { name: 'apellido2', label: 'Segundo Apellido', type: 'text' },
  { name: 'nombre1', label: 'Primer Nombre', type: 'text' },
  { name: 'nombre2', label: 'Segundo Nombre', type: 'text' },
  { name: 'telefono', label: 'Teléfono', type: 'text' },
  { name: 'direccion', label: 'Dirección', type: 'text' },
  { name: 'correo', label: 'Correo Electrónico', type: 'email' },
  { name: 'programa_id', label: 'Programa', type: 'select', options: [] },
]

export default function EstudiantePage() {
  const [formData, setFormData] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const [programs, setPrograms] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const programsData = await getPrograms()
        setPrograms(programsData)
        // Update SCHEMA with fetched program options
        const programaField = SCHEMA.find(field => field.name === 'programa_id')
        if (programaField) {
          programaField.options = programsData.map(program => ({
            value: program.programa_id.toString(),
            label: program.nombre_programa
          }))
        }
      } catch (error) {
        console.error('Error fetching programs:', error)
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los programas. Por favor, intente de nuevo más tarde.',
          variant: 'destructive',
        })
      }
    }

    fetchPrograms()
  }, [toast])

  const validateForm = (data) => {
    const errors = {}
    SCHEMA.forEach(field => {
      if (!data[field.name] && field.name !== 'apellido2' && field.name !== 'nombre2') {
        errors[field.name] = 'Este campo es requerido'
      }
      if ((field.name === 'cedula_estudiantes' || field.name === 'telefono') && data[field.name]) {
        if (!/^\d+$/.test(data[field.name])) {
          errors[field.name] = 'Este campo solo debe contener números'
        }
        if (data[field.name].length > 11) {
          errors[field.name] = 'Este campo no puede tener más de 11 dígitos'
        }
      }
      if ((field.name.startsWith('apellido') || field.name.startsWith('nombre')) && data[field.name] && !/^[a-zA-Z\s]+$/.test(data[field.name])) {
        errors[field.name] = 'Este campo solo debe contener letras y espacios'
      }
      if (field.name === 'correo' && data[field.name] && !/\S+@\S+\.\S+/.test(data[field.name])) {
        errors[field.name] = 'Ingrese un correo electrónico válido'
      }
    })
    return errors
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault()
    setIsSubmitted(true)
    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true)
      try {
        await createStudent(formData)
        toast({
          title: 'Éxito',
          description: 'El estudiante ha sido registrado correctamente.',
        })
        setFormData({})
        setFormErrors({})
        setIsSubmitted(false)
      } catch (error) {
        console.error('Error submitting student:', error)
        toast({
          title: 'Error',
          description: 'Hubo un problema al registrar el estudiante. Por favor, intente de nuevo.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      setFormErrors(validationErrors)
      toast({
        title: 'Error',
        description: 'Por favor, corrija los errores en el formulario.',
        variant: 'destructive',
      })
    }
  }, [formData, toast])

  return (
    <Dashboard>
      <div className="text-center mb-4">
        <h1 className="text-3xl font-semibold text-foreground">Registro de Estudiante</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        {SCHEMA.map(field => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium mb-3">
              {field.label}
            </label>
            {field.type === 'select' ? (
              <Select
                name={field.name}
                value={formData[field.name] || ''}
                onValueChange={(value) => handleInputChange({ target: { name: field.name, value } })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Seleccione ${field.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                type={field.type}
                id={field.name}
                name={field.name}
                placeholder={field.label}
                value={formData[field.name] || ''}
                onChange={handleInputChange}
                className="w-full"
              />
            )}
            {isSubmitted && formErrors[field.name] && (
              <p className="text-red-500 text-sm mt-1">{formErrors[field.name]}</p>
            )}
          </div>
        ))}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrar Estudiante'}
        </Button>
      </form>
      <Toaster />
    </Dashboard>
  )
}