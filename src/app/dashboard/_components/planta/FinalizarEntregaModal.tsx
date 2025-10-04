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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="bg-opacity-50 absolute inset-0 bg-transparent backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal responsivo */}
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-xl lg:max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4 lg:p-6">
          <h2 className="text-base font-semibold text-gray-900 lg:text-lg">
            Finalizar Entrega
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <X className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 p-4 lg:p-6">
          <div className="text-xs text-gray-600 lg:text-sm">
            <p className="mb-1">
              <strong>Entrega:</strong> #
              {entregaSeleccionada.entrega.cod_entrega}
            </p>
            <p className="mb-1">
              <strong>Cliente:</strong>{' '}
              {entregaSeleccionada.obra.cliente?.razon_social}
            </p>
            <p className="break-words">
              <strong>Dirección:</strong> {entregaSeleccionada.obra.direccion}
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="observaciones"
              className="block text-xs font-medium text-gray-700 lg:text-sm"
            >
              Observaciones finales (opcional)
            </label>
            <textarea
              id="observaciones"
              placeholder="Agregar observaciones sobre la entrega..."
              value={observaciones}
              onChange={(e) => onObservacionesChange(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-xs shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none lg:text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col space-y-2 rounded-b-lg border-t bg-gray-50 p-4 sm:flex-row sm:space-y-0 sm:space-x-3 lg:p-6">
          <button
            onClick={onCancel}
            className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none lg:text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-md border border-transparent bg-green-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none lg:text-sm"
          >
            Confirmar Entrega
          </button>
        </div>
      </div>
    </div>
  )
}
