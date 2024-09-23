'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

export default function EditDialog({ isOpen, onOpenChange, item, onUpdate, itemType, schema, idField }) {
  const [editedItem, setEditedItem] = useState(item || {})
  const { toast } = useToast()

  useEffect(() => {
    if (item) {
      setEditedItem(item)
    }
  }, [item])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedItem(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setEditedItem(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async () => {
    if (!editedItem[idField]) {
      toast({
        title: 'Error',
        description: 'No se puede actualizar el elemento. Datos incompletos.',
        variant: 'destructive',
      })
      return
    }

    try {
      await onUpdate(editedItem)
      toast({
        title: 'Éxito',
        description: `El ${itemType} ha sido actualizado correctamente.`,
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: `Hubo un problema al actualizar el ${itemType}. Por favor, inténtalo de nuevo.`,
        variant: 'destructive',
      })
    }
  }

  const renderField = (field) => {
    const value = editedItem[field.name] || ''
    
    if (field.type === 'select' && field.options) {
      return (
        <Select
          key={field.name}
          name={field.name}
          value={value.toString()}
          onValueChange={(value) => handleSelectChange(field.name, value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`Seleccione ${field.label}`} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    return (
      <Input
        key={field.name}
        id={field.name}
        name={field.name}
        value={value}
        onChange={handleInputChange}
        type={field.type || 'text'}
        disabled={field.name === idField}
      />
    )
  }

  // Early return if item or schema is not available
  if (!item || !schema) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar {itemType}</DialogTitle>
          <DialogDescription>
            Realice los cambios necesarios en los campos a continuación. Haga clic en guardar cuando termine.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {schema.map((field) => (
            <div key={field.name} className="grid grid-cols-4 items-center gap-4">
              <label htmlFor={field.name}>{field.label}</label>
              <div className="col-span-3">
                {renderField(field)}
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleUpdate}>Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}