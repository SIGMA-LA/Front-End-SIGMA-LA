'use client'

import { X, RotateCcw, AlertCircle } from 'lucide-react'

interface ReSolicitarModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading: boolean
}

export default function ReSolicitarModal({
  isOpen,
  onClose,
  onConfirm,
  loading
}: ReSolicitarModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={!loading ? onClose : undefined}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <RotateCcw className="h-7 w-7" />
          </div>
          
          <h3 className="mb-2 text-xl font-bold text-gray-900">
            ¿Confirmar re-solicitud?
          </h3>
          
          <p className="mb-6 text-sm text-gray-500">
            La medición volverá a estar pendiente de agendar por Coordinación.
          </p>

          <div className="flex w-full gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Procesando
                </>
              ) : (
                'Confirmar'
              )}
            </button>
          </div>
        </div>

        {!loading && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  )
}
