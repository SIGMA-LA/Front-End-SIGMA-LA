'use client'

import type { EntregaEmpleado } from '@/types'

interface EntregaCardProps {
  entrega: EntregaEmpleado
  isSelected: boolean
  onClick: () => void
  isPendiente: boolean
}

const getEstadoText = (estado: string) =>
  ({
    ENTREGADO: 'Entregado',
    'EN CURSO': 'En Curso',
    CANCELADO: 'Cancelado',
    PENDIENTE: 'Pendiente',
  })[estado] || estado

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

export default function EntregaCard({
  entrega,
  isSelected,
  onClick,
  isPendiente,
}: EntregaCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border p-3 text-left shadow-sm transition-colors ${
        isSelected
          ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-300'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-grow text-sm">
          <p className="font-semibold text-gray-800">
            {formatDate(entrega.entrega.fecha_hora_entrega)} -{' '}
            {entrega.obra.direccion.split(',')[0]}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {getEstadoText(entrega.entrega.estado)} - Rol: {entrega.rol_entrega}
          </p>
        </div>
        <span
          className={`rounded-md px-3 py-1 text-xs text-white ${
            isPendiente ? 'bg-orange-500' : 'bg-gray-500'
          }`}
        >
          Info
        </span>
      </div>
    </button>
  )
}
