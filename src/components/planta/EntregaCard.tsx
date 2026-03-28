'use client'

import type { EntregaEmpleado } from '@/types'
import { MapPin } from 'lucide-react'

interface EntregaCardProps {
  entregaEmpleado: EntregaEmpleado
  isSelected: boolean
  onClick: () => void
  variant: 'pendiente' | 'realizada' | 'cancelada'
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

const getEstadoBadge = (estado: string) => {
  const badges = {
    PENDIENTE: 'bg-orange-500',
    ENTREGADO: 'bg-green-500',
    CANCELADO: 'bg-red-500',
  }
  return (
    badges[estado as keyof typeof badges] ||
    'bg-gradient-to-r from-gray-500 to-gray-600 shadow-gray-200'
  )
}

export default function EntregaCard({
  entregaEmpleado,
  isSelected,
  onClick,
  variant,
}: EntregaCardProps) {
  const styles = {
    pendiente: {
      selected:
        'border-orange-400 bg-orange-50 ring-2 ring-orange-300 shadow-lg',
      default:
        'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 hover:shadow-md',
      badge: getEstadoBadge('PENDIENTE'),
    },
    realizada: {
      selected: 'border-green-400 bg-green-50 ring-2 ring-green-300 shadow-lg',
      default:
        'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 hover:shadow-md',
      badge: getEstadoBadge('ENTREGADO'),
    },
    cancelada: {
      selected: 'border-red-400 bg-red-50 ring-2 ring-red-300 shadow-lg',
      default:
        'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 hover:shadow-md',
      badge: getEstadoBadge('CANCELADO'),
    },
  }

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border p-2 text-left shadow-sm transition-all duration-200 lg:p-3 ${
        isSelected ? styles[variant].selected : styles[variant].default
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-grow space-y-1.5 min-w-0 pr-3">
          {/* Fecha principal */}
          <p className="text-sm leading-relaxed font-semibold text-gray-800 lg:text-base">
            {formatDate(entregaEmpleado.entrega.fecha_hora_entrega)}
          </p>

          {/* Dirección con icono */}
          <div className="flex items-start space-x-1">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400 lg:h-6 lg:w-6" />
            <p className="text-sm leading-relaxed text-gray-600 lg:text-base break-words min-w-0">
              {entregaEmpleado.obra.direccion.split(',')[0]},{' '}
              {entregaEmpleado.obra.localidad.nombre_localidad}
            </p>
          </div>
        </div>

        {/* Badge arriba a la derecha */}
        <div className="ml-3 flex flex-col items-end space-y-1">
          <span
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-md lg:px-4 lg:py-2 lg:text-sm ${styles[variant].badge}`}
          >
            {variant === 'pendiente' ? 'PENDIENTE' : variant === 'cancelada' ? 'CANCELADA' : 'ENTREGADA'}
          </span>
        </div>
      </div>
    </button>
  )
}
