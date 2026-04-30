'use client'

import { Package } from 'lucide-react'
import type { OrdenProduccion } from '@/types'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OrdenProduccionSeccionProps {
  ordenes: OrdenProduccion[]
  activeIndex: number
  onIndexChange: (index: number) => void
  onVerDocumento: (url: string, title: string) => void
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function OrdenProduccionSeccion({
  ordenes,
  activeIndex,
  onIndexChange,
  onVerDocumento,
}: OrdenProduccionSeccionProps) {
  if (!ordenes || ordenes.length === 0) return null

  const activeOp: OrdenProduccion = ordenes[activeIndex] ?? ordenes[0]

  return (
    <div className="rounded-xl border border-purple-200 bg-purple-50 p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-purple-900 uppercase">
          <Package className="h-4 w-4" />
          {ordenes.length === 1
            ? 'Orden de Producción Asociada'
            : `Órdenes de Producción (${ordenes.length})`}
        </h3>
      </div>

      <div className="flex flex-row items-start justify-between gap-4 sm:flex-col sm:gap-4">
        {/* Tabs si hay más de 1 OP */}
        {ordenes.length > 1 && (
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-1.5">
            {ordenes.map((op, idx) => (
              <button
                key={op.cod_op}
                type="button"
                onClick={() => onIndexChange(idx)}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition-all sm:rounded-full sm:px-3 sm:py-1 sm:text-xs ${
                  activeIndex === idx
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                OP #{op.cod_op}
              </button>
            ))}
          </div>
        )}

        {/* Info de la OP activa */}
        <div className="flex flex-col items-end gap-3 sm:w-full sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-right sm:text-left">
            <div className="hidden rounded-lg bg-purple-100 p-2 sm:block">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-purple-600/80">
                Orden Seleccionada
              </p>
              <p className="text-lg font-bold text-purple-900">
                OP #{activeOp.cod_op}
              </p>
              <p className="text-xs text-purple-600/70">
                Confeccionada:{' '}
                {new Date(activeOp.fecha_confeccion).toLocaleDateString(
                  'es-AR'
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              onVerDocumento(
                activeOp.url,
                `Orden de Producción #${activeOp.cod_op}`
              )
            }
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-purple-700"
          >
            Ver Documento
          </button>
        </div>
      </div>
    </div>
  )
}
