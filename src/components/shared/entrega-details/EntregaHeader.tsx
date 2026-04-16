'use client'

import { Truck, X } from 'lucide-react'
import type { Entrega } from '@/types'

interface EntregaHeaderProps {
  entrega: Entrega
  onClose: () => void
}

export default function EntregaHeader({ entrega, onClose }: EntregaHeaderProps) {
  return (
    <div className="flex flex-shrink-0 items-center justify-between border-b bg-white p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
          <Truck className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">
              Detalles de Entrega #{entrega.cod_entrega}
            </h2>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[0.65rem] font-bold tracking-wider uppercase shadow-sm ${
                entrega.esFinal
                  ? 'border-indigo-200 bg-indigo-100 text-indigo-700'
                  : 'border-cyan-200 bg-cyan-100 text-cyan-700'
              }`}
            >
              {entrega.esFinal ? 'Final' : 'Parcial'}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                entrega.estado === 'ENTREGADO'
                  ? 'bg-green-100 text-green-800'
                  : entrega.estado === 'CANCELADO'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {entrega.estado}
            </span>
            <span>•</span>
            <span>Programada vía Coordinación</span>
          </div>
        </div>
      </div>
      <button
        onClick={onClose}
        className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
      >
        <X className="h-6 w-6" />
      </button>
    </div>
  )
}
