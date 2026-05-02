import type { Obra, EstadoNotaFabricaProduccion } from '@/types'
import { MapPin } from 'lucide-react'
import { formatDateOnly } from '@/lib/utils'

interface NotaFabricaCardProps {
  obra: Obra
  status: EstadoNotaFabricaProduccion
  isSelected: boolean
  onClick: () => void
}

export default function NotaFabricaCard({
  obra,
  status,
  isSelected,
  onClick,
}: NotaFabricaCardProps) {
  const clienteNombre =
    obra.cliente.razon_social?.trim() ||
    `${obra.cliente.nombre ?? ''} ${obra.cliente.apellido ?? ''}`.trim() ||
    'Sin nombre'

  const statusStyles = {
    SIN_ORDEN: {
      selected: 'border-orange-400 bg-orange-50 ring-2 ring-orange-300',
      default:
        'border-orange-200 bg-orange-50/40 hover:border-orange-300 hover:bg-orange-50',
    },
    CON_ORDEN: {
      selected: 'border-purple-400 bg-purple-50 ring-2 ring-purple-300',
      default:
        'border-purple-200 bg-purple-50/40 hover:border-purple-300 hover:bg-purple-50',
    },
    EN_PRODUCCION: {
      selected: 'border-blue-400 bg-blue-50 ring-2 ring-blue-300',
      default:
        'border-blue-200 bg-blue-50/40 hover:border-blue-300 hover:bg-blue-50',
    },
    FINALIZADA: {
      selected: 'border-green-400 bg-green-50 ring-2 ring-green-300',
      default:
        'border-green-200 bg-green-50/40 hover:border-green-300 hover:bg-green-50',
    },
  }[status]

  const getCardStyle = () => {
    if (isSelected) {
      return statusStyles.selected
    }
    return statusStyles.default
  }

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border p-3 text-left shadow-sm transition-colors lg:p-4 ${getCardStyle()}`}
    >
      <div className="space-y-1.5">
        {/* Fecha de inicio */}
        <p className="text-sm leading-relaxed font-semibold text-gray-800 lg:text-base">
          Iniciada: {formatDateOnly(obra.fecha_ini)}
        </p>

        {/* Cliente */}
        <p className="text-sm leading-relaxed text-gray-600 lg:text-base">
          Cliente: <span className="font-medium">{clienteNombre}</span>
        </p>

        {/* Dirección */}
        <div className="flex items-start space-x-1">
          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400 lg:h-6 lg:w-6" />
          <p className="text-sm leading-relaxed text-gray-500 lg:text-base">
            {obra.direccion}
          </p>
        </div>
      </div>
    </button>
  )
}
