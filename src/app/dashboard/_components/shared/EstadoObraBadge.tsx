import type { Obra } from '@/types'
import {
  CheckCircle,
  Cog,
  XCircle,
  Clock,
  Truck,
  Hourglass,
} from 'lucide-react'

interface EstadoObraBadgeProps {
  estado: Obra['estado']
}

export default function EstadoObraBadge({ estado }: EstadoObraBadgeProps) {
  const getStatusInfo = (
    estado: Obra['estado']
  ): { text: string; className: string; Icon: React.ElementType } => {
    switch (estado) {
      case 'ACTIVA':
        return {
          text: 'Activa',
          className: 'bg-blue-100 text-blue-800',
          Icon: Cog,
        }
      case 'EN PRODUCCION':
        return {
          text: 'En Producción',
          className: 'bg-yellow-100 text-yellow-800',
          Icon: Hourglass,
        }
      case 'FINALIZADA':
        return {
          text: 'Finalizada',
          className: 'bg-purple-100 text-purple-800',
          Icon: CheckCircle,
        }
      case 'ENTREGADA':
        return {
          text: 'Entregada',
          className: 'bg-green-100 text-green-800',
          Icon: Truck,
        }
      case 'EN ESPERA DE STOCK':
        return {
          text: 'En Espera',
          className: 'bg-orange-100 text-orange-800',
          Icon: Clock,
        }
      default:
        return {
          text: estado,
          className: 'bg-gray-100 text-gray-800',
          Icon: CheckCircle,
        }
    }
  }

  const { text, className, Icon } = getStatusInfo(estado)

  return (
    <span
      className={`inline-flex items-center gap-x-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {text}
    </span>
  )
}
