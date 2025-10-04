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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-6">
      {/* Overlay */}
      <div
        className="bg-opacity-50 absolute inset-0 bg-transparent backdrop-blur-sm"
        onClick={!loading ? onCancel : undefined}
      />

      {/* Modal responsivo */}
      <div className="relative w-full max-w-lg rounded-lg bg-white shadow-xl lg:max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-5 lg:p-7">
          <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl">
            {title}
          </h3>
          <button
            onClick={!loading ? onCancel : undefined}
            disabled={loading}
            className="text-gray-400 transition-colors hover:text-gray-600 disabled:cursor-not-allowed"
          >
            <X className="h-6 w-6 lg:h-7 lg:w-7" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 p-5 lg:space-y-6 lg:p-7">
          <div className="space-y-3">
            <label
              htmlFor="observaciones"
              className="block text-sm font-medium text-gray-700 lg:text-base"
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
              className="w-full resize-none rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 lg:px-5 lg:py-4 lg:text-base"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col space-y-3 rounded-b-lg border-t bg-gray-50 p-5 sm:flex-row sm:space-y-0 sm:space-x-4 lg:p-7">
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
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent lg:h-5 lg:w-5"></div>
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
