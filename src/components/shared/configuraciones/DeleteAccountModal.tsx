'use client'

import { useState } from 'react'
import { X, AlertTriangle, Loader2 } from 'lucide-react'

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
}: DeleteAccountModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleClose = () => {
    if (!loading) {
      setError(null)
      onClose()
    }
  }

  const handleConfirm = async () => {
    try {
      setLoading(true)
      setError(null)
      await onConfirm()
      handleClose()
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Ocurrió un error al intentar eliminar la cuenta.'
      )
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-bold text-gray-900">
              ¿Eliminar cuenta?
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Esta acción es irreversible. Todos tus datos, configuraciones y acceso al sistema se perderán permanentemente.
            </p>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-50 sm:w-auto"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-700 active:scale-95 disabled:opacity-50 sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Sí, eliminar cuenta'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
