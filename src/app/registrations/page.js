'use client'

import { useState, useEffect, useCallback } from 'react'
import Dashboard from '@/components/dashboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { getPrograms, createInscription } from '@/utils/api'

const SCHEMA = [
  { name: 'cedula', label: 'Cédula', type: 'text' },
  { name: 'nombre', label: 'Nombre', type: 'text' },
  { name: 'telefono', label: 'Teléfono', type: 'text' },
  { name: 'sexo', label: 'Sexo', type: 'select', options: [
    { value: 'masculino', label: 'Masculino' },
    { value: 'femenino', label: 'Femenino' }
  ]},
  { name: 'date', label: 'Fecha de Inscripción', type: 'date' },
  { name: 'carrera', label: 'Carrera', type: 'select', options: [] },
  { name: 'jornada', label: 'Jornada', type: 'select', options: [
    { value: 'manana', label: 'Mañana' },
    { value: 'tarde', label: 'Tarde' },
    { value: 'noche', label: 'Noche' }
  ]},
  { name: 'nacimiento', label: 'Fecha de Nacimiento', type: 'date' },
]

export default function Inscripciones() {
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
        const carreraField = SCHEMA.find(field => field.name === 'carrera')
        if (carreraField) {
          carreraField.options = programsData.map(program => ({
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
      if (!data[field.name]) {
        errors[field.name] = 'Este campo no puede estar vacío'
      }
      if ((field.name === 'cedula' || field.name === 'telefono') && data[field.name]) {
        if (!/^\d+$/.test(data[field.name])) {
          errors[field.name] = 'Este campo solo debe contener números'
        }
        if (data[field.name].length > 11) {
          errors[field.name] = 'Este campo no puede tener más de 11 dígitos'
        }
      }
      if (field.name === 'nombre' && data[field.name] && !/^[a-zA-Z\s]+$/.test(data[field.name])) {
        errors[field.name] = 'Este campo solo debe contener letras y espacios'
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
        // Submit the form data to the API
        await createInscription(formData)
        toast({
          title: 'Éxito',
          description: 'La inscripción ha sido enviada correctamente.',
        })
        // Reset form after submission
        setFormData({})
        setFormErrors({})
        setIsSubmitted(false)
      } catch (error) {
        console.error('Error submitting inscription:', error)
        toast({
          title: 'Error',
          description: 'Hubo un problema al enviar la inscripción. Por favor, intente de nuevo.',
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
    <main>
      <Dashboard>
        <div className="text-center mb-4">
          <h1 className="text-3xl font-semibold text-foreground">Inscripciones</h1>
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
            {isLoading ? 'Enviando...' : 'Enviar Inscripción'}
          </Button>
        </form>
      </Dashboard>
      <Toaster />
    </main>
  )
}