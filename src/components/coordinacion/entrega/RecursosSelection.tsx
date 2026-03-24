'use client'

import type { Maquinaria } from '@/types'
import { Truck, Wrench } from 'lucide-react'

interface RecursosSelectionProps {
  selectedVehiculos: string[]
  onSelectVehiculosClick: () => void
  selectedMaquinaria: string[]
  onSelectMaquinariaClick: () => void
  maquinarias: Maquinaria[]
  loadingDisponibilidad?: boolean
}

export default function RecursosSelection({
  selectedVehiculos,
  onSelectVehiculosClick,
  selectedMaquinaria,
  onSelectMaquinariaClick,
  maquinarias,
  loadingDisponibilidad = false,
}: RecursosSelectionProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md mb-6">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/50 px-5 py-4">
        <div className="rounded-lg bg-rose-100/80 p-2 shadow-inner">
          <Truck className="h-5 w-5 text-rose-600" />
        </div>
        <h3 className="font-semibold text-slate-800">Recursos de Flota</h3>
      </div>
      
      <div className="p-5 flex flex-col gap-5">
        
        {/* Vehículos Block */}
        <div className="rounded-xl border border-rose-100 bg-gradient-to-br from-rose-50/50 to-white p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div className="flex-1">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-500 mb-2">
                  <Truck className="h-3 w-3" />
                  Vehículos ({selectedVehiculos.length})
                </span>
                {selectedVehiculos.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedVehiculos.map((v) => (
                      <span key={v} className="inline-flex items-center rounded-md bg-white border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-700 shadow-sm">
                        {v}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-400 text-sm italic">Flota pendiente</span>
                )}
             </div>
             <button
               type="button"
               onClick={onSelectVehiculosClick}
               className="flex-shrink-0 rounded-lg bg-rose-500 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-rose-600 transition-all self-start sm:self-center"
             >
               {loadingDisponibilidad ? 'Cargando...' : 'Elegir Vehículos'}
             </button>
          </div>
        </div>

        {/* Maquinaria Block */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  <Wrench className="h-3 w-3" />
                  Maquinaria Especial ({selectedMaquinaria.length})
                </span>
                {selectedMaquinaria.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {maquinarias
                      .filter((m) => selectedMaquinaria.includes(m.cod_maquina.toString()))
                      .map((m) => (
                        <span key={m.cod_maquina} className="inline-flex items-center rounded-md bg-white border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm">
                          {m.descripcion}
                        </span>
                      ))}
                  </div>
                ) : (
                  <span className="text-slate-400 text-sm italic">Ninguna máquina adicional</span>
                )}
            </div>
            <button
               type="button"
               onClick={onSelectMaquinariaClick}
               className="flex-shrink-0 rounded-lg bg-slate-600 px-4 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-700 transition-all self-start sm:self-center"
             >
               {loadingDisponibilidad ? 'Cargando...' : 'Elegir Maquinas'}
             </button>
          </div>
        </div>

      </div>
    </div>
  )
}
