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
  loading?: boolean
}

export default function FinalizarEntregaModal({
  isOpen,
  observaciones,
  onObservacionesChange,
  onConfirm,
  onCancel,
  entregaSeleccionada,
  loading = false,
}: FinalizarEntregaModalProps) {
  if (!isOpen || !entregaSeleccionada) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="bg-opacity-50 absolute inset-0 bg-transparent backdrop-blur-sm"
        onClick={!loading ? onCancel : undefined}
      />

      {/* Modal responsivo */}
      <div className="relative w-full max-w-lg rounded-lg bg-white shadow-xl lg:max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-5 lg:p-8">
          <h2 className="text-lg font-semibold text-gray-900 lg:text-2xl">
            Finalizar Entrega
          </h2>
          <button
            onClick={!loading ? onCancel : undefined}
            disabled={loading}
            className="p-1 text-gray-400 transition-colors hover:text-gray-600 disabled:cursor-not-allowed"
          >
            <X className="h-6 w-6 lg:h-7 lg:w-7" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-5 lg:p-8">
          <div className="space-y-3 rounded-lg bg-gray-50 p-4 text-sm text-gray-600 lg:text-base">
            <p className="mb-2">
              <strong className="text-gray-800">Entrega:</strong> #
              {entregaSeleccionada.entrega.cod_entrega}
            </p>
            <p className="mb-2">
              <strong className="text-gray-800">Cliente:</strong>{' '}
              {entregaSeleccionada.obra.cliente?.razon_social}
            </p>
            <p className="break-words">
              <strong className="text-gray-800">Dirección:</strong>{' '}
              {entregaSeleccionada.obra.direccion}
            </p>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="observaciones"
              className="block text-sm font-medium text-gray-700 lg:text-base"
            >
              Observaciones finales (opcional)
            </label>
            <textarea
              id="observaciones"
              placeholder="Agregar observaciones sobre la entrega..."
              value={observaciones}
              onChange={(e) => onObservacionesChange(e.target.value)}
              rows={5}
              disabled={loading}
              className="w-full resize-none rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 lg:px-5 lg:py-4 lg:text-base"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col space-y-3 rounded-b-lg border-t bg-gray-50 p-5 sm:flex-row sm:space-y-0 sm:space-x-4 lg:p-8">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 lg:px-6 lg:py-4 lg:text-base"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-md border border-transparent bg-green-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 lg:px-6 lg:py-4 lg:text-base"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Finalizando...
              </div>
            ) : (
              'Confirmar Entrega'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
