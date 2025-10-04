'use client'

import { Truck } from 'lucide-react'

interface EmptyStateProps {
  message?: string
  totalPendientes?: number
  totalRealizadas?: number
}

export default function EmptyState({
  message = 'Selecciona una entrega para ver los detalles',
  totalPendientes = 0,
  totalRealizadas = 0,
}: EmptyStateProps) {
  return (
    <div className="flex h-full items-center justify-center text-center text-gray-500">
      <div>
        <Truck className="mx-auto mb-4 h-16 w-16 text-gray-300" />
        <p className="mb-2 text-lg">{message}</p>
        {(totalPendientes > 0 || totalRealizadas > 0) && (
          <div className="text-sm text-gray-400">
            <p>Entregas pendientes: {totalPendientes}</p>
            <p>Entregas realizadas: {totalRealizadas}</p>
          </div>
        )}
      </div>
    </div>
  )
}
