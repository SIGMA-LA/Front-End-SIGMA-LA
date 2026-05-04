'use client'

import { AlertTriangle, Loader2, X } from 'lucide-react'

interface ConfirmDeleteModalProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  loading?: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  warningContent?: React.ReactNode
  disableConfirm?: boolean
  confirmDisabledMessage?: string
}

export default function ConfirmDeleteModal({
  open,
  onCancel,
  onConfirm,
  loading = false,
  title = 'Confirmar eliminación',
  message = '¿Está seguro que desea eliminar este elemento? Esta acción no se puede deshacer.',
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  warningContent,
  disableConfirm = false,
  confirmDisabledMessage,
}: ConfirmDeleteModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Message */}
        <div className="mb-6">
          <p className="text-gray-700">{message}</p>
        </div>

        {warningContent}

        {/* Warning */}
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-800">
            <strong>Advertencia:</strong> Esta acción puede ser revertida únicamente contactando soporte.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading || disableConfirm}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-medium text-white transition-colors disabled:cursor-not-allowed ${disableConfirm
                ? 'bg-gray-400 hover:bg-gray-400'
                : 'bg-red-600 hover:bg-red-700 disabled:bg-red-400'
              }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Eliminando...
              </>
            ) : disableConfirm && confirmDisabledMessage ? (
              confirmDisabledMessage
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
