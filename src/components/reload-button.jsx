import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

export default function ReloadButton({ onClick, loading }) {
  return (
    <Button onClick={onClick} disabled={loading}>
      <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
      {loading ? 'Cargando...' : 'Recargar'}
    </Button>
  )
}