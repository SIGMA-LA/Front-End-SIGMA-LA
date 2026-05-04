'use client'

import { X, AlertCircle } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  observaciones: string
  onObservacionesChange: (value: string) => void
  onConfirm: () => void
  onCancel: () => void
  onCancelVisit: () => void
  loading?: boolean
}

export default function ConfirmModal({
  isOpen,
  title,
  observaciones,
  onObservacionesChange,
  onConfirm,
  onCancel,
  onCancelVisit,
  loading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-6">
      <div
        className="bg-opacity-50 absolute inset-0 bg-transparent backdrop-blur-sm"
        onClick={!loading ? onCancel : undefined}
      />
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl lg:max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 p-5 lg:p-7">
          <h3 className="text-lg font-bold text-gray-800 lg:text-2xl">
            {title}
          </h3>
          <button
            onClick={!loading ? onCancel : undefined}
            disabled={loading}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>
        </div>
        <div className="space-y-5 p-5 lg:space-y-6 lg:p-7">
          <div className="space-y-3">
            <label
              htmlFor="observaciones"
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 lg:text-base"
            >
              Observaciones / Medidas / Motivo
              <span className="text-red-500" title="Campo obligatorio">*</span>
            </label>
            <textarea
              id="observaciones"
              placeholder="Añade las medidas tomadas o el motivo por el cual no se pudo realizar la visita..."
              value={observaciones}
              onChange={(e) => onObservacionesChange(e.target.value)}
              rows={4}
              disabled={loading}
              className={`w-full resize-none rounded-xl border px-4 py-3 text-sm shadow-sm transition-all focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 lg:px-5 lg:py-4 lg:text-base ${
                !observaciones.trim()
                  ? 'border-amber-300 bg-amber-50/30 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10'
                  : 'border-gray-300 bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10'
              }`}
            />
            {!observaciones.trim() && (
              <div className="flex items-start gap-3 rounded-xl border border-amber-200/60 bg-amber-50 p-4 text-sm text-amber-800 shadow-sm mt-2">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                <p className="leading-relaxed">
                  Por favor, ingresá las <strong>medidas tomadas</strong> o el <strong>motivo de cancelación</strong> para poder finalizar el reporte.
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col space-y-3 rounded-b-lg border-t bg-gray-50 p-5 sm:flex-row-reverse sm:space-y-0 sm:space-x-4 sm:space-x-reverse lg:p-7">
          <button
            onClick={onConfirm}
            disabled={loading || !observaciones.trim()}
            className="flex-1 rounded-md border border-transparent bg-green-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 lg:px-6 lg:py-4 lg:text-base"
          >
            {loading ? 'Procesando...' : 'Visita Realizada'}
          </button>
          <button
            onClick={onCancelVisit}
            disabled={loading || !observaciones.trim()}
            className="flex-1 rounded-md border border-red-300 bg-red-50 px-5 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 focus:ring-2 focus:ring-red-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 lg:px-6 lg:py-4 lg:text-base"
          >
            {loading ? 'Procesando...' : 'No se Pudo Realizar'}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:flex-initial"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
