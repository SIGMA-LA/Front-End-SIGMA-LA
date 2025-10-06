import React from 'react'

interface ConfirmDeleteModalProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  loading?: boolean
  message?: string
  monto?: number
  fecha_pago?: string
}

export default function ConfirmDeleteModal({
  open,
  onCancel,
  onConfirm,
  loading = false,
  message = '¿Seguro que deseas eliminar este pago?',
  monto,
  fecha_pago,
}: ConfirmDeleteModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <h3 className="mb-4 text-xl font-semibold text-gray-900">
          Confirmar eliminación de pago
        </h3>
        <p className="mb-4 text-gray-700">{message}</p>
        {(monto !== undefined || fecha_pago) && (
          <div className="mb-6 rounded bg-blue-50 px-4 py-3 text-gray-800">
            {monto !== undefined && (
              <div>
                <span className="font-semibold">Monto:</span> $
                {monto.toLocaleString('es-AR')}
              </div>
            )}
            {fecha_pago && (
              <div>
                <span className="font-semibold">Fecha:</span>{' '}
                {new Date(fecha_pago).toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </div>
            )}
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            disabled={loading}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
