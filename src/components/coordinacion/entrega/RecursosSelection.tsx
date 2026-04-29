'use client'

import type { Maquinaria } from '@/types'
import { Truck, Wrench } from 'lucide-react'

interface RecursosSelectionProps {
  selectedVehiculos: string[]
  onSelectVehiculosClick: () => void
  onDesvincularVehiculos: () => void
  selectedMaquinaria: string[]
  onSelectMaquinariaClick: () => void
  onDesvincularMaquinaria: () => void
  maquinarias: Maquinaria[]
  loadingDisponibilidad?: boolean
}

export default function RecursosSelection({
  selectedVehiculos,
  onSelectVehiculosClick,
  onDesvincularVehiculos,
  selectedMaquinaria,
  onSelectMaquinariaClick,
  onDesvincularMaquinaria,
  maquinarias,
  loadingDisponibilidad = false,
}: RecursosSelectionProps) {
  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
        <div className="rounded-lg bg-rose-100/80 p-2 shadow-inner">
          <Truck className="h-5 w-5 text-rose-600" />
        </div>
        <h3 className="font-semibold text-slate-800">Recursos de Flota</h3>
      </div>

      <div className="flex flex-col gap-5 p-5">
        {/* Vehículos Block */}
        <div className="rounded-xl border border-rose-100 bg-gradient-to-br from-rose-50/50 to-white p-4 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <span className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wider text-rose-500 uppercase">
                <Truck className="h-3 w-3" />
                Vehículos ({selectedVehiculos.length})
              </span>
              {selectedVehiculos.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedVehiculos.map((v) => (
                    <span
                      key={v}
                      className="inline-flex items-center rounded-md border border-rose-200 bg-white px-3 py-1.5 text-xs font-bold text-rose-700 shadow-sm"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-slate-400 italic">
                  Flota pendiente
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 self-start sm:self-center">
              {selectedVehiculos.length > 0 && (
                <button
                  type="button"
                  onClick={onDesvincularVehiculos}
                  className="text-xs font-medium text-red-500 hover:text-red-700 hover:underline"
                >
                  Desvincular flota
                </button>
              )}
              <button
                type="button"
                onClick={onSelectVehiculosClick}
                className="flex-shrink-0 rounded-lg bg-rose-500 px-4 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-rose-600"
              >
                {loadingDisponibilidad ? 'Cargando...' : 'Elegir Vehículos'}
              </button>
            </div>
          </div>
        </div>

        {/* Maquinaria Block */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <span className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
                <Wrench className="h-3 w-3" />
                Maquinaria Especial ({selectedMaquinaria.length})
              </span>
              {selectedMaquinaria.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {maquinarias
                    .filter((m) =>
                      selectedMaquinaria.includes(m.cod_maquina.toString())
                    )
                    .map((m) => (
                      <span
                        key={m.cod_maquina}
                        className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm"
                      >
                        {m.descripcion}
                      </span>
                    ))}
                </div>
              ) : (
                <span className="text-sm text-slate-400 italic">
                  Ninguna máquina adicional
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 self-start sm:self-center">
              {selectedMaquinaria.length > 0 && (
                <button
                  type="button"
                  onClick={onDesvincularMaquinaria}
                  className="text-xs font-medium text-red-500 hover:text-red-700 hover:underline"
                >
                  Desvincular maquinaria
                </button>
              )}
              <button
                type="button"
                onClick={onSelectMaquinariaClick}
                className="flex-shrink-0 rounded-lg bg-slate-600 px-4 py-1.5 text-xs font-medium text-white shadow-sm transition-all hover:bg-slate-700"
              >
                {loadingDisponibilidad ? 'Cargando...' : 'Elegir Maquinas'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
