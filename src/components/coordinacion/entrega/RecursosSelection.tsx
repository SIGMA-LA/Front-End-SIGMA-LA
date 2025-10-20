'use client'

import { Truck, Wrench } from 'lucide-react'
import { MaquinariaConDisponibilidad } from '@/services/maquinaria.service'

interface RecursosSelectionProps {
  selectedVehiculos: string[]
  onSelectVehiculosClick: () => void
  selectedMaquinaria: string[]
  onSelectMaquinariaClick: () => void
  maquinarias: MaquinariaConDisponibilidad[]
  loadingDisponibilidad: boolean
}

export default function RecursosSelection({
  selectedVehiculos,
  onSelectVehiculosClick,
  selectedMaquinaria,
  onSelectMaquinariaClick,
  maquinarias,
  loadingDisponibilidad,
}: RecursosSelectionProps) {
  return (
    <>
      <div>
        <label className="mb-3 block text-sm font-medium text-gray-700">
          <Truck className="mr-1 inline h-4 w-4" />
          Vehículos Asignados
        </label>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">
                {selectedVehiculos.length} vehículo(s) seleccionado(s)
              </p>
              {selectedVehiculos.length > 0 && (
                <p className="text-xs text-gray-500">
                  {selectedVehiculos.join(', ')}
                </p>
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
          <Wrench className="mr-1 inline h-4 w-4" />
          Maquinaria Especial
        </label>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">
                {selectedMaquinaria.length} máquina(s) seleccionada(s)
              </p>
              {selectedMaquinaria.length > 0 && (
                <p className="text-xs text-gray-500">
                  {maquinarias
                    .filter((m) =>
                      selectedMaquinaria.includes(m.cod_maquina.toString())
                    )
                    .map((m) => m.descripcion)
                    .join(', ')}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onSelectMaquinariaClick}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {loadingDisponibilidad ? 'Verificando...' : 'Seleccionar'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
