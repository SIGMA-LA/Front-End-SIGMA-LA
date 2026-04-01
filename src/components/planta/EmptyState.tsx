'use client'

import { Truck } from 'lucide-react'

interface EmptyStateProps {
  message?: string
}

export default function EmptyState({
  message = 'Selecciona una entrega para ver los detalles',
}: EmptyStateProps) {
  return (
    <div className="flex h-full items-center justify-center p-8 text-center text-gray-500">
      <div>
        <Truck className="mx-auto mb-6 h-24 w-24 text-gray-300 lg:h-32 lg:w-32" />
        <p className="mb-4 text-xl font-medium lg:text-2xl">{message}</p>
      </div>
    </div>
  )
}
