import { Bell } from 'lucide-react'

interface NotificacionesSectionProps {
  notificaciones: {
    email: boolean;
    push: boolean;
    visitas: boolean;
    entregas: boolean;
    vencimientos: boolean;
  };
  onChange: (field: string, value: boolean) => void;
}

export function NotificacionesSection({ notificaciones, onChange }: NotificacionesSectionProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
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
      <div className="space-y-4 p-6">
        <label className="flex cursor-pointer items-center justify-between">
          <span className="text-gray-700">Notificaciones por email</span>
          <input
            type="checkbox"
            checked={notificaciones.email}
            onChange={(e) => onChange('email', e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
        </label>
        <label className="flex cursor-pointer items-center justify-between">
          <span className="text-gray-700">Notificaciones de Visitas</span>
          <input
            type="checkbox"
            checked={notificaciones.visitas}
            onChange={(e) => onChange('visitas', e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
        </label>
        <label className="flex cursor-pointer items-center justify-between">
          <span className="text-gray-700">Notificaciones de Entregas</span>
          <input
            type="checkbox"
            checked={notificaciones.entregas}
            onChange={(e) => onChange('entregas', e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
        </label>
        <label className="flex cursor-pointer items-center justify-between">
          <span className="text-gray-700">Vencimientos de presupuestos</span>
          <input
            type="checkbox"
            checked={notificaciones.vencimientos}
            onChange={(e) => onChange('vencimientos', e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
        </label>
      </div>
    </div>
  )
}
