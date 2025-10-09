import type { Obra } from '@/types'
import {
  CheckCircle,
  Cog,
  XCircle,
  Clock,
  Truck,
  Hourglass,
  DollarSign,
  Banknote,
} from 'lucide-react'

interface EstadoObraBadgeProps {
  estado: Obra['estado']
}

export default function EstadoObraBadge({ estado }: EstadoObraBadgeProps) {
  const getStatusInfo = (
    estado: Obra['estado']
  ): { text: string; className: string; Icon: React.ElementType } => {
    switch (estado) {
      case 'EN ESPERA DE PAGO':
        return {
          text: 'En Espera de Pago',
          className: 'bg-blue-100 text-blue-800',
          Icon: Clock,
        }
      case 'EN PRODUCCION':
        return {
          text: 'En Producción',
          className: 'bg-yellow-100 text-yellow-800',
          Icon: Cog,
        }
      case 'PRODUCCION FINALIZADA':
        return {
          text: 'Producción Finalizada',
          className: 'bg-purple-100 text-purple-800',
          Icon: CheckCircle,
        }
      case 'PAGADA PARCIALMENTE':
        return {
          text: 'Pagada Parcialmente',
          className: 'bg-cyan-100 text-cyan-800',
          Icon: Banknote,
        }
      case 'ENTREGADA':
        return {
          text: 'Entregada',
          className: 'bg-green-100 text-green-800',
          Icon: Truck,
        }
      case 'EN ESPERA DE STOCK':
        return {
          text: 'En Espera de Stock',
          className: 'bg-orange-100 text-orange-800',
          Icon: Hourglass,
        }
      case 'CANCELADA':
        return {
          text: 'Cancelada',
          className: 'bg-red-100 text-red-800',
          Icon: XCircle,
        }
      case 'PAGADA TOTALMENTE':
        return {
          text: 'Pagada Totalmente',
          className: 'bg-teal-100 text-teal-800',
          Icon: DollarSign,
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
