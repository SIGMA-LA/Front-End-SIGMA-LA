import type { Visita } from '@/types'
import { MapPin, Clock, User } from 'lucide-react'

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
  const getCardStyle = () => {
    if (isSelected) {
      return 'border-indigo-500 bg-indigo-50/30 ring-1 ring-indigo-500 shadow-sm'
    }
    return 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
  }

  const getStatusInfo = () => {
    const estado = visita.estado || (isPendiente ? 'PENDIENTE' : 'COMPLETADA')
    switch (estado) {
      case 'PENDIENTE':
      case 'PROGRAMADA':
        return { text: 'Pendiente', color: 'text-yellow-600 bg-yellow-50 border-yellow-100' }
      case 'COMPLETADA':
        return { text: 'Completada', color: 'text-green-600 bg-green-50 border-green-100' }
      case 'CANCELADA':
        return { text: 'Cancelada', color: 'text-red-600 bg-red-50 border-red-100' }
      default:
        return { text: estado, color: 'text-gray-600 bg-gray-50 border-gray-100' }
    }
  }

  const status = getStatusInfo()
  const clienteNombre = visita.obra?.cliente
    ? visita.obra.cliente.razon_social || 
      `${visita.obra.cliente.nombre || ''} ${visita.obra.cliente.apellido || ''}`.trim()
    : `${visita.nombre_cliente || ''} ${visita.apellido_cliente || ''}`.trim() || 'Sin cliente'

  return (
    <button
      onClick={onClick}
      className={`group w-full rounded-xl border p-4 text-left transition-all duration-200 flex flex-col gap-2 ${getCardStyle()}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1">
            <Clock className="h-3.5 w-3.5 text-indigo-500" />
            {formatDate(visita.fecha_hora_visita)} - {formatTime(visita.fecha_hora_visita)}
          </div>
          <h4 className="text-sm font-bold text-gray-800 leading-tight truncate">
            {getMotivoText(visita.motivo_visita)}
          </h4>
        </div>
        
        <span className={`flex-shrink-0 px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase ${status.color}`}>
          {status.text}
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-gray-600">
          <User className="h-3.5 w-3.5 text-gray-400" />
          <p className="text-xs font-semibold truncate">{clienteNombre}</p>
        </div>

        <div className="flex items-start gap-2 text-gray-500">
          <MapPin className="h-3.5 w-3.5 mt-0.5 text-gray-400 flex-shrink-0" />
          <p className="text-xs font-medium leading-normal line-clamp-1 italic">
            {visita.obra?.direccion || visita.direccion_visita || 'Sin dirección'}
          </p>
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
