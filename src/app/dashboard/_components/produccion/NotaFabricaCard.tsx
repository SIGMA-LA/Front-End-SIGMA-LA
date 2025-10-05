import type { Obra } from '@/types'
import { MapPin, FileText } from 'lucide-react'

interface NotaFabricaCardProps {
  obra: Obra
  isSelected: boolean
  onClick: () => void
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

export default function NotaFabricaCard({
  obra,
  isSelected,
  onClick,
}: NotaFabricaCardProps) {
  const getCardStyle = () => {
    if (isSelected) {
      return 'border-orange-400 bg-orange-50 ring-2 ring-orange-300'
    }
    return 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
  }

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border p-3 text-left shadow-sm transition-colors lg:p-4 ${getCardStyle()}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-grow space-y-1.5">
          {/* Fecha de inicio */}
          <p className="text-sm leading-relaxed font-semibold text-gray-800 lg:text-base">
            Iniciada: {formatDate(obra.fecha_ini)}
          </p>

          {/* Cliente */}
          <p className="text-sm leading-relaxed text-gray-600 lg:text-base">
            Cliente:{' '}
            <span className="font-medium">
              {obra.cliente.razon_social}
            </span>
          </p>

          {/* Dirección */}
          <div className="flex items-start space-x-1">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400 lg:h-6 lg:w-6" />
            <p className="text-sm leading-relaxed text-gray-500 lg:text-base">
              {obra.direccion}
            </p>
          </div>
        </div>

        {/* Badge arriba a la derecha */}
        <div className="ml-3 flex flex-col items-end space-y-1">
          <span
            className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md lg:px-4 lg:py-2 lg:text-sm"
          >
            Pendiente
          </span>
        </div>
      </div>
    </button>
  )
}