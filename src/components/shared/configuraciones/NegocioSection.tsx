import { Building, AlertCircle } from 'lucide-react'
import { useState } from 'react'

interface NegocioSectionProps {
  negocio: {
    presupuesto: string
    viaticos: string
    checkboxEjemplo: boolean
  }
  onChange: (field: string, value: string | boolean) => void
  disabled?: boolean
}

export function NegocioSection({
  negocio,
  onChange,
  disabled,
}: NegocioSectionProps) {
  const [errors, setErrors] = useState<Record<string, string | null>>({
    presupuesto: null,
    viaticos: null,
  })

  const validateAndChange = (field: string, value: string) => {
    // Siempre permitimos que el valor cambie en el input para que el usuario pueda corregir,
    // pero validamos para mostrar el estado de error.
    onChange(field, value)

    if (value === '') {
      setErrors((prev) => ({ ...prev, [field]: 'Este campo es requerido' }))
      return
    }

    const numValue = parseFloat(value)
    
    if (isNaN(numValue)) {
      setErrors((prev) => ({ ...prev, [field]: 'Debe ser un número válido' }))
    } else if (numValue <= 0) {
      setErrors((prev) => ({ ...prev, [field]: 'Debe ser mayor a 0' }))
    } else {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white shadow-sm ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
    >
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-indigo-100 p-2">
            <Building className="h-5 w-5 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Negocio</h3>
        </div>
      </div>
      <div className="space-y-4 p-6">
        {/* Presupuesto */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Días de vigencia del presupuesto
          </label>
          <div className="relative">
            <input
              type="number"
              value={negocio.presupuesto}
              onChange={(e) => validateAndChange('presupuesto', e.target.value)}
              disabled={disabled}
              className={`w-full rounded-lg border px-3 py-2 transition-all outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.presupuesto
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
              min="1"
              placeholder="Ej: 10"
            />
            {errors.presupuesto && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.presupuesto ? (
            <p className="mt-1 text-xs font-medium text-red-600">{errors.presupuesto}</p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">Debe ser un número mayor a 0</p>
          )}
        </div>

        {/* Viáticos */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Costo de Viático por día
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              value={negocio.viaticos}
              onChange={(e) => validateAndChange('viaticos', e.target.value)}
              disabled={disabled}
              className={`w-full rounded-lg border px-3 py-2 transition-all outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.viaticos
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
              min="0.01"
              placeholder="Ej: 50.00"
            />
            {errors.viaticos && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.viaticos ? (
            <p className="mt-1 text-xs font-medium text-red-600">{errors.viaticos}</p>
          ) : (
            <p className="mt-1 text-xs text-gray-500">Debe ser un número mayor a 0</p>
          )}
        </div>
      </div>
    </div>
  )
}
