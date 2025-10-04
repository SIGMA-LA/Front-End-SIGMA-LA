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
    <div className="flex h-full items-center justify-center p-8 text-center text-gray-500">
      <div>
        <Truck className="mx-auto mb-6 h-24 w-24 text-gray-300 lg:h-32 lg:w-32" />
        <p className="mb-4 text-xl font-medium lg:text-2xl">{message}</p>
        {(totalPendientes > 0 || totalRealizadas > 0) && (
          <div className="space-y-2 text-base text-gray-400 lg:text-lg">
            <p>
              Entregas pendientes:{' '}
              <span className="font-semibold text-blue-600">
                {totalPendientes}
              </span>
            </p>
            <p>
              Entregas realizadas:{' '}
              <span className="font-semibold text-green-600">
                {totalRealizadas}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
