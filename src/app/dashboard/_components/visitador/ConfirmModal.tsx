'use client'

import { X } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  observaciones: string
  onObservacionesChange: (value: string) => void
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export default function ConfirmModal({
  isOpen,
  title,
  observaciones,
  onObservacionesChange,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="bg-opacity-50 absolute inset-0 bg-transparent backdrop-blur-sm"
        onClick={!loading ? onCancel : undefined}
      />

      {/* Modal responsivo */}
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-xl lg:max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4 lg:p-6">
          <h3 className="text-base font-semibold text-gray-800 lg:text-lg">
            {title}
          </h3>
          <button
            onClick={!loading ? onCancel : undefined}
            disabled={loading}
            className="text-gray-400 transition-colors hover:text-gray-600 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 p-4 lg:p-6">
          <div className="space-y-2">
            <label
              htmlFor="observaciones"
              className="block text-xs font-medium text-gray-700 lg:text-sm"
            >
              Observaciones finales (opcional)
            </label>
            <textarea
              id="observaciones"
              placeholder="Añade cualquier observación relevante..."
              value={observaciones}
              onChange={(e) => onObservacionesChange(e.target.value)}
              rows={4}
              disabled={loading}
              className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-xs shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 lg:text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col space-y-2 rounded-b-lg border-t bg-gray-50 p-4 sm:flex-row sm:space-y-0 sm:space-x-3 lg:p-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 lg:text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-md border border-transparent bg-green-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 lg:text-sm"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Finalizando...
              </div>
            ) : (
              'Confirmar'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
