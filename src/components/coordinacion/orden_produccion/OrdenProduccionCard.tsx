import { useState } from 'react'
import type { OrdenProduccion } from '@/types'
import { MapPin, Package, Calendar, Eye, CheckCircle } from 'lucide-react'

interface OrdenProduccionCardProps {
  orden: OrdenProduccion
  onVerDetalles: (orden: OrdenProduccion) => void
  onAprobar: (orden: OrdenProduccion) => void
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

const getEstadoBadgeColor = (estado: string) => {
  switch (estado) {
    case 'PENDIENTE':
      return 'bg-yellow-500'
    case 'APROBADA':
      return 'bg-blue-500'
    case 'EN PRODUCCION':
      return 'bg-green-500'
    case 'FINALIZADA':
      return 'bg-gray-500'
    default:
      return 'bg-gray-400'
  }
}

export default function OrdenProduccionCard({
  orden,
  onVerDetalles,
  onAprobar,
}: OrdenProduccionCardProps) {
  const [isApproving, setIsApproving] = useState(false)
  const cliente = orden.obra?.cliente
  const nombreCliente =
    cliente?.tipo_cliente === 'EMPRESA'
      ? cliente.razon_social?.trim()
      : `${cliente?.nombre ?? ''} ${cliente?.apellido ?? ''}`.trim()

  const handleAprobar = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsApproving(true)
    try {
      await onAprobar(orden)
    } finally {
      setIsApproving(false)
    }
  }

  const handleVerDetalles = (e: React.MouseEvent) => {
    e.stopPropagation()
    onVerDetalles(orden)
  }

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-gray-300 hover:shadow-md lg:p-5">
      <div className="flex items-start justify-between">
        <div className="flex-grow space-y-2">
          {/* Número de orden y estado */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-gray-400" />
              <p className="text-base font-semibold text-gray-800 lg:text-lg">
                Orden #{orden.cod_op}
              </p>
            </div>
            <span
              className={`rounded-lg px-3 py-1 text-xs font-semibold text-white shadow-sm ${getEstadoBadgeColor(orden.estado)}`}
            >
              {orden.estado}
            </span>
          </div>

          {/* Fecha de confección */}
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <p className="text-sm text-gray-500">
              Confeccionada: {formatDate(orden.fecha_confeccion)}
            </p>
          </div>

          {/* Cliente */}
          <p className="text-sm text-gray-600 lg:text-base">
            <span className="font-medium">Cliente:</span>{' '}
            {nombreCliente || 'N/A'}
          </p>

          {/* Obra */}
          <p className="text-sm text-gray-600 lg:text-base">
            <span className="font-medium">Obra #{orden.cod_obra}</span>
          </p>

          {/* Dirección */}
          <div className="flex items-start space-x-2">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
            <p className="text-sm text-gray-500">
              {orden.obra?.direccion || 'Sin dirección'}
              {orden.obra?.localidad?.nombre_localidad &&
                ` - ${orden.obra.localidad.nombre_localidad}`}
            </p>
          </div>

          {/* Estado de Visitas */}
          <div className="pt-1">
            {orden.obra?.visita?.some((v) => v.estado === 'COMPLETADA') ? (
              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                Visita completada
              </span>
            ) : orden.obra?.visita?.some(
                (v) => v.estado === 'PROGRAMADA' || v.estado === 'EN CURSO'
              ) ? (
              <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                Visita pendiente
              </span>
            ) : (
              <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                Sin visita agendada
              </span>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleVerDetalles}
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
            >
              <Eye className="h-4 w-4" />
              Ver Detalles
            </button>

            {orden.estado === 'PENDIENTE' && (
              <button
                onClick={handleAprobar}
                disabled={isApproving}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4" />
                {isApproving ? 'Aprobando...' : 'Aprobar'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
