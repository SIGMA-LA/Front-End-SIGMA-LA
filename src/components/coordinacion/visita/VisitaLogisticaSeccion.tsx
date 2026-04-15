'use client'

import { Car } from 'lucide-react'
import type { Vehiculo } from '@/types'

interface VisitaLogisticaSeccionProps {
  vehiculos: Vehiculo[]
  vehiculoAsignado: string
  onDesvincular: () => void
  onAsignarClick: () => void
}

/**
 * Modular section for vehicle assignment and logistics in the visit creation form.
 */
export default function VisitaLogisticaSeccion({
  vehiculos,
  vehiculoAsignado,
  onDesvincular,
  onAsignarClick,
}: VisitaLogisticaSeccionProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
        <div className="rounded-lg bg-emerald-100/80 p-2 shadow-inner">
          <Car className="h-5 w-5 text-emerald-600" />
        </div>
        <h3 className="font-semibold text-slate-800">Logística y Movilidad</h3>
      </div>
      <div className="p-5">
        <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/30 to-white p-4 shadow-sm h-[72px] flex flex-col justify-center">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 flex flex-col justify-center">
              <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-1">
                Vehículo Asignado
              </span>
              {vehiculoAsignado ? (
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-md bg-white border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800 shadow-sm h-[26px]">
                    {(() => {
                      const veh = vehiculos.find((v) => v.patente === vehiculoAsignado)
                      return veh ? `${veh.tipo_vehiculo} - ${veh.patente}` : vehiculoAsignado
                    })()}
                  </span>
                  <button
                    type="button"
                    onClick={onDesvincular}
                    className="text-xs font-medium text-red-500 hover:text-red-700 hover:underline h-[26px] flex items-center"
                  >
                    Desvincular
                  </button>
                </div>
              ) : (
                <span className="text-slate-400 text-sm italic h-[26px] flex items-center">
                  Ningún vehículo asignado por el momento.
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onAsignarClick}
              className="flex-shrink-0 rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm hover:bg-emerald-600 transition-all h-[32px] flex items-center"
            >
              Asignar Flota
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
