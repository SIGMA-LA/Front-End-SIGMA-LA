'use client'

import { AlertTriangle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Localidad } from '@/types'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ConfirmacionEliminarLocalidadModalProps {
  isOpen: boolean
  isPending: boolean
  apiError: string | null
  localidad: Localidad | null
  onConfirm: () => Promise<void>
  onCancel: () => void
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Confirmation modal shown before deleting a localidad.
 * Shows the localidad details and provides confirm/cancel actions.
 */
export default function ConfirmacionEliminarLocalidadModal({
  isOpen,
  isPending,
  apiError,
  localidad,
  onConfirm,
  onCancel,
}: ConfirmacionEliminarLocalidadModalProps) {
  if (!isOpen || !localidad) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div
        className="animate-in fade-in zoom-in w-full max-w-md duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Trash2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Confirmar Eliminación
                </h3>
                <p className="mt-0.5 text-sm text-red-100">
                  Esta acción no se puede deshacer
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Summary */}
            <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <SummaryRow label="Nombre" value={localidad.nombre_localidad} />
              <Divider />
              <SummaryRow
                label="Provincia"
                value={localidad.provincia?.nombre || 'N/A'}
              />
              <Divider />
              <SummaryRow label="Código" value={localidad.cod_localidad.toString()} mono />
            </div>

            {/* Warning message */}
            <div className="mt-4 flex items-start gap-3 rounded-lg bg-red-50 p-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
              <p className="text-sm text-red-900">
                Al eliminar esta localidad, se perderán todos los datos asociados.
                Esta acción es irreversible.
              </p>
            </div>

            {/* API error */}
            {apiError && (
              <div className="mt-4 flex items-start gap-3 rounded-lg bg-red-50 p-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                <div>
                  <h4 className="text-sm font-semibold text-red-900">Error al eliminar</h4>
                  <p className="mt-1 text-sm text-red-700">{apiError}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 border-gray-300 font-medium hover:bg-gray-100"
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 font-semibold shadow-md hover:from-red-700 hover:to-red-800"
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Eliminando...
                </span>
              ) : (
                'Eliminar'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Local helper subcomponents
// ---------------------------------------------------------------------------

function Divider() {
  return <div className="h-px bg-gray-200" />
}

function SummaryRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className={`text-sm ${mono ? 'font-mono text-gray-500' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  )
}