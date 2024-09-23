'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { Trash2, Edit } from 'lucide-react'
import { 
  deleteStudent, updateStudent, 
  deleteProgram, updateProgram, 
  deleteAgent, updateAgent, 
  deleteInscription, updateInscription 
} from '@/utils/api'
import EditDialog from './edit-dialog'

export default function ActionButtons({ item, onDelete, onUpdate, itemType, schema, idField }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [confirmationId, setConfirmationId] = useState('')
  const { toast } = useToast()

  // Early return if item or schema is not available
  if (!item || !schema) {
    return null
  }

  const getDeleteFunction = () => {
    switch (itemType) {
      case 'estudiante': return deleteStudent
      case 'programa': return deleteProgram
      case 'agente': return deleteAgent
      case 'inscripcion': return deleteInscription
      default: throw new Error(`Tipo de elemento no soportado: ${itemType}`)
    }
  }

  const getUpdateFunction = () => {
    switch (itemType) {
      case 'estudiante': return updateStudent
      case 'programa': return updateProgram
      case 'agente': return updateAgent
      case 'inscripcion': return updateInscription
      default: throw new Error(`Tipo de elemento no soportado: ${itemType}`)
    }
  }

  const handleDelete = async () => {
    if (!item[idField]) {
      toast({
        title: 'Error',
        description: 'No se puede eliminar el elemento. Datos incompletos.',
        variant: 'destructive',
      })
      return
    }

    if (confirmationId !== item[idField].toString()) {
      toast({
        title: 'Error',
        description: 'El ID ingresado no coincide.',
        variant: 'destructive',
      })
      return
    }

    try {
      const deleteFunction = getDeleteFunction()
      await deleteFunction(item[idField])
      toast({
        title: 'Éxito',
        description: `El ${itemType} ha sido eliminado correctamente.`,
      })
      onDelete(item[idField])
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: `Hubo un problema al eliminar el ${itemType}. Por favor, inténtalo de nuevo.`,
        variant: 'destructive',
      })
    }
  }

  const handleUpdate = async (updatedItem) => {
    if (!updatedItem[idField]) {
      toast({
        title: 'Error',
        description: 'No se puede actualizar el elemento. Datos incompletos.',
        variant: 'destructive',
      })
      return
    }

    try {
      const updateFunction = getUpdateFunction()
      const result = await updateFunction(updatedItem[idField], updatedItem)
      onUpdate(result)
      setIsEditDialogOpen(false)
      toast({
        title: 'Éxito',
        description: `El ${itemType} ha sido actualizado correctamente.`,
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: `Hubo un problema al actualizar el ${itemType}. Por favor, inténtalo de nuevo.`,
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex space-x-2">
      <Button variant="ghost" size="icon" onClick={() => setIsDeleteDialogOpen(true)}>
        <Trash2 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => setIsEditDialogOpen(true)}>
        <Edit className="h-4 w-4" />
      </Button>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Por favor, confirme el ID del {itemType}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-red-500 font-medium">{idField}: {item[idField]}</p>
            <Input
              placeholder={`Ingrese el ${idField} para confirmar`}
              value={confirmationId}
              onChange={(e) => setConfirmationId(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleDelete}>Confirmar eliminación</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        item={item}
        onUpdate={handleUpdate}
        itemType={itemType}
        schema={schema}
        idField={idField}
      />
    </div>
  )
}