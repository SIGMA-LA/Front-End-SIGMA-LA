'use client'

import { useState, useTransition } from 'react'
import { X, AlertCircle, Loader2 } from 'lucide-react'
import { rejectOrdenProduccion } from '@/actions/ordenes'
import { notify } from '@/lib/toast'

interface RechazarOPModalProps {
  isOpen: boolean
  onClose: () => void
  cod_op: number
}

export default function RechazarOPModal({ isOpen, onClose, cod_op }: RechazarOPModalProps) {
  const [motivo, setMotivo] = useState('')
  const [isPending, startTransition] = useTransition()

  if (!isOpen) return null

  const handleConfirm = () => {
    if (!motivo.trim()) {
      notify.error('Debe proporcionar un motivo para el rechazo.')
      return
    }

    startTransition(async () => {
      const res = await rejectOrdenProduccion(cod_op, motivo)
      if (res.success) {
        notify.success('Orden rechazada correctamente.')
        onClose()
      } else {
        notify.error(res.error || 'Error al rechazar la orden.')
      }
    })
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="font-bold text-slate-800">Rechazar Orden</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600">
            Explique el motivo del rechazo. Esta información será visible para el equipo de producción para que puedan corregir la orden.
          </p>
          
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Motivo del rechazo *
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full min-h-[120px] rounded-xl border border-slate-200 p-4 text-sm focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10 placeholder:text-slate-400"
              placeholder="Ej: Las medidas no coinciden con la visita del 05/05..."
              autoFocus
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2 text-sm font-bold text-white shadow-md hover:bg-red-700 transition-all disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Confirmar Rechazo'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
