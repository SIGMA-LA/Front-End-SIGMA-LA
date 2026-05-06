'use client'

import { CheckSquare, Square, Info } from 'lucide-react'
import type { OrdenProduccion } from '@/types'

interface VisitaOPSelectionProps {
  eligibleOps: OrdenProduccion[]
  selectedOps: number[]
  onChange: (selected: number[]) => void
  isLoading?: boolean
}

export default function VisitaOPSelection({
  eligibleOps,
  selectedOps,
  onChange,
  isLoading = false,
}: VisitaOPSelectionProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
        <span className="ml-3 text-sm text-slate-500">Cargando órdenes de producción...</span>
      </div>
    )
  }

  if (eligibleOps.length === 0) return null

  const toggleOp = (cod_op: number) => {
    if (selectedOps.includes(cod_op)) {
      onChange(selectedOps.filter((id) => id !== cod_op))
    } else {
      onChange([...selectedOps, cod_op])
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-indigo-100/80 p-2 shadow-inner">
            <CheckSquare className="h-5 w-5 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-slate-800">Órdenes de Producción a Validar</h3>
        </div>
        <span className="text-xs font-medium text-slate-400 bg-white px-2 py-1 rounded-full border border-slate-100">
          {selectedOps.length} seleccionadas
        </span>
      </div>
      
      <div className="p-5">
        <p className="text-sm text-slate-500 mb-4 flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
          Seleccione las órdenes de producción que serán verificadas durante esta visita técnica.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {eligibleOps.map((op) => {
            const isSelected = selectedOps.includes(op.cod_op)
            return (
              <button
                key={op.cod_op}
                type="button"
                onClick={() => toggleOp(op.cod_op)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`flex-shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-300'}`}>
                  {isSelected ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-grow">
                  <p className={`text-sm font-bold truncate ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                    Orden #{op.cod_op}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {op.obra?.direccion || 'Sin dirección'}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
