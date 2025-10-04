'use client'

import type { EntregaEmpleado } from '@/types'

interface EntregaCardProps {
  entregaEmpleado: EntregaEmpleado
  isSelected: boolean
  onClick: () => void
  variant: 'pendiente' | 'realizada'
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

export default function EntregaCard({
  entregaEmpleado,
  isSelected,
  onClick,
  variant,
}: EntregaCardProps) {
  const styles = {
    pendiente: {
      selected: 'border-orange-400 bg-orange-50 ring-2 ring-orange-300',
      default:
        'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50',
      badge: 'bg-orange-500',
    },
    realizada: {
      selected: 'border-green-400 bg-green-50 ring-2 ring-green-300',
      default:
        'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50',
      badge: 'bg-gray-500',
    },
  }

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border p-3 text-left shadow-sm transition-colors ${
        isSelected ? styles[variant].selected : styles[variant].default
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-grow text-sm">
          <p className="font-semibold text-gray-800">
            {formatDate(entregaEmpleado.entrega.fecha_hora_entrega)}
          </p>
          <p className="mt-1 text-xs text-gray-600">
            {entregaEmpleado.obra.direccion.split(',')[0]}
          </p>
          <p className="text-xs text-gray-500">
            Rol: {entregaEmpleado.rol_entrega}
          </p>
        </div>
        <span
          className={`rounded-md ${styles[variant].badge} px-3 py-1 text-xs text-white`}
        >
          Info
        </span>
      </div>
    </button>
  )
}
