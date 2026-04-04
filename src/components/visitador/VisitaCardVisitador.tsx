import type { Visita } from '@/types'
import { MapPin } from 'lucide-react'

interface VisitaCardVisitadorProps {
  visita: Visita
  isSelected: boolean
  onClick: () => void
  isPendiente: boolean
}

export default function VisitaCardVisitador({
  visita,
  isSelected,
  onClick,
  isPendiente,
}: VisitaCardVisitadorProps) {
  const styles = {
    pendiente: {
      selected: 'border-orange-400 bg-orange-50 ring-2 ring-orange-300 shadow-lg',
      default: 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 hover:shadow-md',
      badge: 'bg-orange-500',
    },
    realizada: {
      selected: 'border-green-400 bg-green-50 ring-2 ring-green-300 shadow-lg',
      default: 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 hover:shadow-md',
      badge: 'bg-green-500',
    },
    cancelada: {
      selected: 'border-red-400 bg-red-50 ring-2 ring-red-300 shadow-lg',
      default: 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 hover:shadow-md',
      badge: 'bg-red-500',
    },
  }

  const variant = isPendiente 
    ? 'pendiente' 
    : visita.estado === 'CANCELADA' 
      ? 'cancelada' 
      : 'realizada'

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border p-2 text-left shadow-sm transition-all duration-200 lg:p-3 ${
        isSelected ? styles[variant].selected : styles[variant].default
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-grow space-y-1.5 min-w-0 pr-3">
          {/* Fecha y Hora */}
          <p className="text-sm leading-relaxed font-semibold text-gray-800 lg:text-base">
            {formatDate(visita.fecha_hora_visita)} - {formatTime(visita.fecha_hora_visita)}
          </p>

          {/* Motivo/Detalle */}
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-bold text-gray-700 leading-tight truncate lg:text-base">
              {getMotivoText(visita.motivo_visita)}
            </h4>
          </div>

          {/* Dirección con icono */}
          <div className="flex items-start space-x-1">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400 lg:h-6 lg:w-6" />
            <p className="text-sm leading-relaxed text-gray-600 lg:text-base break-words min-w-0">
              {visita.obra?.direccion || visita.direccion_visita || 'Sin dirección'}
            </p>
          </div>
        </div>

        {/* Badge arriba a la derecha */}
        <div className="ml-3 flex flex-col items-end space-y-1">
          <span
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-md lg:px-4 lg:py-2 lg:text-sm ${styles[variant].badge}`}
          >
            {variant === 'pendiente' ? 'PENDIENTE' : variant === 'cancelada' ? 'CANCELADA' : 'REALIZADA'}
          </span>
        </div>
      </div>
    </button>
  )
}

const getMotivoText = (motivo: string) => {
  const motivos: Record<string, string> = {
    MEDICION: 'Medición',
    'RE-MEDICION': 'Re-Medición',
    REPARACION: 'Reparación',
    ASESORAMIENTO: 'Asesoramiento',
    'VISITA INICIAL': 'Visita Inicial',
    'TOMA DE MEDIDAS': 'Toma de medidas',
    'REPLANTEO': 'Replanteo',
  }
  return motivos[motivo] || motivo
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
  })

const formatTime = (dateString: string) =>
  new Date(dateString).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  })
