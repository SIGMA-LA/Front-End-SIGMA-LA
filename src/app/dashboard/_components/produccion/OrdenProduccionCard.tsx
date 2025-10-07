import type { OrdenProduccion } from '@/types'
import { MapPin, Package, Calendar } from 'lucide-react'

interface OrdenProduccionCardProps {
  orden: OrdenProduccion
  isSelected: boolean
  onClick: () => void
  isAprobada: boolean // true si está aprobada, false si está en producción
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

export default function OrdenProduccionCard({
  orden,
  isSelected,
  onClick,
  isAprobada,
}: OrdenProduccionCardProps) {
  const getCardStyle = () => {
    if (isSelected) {
      if (isAprobada) {
        return 'border-blue-400 bg-blue-50 ring-2 ring-blue-300'
      } else {
        return 'border-green-400 bg-green-50 ring-2 ring-green-300'
      }
    }
    return 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
  }

  const getBadgeColor = () => {
    return isAprobada ? 'bg-blue-500' : 'bg-green-500'
  }

  const getBadgeText = () => {
    return isAprobada ? 'Aprobada' : 'En Producción'
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-lg border p-3 text-left shadow-sm transition-colors lg:p-4 ${getCardStyle()}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-grow space-y-1.5">
          {/* Número de orden */}
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-gray-400 lg:h-5 lg:w-5" />
            <p className="text-sm leading-relaxed font-semibold text-gray-800 lg:text-base">
              Orden #{orden.cod_op}
            </p>
          </div>

          {/* Fecha de validación */}
          {orden.fecha_validacion && (
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400 lg:h-5 lg:w-5" />
              <p className="text-xs leading-relaxed text-gray-500 lg:text-sm">
                Validada: {formatDate(orden.fecha_validacion)}
              </p>
            </div>
          )}

          {/* Cliente */}
          <p className="text-sm leading-relaxed text-gray-600 lg:text-base">
            Cliente:{' '}
            <span className="font-medium">
              {orden.obra.cliente.razon_social}
            </span>
          </p>

          {/* Dirección */}
          <div className="flex items-start space-x-1">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400 lg:h-6 lg:w-6" />
            <p className="text-sm leading-relaxed text-gray-500 lg:text-base">
              {orden.obra.direccion}
            </p>
          </div>
        </div>

        {/* Badge arriba a la derecha */}
        <div className="ml-3 flex flex-col items-end space-y-1">
          <span
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-md lg:px-4 lg:py-2 lg:text-sm ${getBadgeColor()}`}
          >
            {getBadgeText()}
          </span>
        </div>
      </div>
    </button>
  )
}