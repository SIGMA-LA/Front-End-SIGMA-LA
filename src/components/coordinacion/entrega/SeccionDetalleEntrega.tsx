'use client'

import { MapPin, Building2 } from 'lucide-react'
import type { Obra, OrdenProduccion } from '@/types'
import ObraSearchSelect from '@/components/shared/ObraSearchSelect'
import OrdenesProduccionSelector from './OrdenesProduccionSelector'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SeccionDetalleEntregaProps {
  esFinal: boolean
  setEsFinal: (v: boolean) => void
  obraId: number | null
  direccion: string | null
  detalle: string
  onObraChange: (obraId: number | null, direccion: string) => void
  onDetalleChange: (v: string) => void
  onBuscarObras: (query: string) => Promise<Obra[] | { data: Obra[] }>
  availableOPs: OrdenProduccion[]
  selectedOPs: number[]
  onToggleOP: (codOp: number, checked: boolean) => void
  onVerDocumento: (url: string, title: string) => void
  isFetchingOPs: boolean
  isFromObra: boolean
  isEditMode: boolean
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SeccionDetalleEntrega({
  esFinal,
  setEsFinal,
  obraId,
  direccion,
  detalle,
  onObraChange,
  onDetalleChange,
  onBuscarObras,
  availableOPs,
  selectedOPs,
  onToggleOP,
  onVerDocumento,
  isFetchingOPs,
  isFromObra,
  isEditMode,
}: SeccionDetalleEntregaProps) {
  return (
    <div className="mb-6 rounded-2xl border border-slate-200/60 bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md">
      <div className="flex items-center gap-3 rounded-t-2xl border-b border-slate-100 bg-slate-50/50 px-5 py-4">
        <div className="rounded-lg bg-emerald-100/80 p-2 shadow-inner">
          <MapPin className="h-5 w-5 text-emerald-600" />
        </div>
        <h3 className="font-semibold text-slate-800">Ubicación y Detalle</h3>
      </div>

      <div className="space-y-5 p-5">
        {/* Tipo de entrega toggle */}
        {!isFromObra && (
          <div>
            <label className="mb-2 block text-xs font-bold tracking-wider text-slate-500 uppercase">
              Tipo de Entrega *
            </label>
            <div className="mb-4 flex w-full rounded-xl bg-slate-100 p-1 md:w-max">
              <button
                type="button"
                disabled={isEditMode}
                onClick={() => {
                  setEsFinal(false)
                  if (obraId) onObraChange(null, '')
                }}
                className={`flex-1 rounded-lg px-6 py-2 text-sm font-semibold transition-all md:flex-none ${
                  !esFinal
                    ? 'border border-indigo-100 bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                } ${isEditMode ? 'cursor-not-allowed opacity-70' : ''}`}
              >
                Entrega Parcial
              </button>
              <button
                type="button"
                disabled={isEditMode}
                onClick={() => {
                  setEsFinal(true)
                  if (obraId) onObraChange(null, '')
                }}
                className={`flex-1 rounded-lg px-6 py-2 text-sm font-semibold transition-all md:flex-none ${
                  esFinal
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-700'
                } ${isEditMode ? 'cursor-not-allowed opacity-70' : ''}`}
              >
                Entrega Final
              </button>
            </div>
          </div>
        )}

        {/* Obra selector */}
        <div>
          <label className="mb-2 block text-xs font-bold tracking-wider text-slate-500 uppercase">
            Obra programada *
          </label>
          {direccion ? (
            <div className="flex items-center justify-between rounded-xl border-2 border-indigo-200 bg-indigo-50/50 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 shadow-inner">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="text-left leading-tight">
                  <span className="block font-bold text-indigo-900">{direccion}</span>
                  <span className="text-xs font-medium text-indigo-600">Obra Seleccionada</span>
                </div>
              </div>
              {!isEditMode && !isFromObra && (
                <button
                  type="button"
                  onClick={() => onObraChange(null, '')}
                  className="text-xs font-bold text-indigo-600 underline transition-colors hover:text-indigo-800"
                >
                  Cambiar
                </button>
              )}
            </div>
          ) : (
            <ObraSearchSelect
              key={esFinal ? 'final' : 'parcial'}
              buscarObras={onBuscarObras}
              onSelectObra={(obra: Obra) => onObraChange(obra.cod_obra, obra.direccion)}
              placeholder={
                esFinal
                  ? 'Buscar obra PAGADA TOTALMENTE...'
                  : 'Buscar obra por dirección o cliente...'
              }
            />
          )}
        </div>

        {/* OPs selector */}
        {obraId && (
          <OrdenesProduccionSelector
            isFetchingOPs={isFetchingOPs}
            availableOPs={availableOPs}
            selectedOPs={selectedOPs}
            onToggleOP={onToggleOP}
            onVerDocumento={onVerDocumento}
          />
        )}

        {/* Detalle textarea */}
        <div>
          <label className="mb-2 block text-xs font-bold tracking-wider text-slate-500 uppercase">
            Detalle de la Entrega *
          </label>
          <textarea
            name="detalle"
            value={detalle}
            onChange={(e) => onDetalleChange(e.target.value)}
            required
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-300 bg-white p-3 text-slate-700 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            placeholder="Describa el material o equipos a entregar..."
          />
        </div>
      </div>
    </div>
  )
}
