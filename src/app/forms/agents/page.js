'use client'

import { useState, useCallback } from 'react'
import Dashboard from '@/components/dashboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { createAgent } from '@/utils/api'

const SCHEMA = [
  { name: 'nombre_agente', label: 'Nombre del Agente', type: 'text' },
]

export default function AgentePage() {
  const [formData, setFormData] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const validateForm = (data) => {
    const errors = {}
    SCHEMA.forEach(field => {
      if (!data[field.name]) {
        errors[field.name] = 'Este campo es requerido'
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
        await createAgent(formData)
        toast({
          title: 'Éxito',
          description: 'El agente ha sido registrado correctamente.',
        })
        setFormData({})
        setFormErrors({})
        setIsSubmitted(false)
      } catch (error) {
        console.error('Error submitting agent:', error)
        toast({
          title: 'Error',
          description: 'Hubo un problema al registrar el agente. Por favor, intente de nuevo.',
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
        <h1 className="text-3xl font-semibold text-foreground">Registro de Agente</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        {SCHEMA.map(field => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium mb-3">
              {field.label}
            </label>
            <Input
              type={field.type}
              id={field.name}
              name={field.name}
              placeholder={field.label}
              value={formData[field.name] || ''}
              onChange={handleInputChange}
              className="w-full"
            />
            {isSubmitted && formErrors[field.name] && (
              <p className="text-red-500 text-sm mt-1">{formErrors[field.name]}</p>
            )}
          </div>
        ))}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrar Agente'}
        </Button>
      </form>
      <Toaster />
    </Dashboard>
  )
}