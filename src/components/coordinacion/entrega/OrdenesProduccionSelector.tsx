'use client'

import { Loader2 } from 'lucide-react'
import type { OrdenProduccion } from '@/types'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OrdenesProduccionSelectorProps {
  /** Whether the OP list is still being fetched from the API. */
  isFetchingOPs: boolean
  /** OPs available to select for this obra. */
  availableOPs: OrdenProduccion[]
  /** Currently selected OP codes. */
  selectedOPs: number[]
  /** Fired when the user checks/unchecks an OP. */
  onToggleOP: (codOp: number, checked: boolean) => void
  /** Fired when the user clicks "Ver Documento" on an OP. */
  onVerDocumento: (url: string, title: string) => void
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Selection list of finalized production orders for a given obra.
 * Each row shows the OP code + creation date with a checkbox and a
 * "Ver Documento" button.
 *
 * Extracted from CrearEntregaForm.tsx (lines 561–641).
 */
export default function OrdenesProduccionSelector({
  isFetchingOPs,
  availableOPs,
  selectedOPs,
  onToggleOP,
  onVerDocumento,
}: OrdenesProduccionSelectorProps) {
  return (
    <div className="mt-5 border-t border-slate-100 pt-5">
      <label className="mb-3 block text-xs font-bold tracking-wider text-slate-500 uppercase">
        Órdenes de Producción Finalizadas
      </label>

      {isFetchingOPs ? (
        <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Cargando documentos...
        </div>
      ) : availableOPs.length === 0 ? (
        <div className="rounded-lg border border-amber-100/50 bg-amber-50 p-3 text-sm text-slate-600 shadow-sm">
          No hay Órdenes de Producción finalizadas y sin entregar para esta obra.
          Puede continuar sin asignarlas si lo desea.
        </div>
      ) : (
        <div className="space-y-3">
          {availableOPs.map((op) => {
            const isSelected = selectedOPs.includes(op.cod_op)
            return (
              <div
                key={op.cod_op}
                className={`flex flex-col justify-between rounded-xl border p-3.5 transition-all duration-200 sm:flex-row sm:items-center ${
                  isSelected
                    ? 'ring-opacity-50 border-indigo-300 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-200'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <label className="mb-3 flex flex-grow cursor-pointer items-center gap-3 sm:mb-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => onToggleOP(op.cod_op, e.target.checked)}
                    className="h-4.5 w-4.5 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span
                      className={`block font-semibold ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}
                    >
                      OP #{op.cod_op}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      Confeccionada el:{' '}
                      {new Date(op.fecha_confeccion).toLocaleDateString()}
                    </span>
                  </div>
                </label>
                <button
                  type="button"
                  onClick={() => onVerDocumento(op.url, `Orden de Producción #${op.cod_op}`)}
                  className="w-full rounded-lg border border-indigo-200 bg-white px-4 py-2 text-center text-xs font-semibold text-indigo-700 shadow-sm transition-colors hover:border-indigo-300 hover:bg-indigo-50 sm:w-auto"
                >
                  Ver Documento
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
