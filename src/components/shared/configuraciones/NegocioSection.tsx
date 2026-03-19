import { Building } from 'lucide-react'

interface NegocioSectionProps {
  negocio: {
    presupuesto: string;
    viaticos: string;
    checkboxEjemplo: boolean;
  };
  onChange: (field: string, value: string | boolean) => void;
  disabled?: boolean;
}

export function NegocioSection({ negocio, onChange, disabled }: NegocioSectionProps) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white shadow-sm ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-indigo-100 p-2">
            <Building className="h-5 w-5 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Negocio</h3>
        </div>
      </div>
      <div className="space-y-4 p-6">
        <label className="flex cursor-pointer items-center justify-between">
          <span className="text-gray-700">Checkbox para algo</span>
          <input
            type="checkbox"
            checked={negocio.checkboxEjemplo}
            onChange={(e) => onChange('checkboxEjemplo', e.target.checked)}
            disabled={disabled}
            className="rounded text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
          />
        </label>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Días de vigencia del presupuesto
          </label>
          <input
            type="number"
            value={negocio.presupuesto}
            onChange={(e) => onChange('presupuesto', e.target.value)}
            disabled={disabled}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            min="0"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Costo de Viático por día
          </label>
          <input
            type="number"
            step="0.01"
            value={negocio.viaticos}
            onChange={(e) => onChange('viaticos', e.target.value)}
            disabled={disabled}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            min="0"
          />
        </div>
      </div>
    </div>
  )
}
