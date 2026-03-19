'use client'

import type { Maquinaria } from '@/types'

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
    <>
      <div>
        <label className="mb-3 block text-sm font-medium text-gray-700">
          Vehículos Asignados
        </label>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className={`flex flex-col gap-4 sm:flex-row sm:justify-between ${selectedVehiculos.length > 0 ? 'sm:items-start' : 'sm:items-center'}`}>
            <div className="flex-1 text-sm">
              <span className="font-medium text-gray-700">
                {selectedVehiculos.length} vehículo(s) seleccionado(s)
              </span>
              {selectedVehiculos.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedVehiculos.map((v) => (
                    <span key={v} className="inline-flex items-center rounded-full bg-indigo-100 border border-indigo-200 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                      {v}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={onSelectVehiculosClick}
              className="flex-shrink-0 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {loadingDisponibilidad ? 'Verificando...' : 'Seleccionar'}
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium text-gray-700">
          Maquinaria Especial
        </label>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className={`flex flex-col gap-4 sm:flex-row sm:justify-between ${selectedMaquinaria.length > 0 ? 'sm:items-start' : 'sm:items-center'}`}>
            <div className="flex-1 text-sm">
              <span className="font-medium text-gray-700">
                {selectedMaquinaria.length} máquina(s) seleccionada(s)
              </span>
              {selectedMaquinaria.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {maquinarias
                    .filter((m) =>
                      selectedMaquinaria.includes(m.cod_maquina.toString())
                    )
                    .map((m) => (
                      <span key={m.cod_maquina} className="inline-flex items-center rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                        {m.descripcion}
                      </span>
                    ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={onSelectMaquinariaClick}
              className="flex-shrink-0 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {loadingDisponibilidad ? 'Verificando...' : 'Seleccionar'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
