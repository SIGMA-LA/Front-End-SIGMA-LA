'use client'

import { useState, useEffect } from 'react'
import { X, Save, Ruler, Eye } from 'lucide-react'

interface MedicionesModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (mediciones: string) => void
  initialValue?: string
  mode: 'view' | 'edit'
}

export default function MedicionesModal({
  isOpen,
  onClose,
  onSubmit,
  initialValue = '',
  mode,
}: MedicionesModalProps) {
  const [mediciones, setMediciones] = useState(initialValue)

  useEffect(() => {
    if (isOpen) {
      setMediciones(initialValue)
    }
  }, [isOpen, initialValue])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(mediciones)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              {mode === 'view' ? (
                <Eye className="h-5 w-5 text-blue-600" />
              ) : (
                <Ruler className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {mode === 'view' ? 'Ver Mediciones' : 'Registrar Mediciones'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {mode === 'view' ? (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 min-h-[200px] max-h-[400px] overflow-y-auto whitespace-pre-wrap text-slate-700">
              {mediciones || 'No hay mediciones registradas.'}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700 uppercase tracking-tight">
                  Detalle de Mediciones
                </label>
                <textarea
                  value={mediciones}
                  onChange={(e) => setMediciones(e.target.value)}
                  placeholder="Ej: Abertura 1: 1.20x2.10m, Abertura 2: 0.9x2.0m..."
                  className="w-full h-48 rounded-xl border border-gray-300 p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                >
                  <Save className="h-5 w-5" />
                  Guardar Mediciones
                </button>
              </div>
            </form>
          )}

          {mode === 'view' && (
            <div className="flex justify-end pt-4">
              <button
                onClick={onClose}
                className="rounded-xl bg-slate-900 px-8 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition-all"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
