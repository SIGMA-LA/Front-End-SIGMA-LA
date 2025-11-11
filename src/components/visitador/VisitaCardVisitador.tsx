import type { Visita } from '@/types'
import { MapPin } from 'lucide-react'

interface VisitaCardVisitadorProps {
  visita: Visita
  isSelected: boolean
  onClick: () => void
  isPendiente: boolean
}

const getMotivoText = (motivo: string) => {
  const motivos = {
    MEDICION: 'Medición',
    'RE-MEDICION': 'Re-medición',
    REPARACION: 'Reparación',
    ASESORAMIENTO: 'Asesoramiento',
    'VISITA INICIAL': 'Visita Inicial',
  }
  return motivos[motivo as keyof typeof motivos] || motivo
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

const formatTime = (dateString: string) =>
  new Date(dateString).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  })

export default function VisitaCardVisitador({
  visita,
  isSelected,
  onClick,
  isPendiente,
}: VisitaCardVisitadorProps) {
  const getCardStyle = () => {
    if (isSelected) {
      if (isPendiente) {
        return 'border-orange-400 bg-orange-50 ring-2 ring-orange-300'
      } else {
        return 'border-green-400 bg-green-50 ring-2 ring-green-300'
      }
    }
    return 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
  }

  const getVariantBadgeText = () => {
    if (isPendiente) {
      return visita.estado === 'PROGRAMADA' ? 'Pendiente' : visita.estado
    } else {
      return 'Completada'
    }
  }

  const getVariantBadgeColor = () => {
    if (isPendiente) {
      return 'bg-orange-500'
    } else {
      return 'bg-green-500'
    }
  }

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border p-3 text-left shadow-sm transition-colors lg:p-4 ${getCardStyle()}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-grow space-y-1.5">
          <p className="text-sm leading-relaxed font-semibold text-gray-800 lg:text-base">
            {formatDate(visita.fecha_hora_visita)} -{' '}
            {formatTime(visita.fecha_hora_visita)}
          </p>

          <p className="text-sm leading-relaxed text-gray-600 lg:text-base">
            {getMotivoText(visita.motivo_visita)}
          </p>

          <p className="text-sm leading-relaxed text-gray-500 lg:text-base">
            Cliente:{' '}
            <span className="font-medium">
              {visita.obra?.cliente?.razon_social ||
                `${visita.nombre_cliente || ''} ${visita.apellido_cliente || ''}`.trim() ||
                'Sin cliente'}
            </span>
          </p>

          <div className="flex items-start space-x-1">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400 lg:h-6 lg:w-6" />
            <p className="text-sm leading-relaxed text-gray-500 lg:text-base">
              {visita.direccion_visita ||
                visita.obra?.direccion ||
                'Sin dirección'}
            </p>
          </div>
        </div>

        <div className="ml-3 flex flex-col items-end space-y-1">
          <span
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-md lg:px-4 lg:py-2 lg:text-sm ${getVariantBadgeColor()}`}
          >
            {getVariantBadgeText()}
          </span>
        </div>
      </div>
    </button>
  )
}
