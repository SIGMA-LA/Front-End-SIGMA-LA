'use client'

import { X } from 'lucide-react'
import type { EntregaEmpleado } from '@/types'

interface FinalizarEntregaModalProps {
  isOpen: boolean
  observaciones: string
  onObservacionesChange: (value: string) => void
  onConfirm: () => void
  onCancel: () => void
  entregaSeleccionada: EntregaEmpleado | null
}

export default function FinalizarEntregaModal({
  isOpen,
  observaciones,
  onObservacionesChange,
  onConfirm,
  onCancel,
  entregaSeleccionada,
}: FinalizarEntregaModalProps) {
  if (!isOpen || !entregaSeleccionada) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="bg-opacity-50 absolute inset-0 bg-black"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative mx-4 w-full max-w-md rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Finalizar Entrega
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 p-6">
          <div className="text-sm text-gray-600">
            <p>
              <strong>Entrega:</strong> #
              {entregaSeleccionada.entrega.cod_entrega}
            </p>
            <p>
              <strong>Cliente:</strong>{' '}
              {entregaSeleccionada.obra.cliente?.razon_social}
            </p>
            <p>
              <strong>Dirección:</strong> {entregaSeleccionada.obra.direccion}
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="observaciones"
              className="block text-sm font-medium text-gray-700"
            >
              Observaciones finales (opcional)
            </label>
            <textarea
              id="observaciones"
              placeholder="Agregar observaciones sobre la entrega..."
              value={observaciones}
              onChange={(e) => onObservacionesChange(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex space-x-3 rounded-b-lg border-t bg-gray-50 p-6">
          <button
            onClick={onCancel}
            className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            Confirmar Entrega
          </button>
        </div>
      </div>
    </div>
  )
}
