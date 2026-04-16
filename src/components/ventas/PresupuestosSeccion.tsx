'use client'

import { Layers, FileText, Plus, Edit } from 'lucide-react'
import type { PresupuestoFormData } from '@/components/ventas/CrearObra'

interface PresupuestosSeccionProps {
  presupuestos: PresupuestoFormData[]
  onOpenModalParaCrear: () => void
  onOpenModalParaEditar: (presupuesto: PresupuestoFormData) => void
  hayPresupuestoAceptado: boolean
  disabled?: boolean
}

export default function PresupuestosSeccion({
  presupuestos,
  onOpenModalParaCrear,
  onOpenModalParaEditar,
  hayPresupuestoAceptado,
  disabled = false,
}: PresupuestosSeccionProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b-2 border-slate-50 pb-2">
        <div className="flex items-center gap-3">
          <Layers className="h-6 w-6 text-emerald-500" />
          <h3 className="text-lg font-bold text-slate-800">Presupuestos</h3>
        </div>
      </div>

      <div className="relative flex h-[360px] flex-col rounded-2xl border border-slate-200/60 bg-slate-50/50 p-4 shadow-inner">
        <div className="scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300 flex-1 space-y-3 overflow-y-auto pr-2">
          {presupuestos.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 p-6 text-center">
              <div className="rounded-full bg-white p-4 text-slate-200 shadow-sm">
                <FileText className="h-10 w-10" />
              </div>
              <p className="text-[13px] font-semibold text-slate-400">
                Sin presupuestos activos
              </p>
            </div>
          ) : (
            presupuestos.map((p, idx) => (
              <div
                key={p.nro_presupuesto || idx}
                className="group animate-in zoom-in-95 flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:border-emerald-200 hover:shadow-md"
              >
                <div className="min-w-0">
                  <p className="text-[15px] leading-tight font-bold text-slate-900">
                    ${p.valor.toLocaleString()}
                  </p>
                  <p className="mt-1 text-[10px] font-bold tracking-tighter text-slate-400 uppercase">
                    Emitido: {new Date(p.fecha_emision).toLocaleDateString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenModalParaEditar(p)}
                  className="rounded-xl p-2.5 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                  disabled={disabled}
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={onOpenModalParaCrear}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-xs font-bold text-white shadow-xl transition-all hover:bg-emerald-700 active:scale-[0.97] disabled:opacity-50 disabled:grayscale"
            disabled={disabled || hayPresupuestoAceptado}
          >
            <Plus className="h-4 w-4" />
            NUEVO PRESUPUESTO
          </button>
        </div>
      </div>
    </div>
  )
}
