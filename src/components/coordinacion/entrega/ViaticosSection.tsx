'use client'

import { DollarSign } from 'lucide-react'

interface ViaticosSectionProps {
  descripcionUso: string
  onDescripcionChange: (value: string) => void
  diasViaticos: string
  onDiasViaticosChange: (value: string) => void
  totalViaticos: number
  formatCurrency: (amount: number) => string
  viaticoPorDia: number
  numAcompanantes: number
  hayEncargado: boolean
}

export default function ViaticosSection({
  descripcionUso,
  onDescripcionChange,
  diasViaticos,
  onDiasViaticosChange,
  totalViaticos,
  formatCurrency,
  viaticoPorDia,
  numAcompanantes,
  hayEncargado,
}: ViaticosSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Descripción uso:
        </label>
        <input
          type="text"
          value={descripcionUso}
          onChange={(e) => onDescripcionChange(e.target.value)}
          placeholder="Ej: Colocación de aberturas"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Días de viáticos (opcional):
        </label>
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={diasViaticos}
            onChange={(e) => onDiasViaticosChange(e.target.value)}
            placeholder="Ej: 3"
            className="w-24 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            min="0"
          />
          <div className="flex flex-grow items-center gap-2 rounded-lg bg-blue-50 p-2 text-blue-800">
            <DollarSign className="h-5 w-5 flex-shrink-0" />
            <span className="text-lg font-semibold">
              {formatCurrency(totalViaticos)}
            </span>
          </div>
        </div>
        {viaticoPorDia > 0 && Number(diasViaticos) > 0 && hayEncargado && (
          <p className="mt-1 text-xs text-gray-500">
            Cálculo: {diasViaticos} días x {1 + numAcompanantes} personas x{' '}
            {formatCurrency(viaticoPorDia)} p/día
          </p>
        )}
      </div>
    </div>
  )
}
