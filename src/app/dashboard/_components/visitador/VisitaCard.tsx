import type { Visita } from '@/types'
import { Calendar, MapPin } from 'lucide-react'

interface VisitaCardProps {
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

export default function VisitaCard({
  visita,
  isSelected,
  onClick,
  isPendiente,
}: VisitaCardProps) {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'PROGRAMADA':
        return 'bg-blue-100 text-blue-700'
      case 'EN CURSO':
        return 'bg-yellow-100 text-yellow-700'
      case 'COMPLETADA':
        return 'bg-green-100 text-green-700'
      case 'CANCELADA':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  // Lógica para determinar el estilo del card basado en si está seleccionado y si es pendiente
  const getCardStyle = () => {
    if (isSelected) {
      if (isPendiente) {
        return 'border-blue-400 bg-blue-50 ring-2 ring-blue-300 ring-opacity-50'
      } else {
        return 'border-green-400 bg-green-50 ring-2 ring-green-300 ring-opacity-50'
      }
    }
    return 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 hover:shadow-md'
  }

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border p-3 text-left shadow-sm transition-all duration-200 ${getCardStyle()}`}
    >
      <div className="space-y-2">
        {/* Header con fecha y estado */}
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-1 text-xs text-gray-500 lg:text-sm">
              <Calendar className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="font-medium">
                {formatDate(visita.fecha_hora_visita)}
              </span>
              <span>•</span>
              <span>{formatTime(visita.fecha_hora_visita)}</span>
            </div>
          </div>
          <span
            className={`ml-2 inline-flex rounded-full px-2 py-1 text-xs font-medium ${getEstadoColor(visita.estado)}`}
          >
            {visita.estado}
          </span>
        </div>

        {/* Información principal */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-900 lg:text-sm">
            {getMotivoText(visita.motivo_visita)}
          </p>
          <p className="text-xs text-gray-600 lg:text-sm">
            {visita.obra?.cliente.razon_social || 'Sin obra asignada'}
          </p>
        </div>

        {/* Dirección */}
        <div className="flex items-start space-x-1">
          <MapPin className="mt-0.5 h-3 w-3 flex-shrink-0 text-gray-400 lg:h-4 lg:w-4" />
          <p className="line-clamp-2 text-xs text-gray-500 lg:text-sm">
            {visita.direccion_visita ||
              visita.obra?.direccion ||
              'Sin dirección'}
          </p>
        </div>
      </div>
    </button>
  )
}
