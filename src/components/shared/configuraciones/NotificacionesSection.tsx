import { Bell } from 'lucide-react'

export interface NotificationOption {
  id: string;
  label: string;
  description?: string;
}

interface NotificacionesSectionProps {
  options: NotificationOption[];
  values: Record<string, boolean>;
  onChange: (field: string, value: boolean) => void;
  disabled?: boolean;
}

export function NotificacionesSection({ options, values, onChange, disabled }: NotificacionesSectionProps) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white shadow-sm ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-green-100 p-2">
            <Bell className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Notificaciones
          </h3>
        </div>
      </div>
      <div className="space-y-2 p-4">
        {options.map((option) => (
          <label key={option.id} className="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-gray-50 transition-colors">
            <div className="flex flex-col">
              <span className="text-gray-700 font-medium">{option.label}</span>
              {option.description && (
                <span className="text-sm text-gray-500">{option.description}</span>
              )}
            </div>
            <input
              type="checkbox"
              checked={!!values[option.id]}
              onChange={(e) => onChange(option.id, e.target.checked)}
              disabled={disabled}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
            />
          </label>
        ))}
        {options.length === 0 && (
          <div className="text-sm text-gray-500 italic p-2">No hay opciones de notificaciones disponibles.</div>
        )}
      </div>
    </div>
  )
}
