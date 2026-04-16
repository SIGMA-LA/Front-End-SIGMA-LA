'use client'

import { Bell, User, Building, Shield } from 'lucide-react'

export interface NotificacionesConfig {
  email: boolean
  push: boolean
  visitas: boolean
  entregas: boolean
  vencimientos: boolean
}

export interface PerfilConfig {
  nombre: string
  apellido: string
  cuil: string
}

export interface NegocioConfig {
  presupuesto: string
  viaticos: string
  checkboxEjemplo: boolean
}

interface SectionProps<T> {
  data: T
  onChange: (field: keyof T, value: string | boolean) => void
}

export function NotificacionesCard({ data, onChange }: SectionProps<NotificacionesConfig>) {
  const fields: { key: keyof NotificacionesConfig; label: string }[] = [
    { key: 'email', label: 'Notificaciones por email' },
    { key: 'push', label: 'Notificaciones push' },
    { key: 'visitas', label: 'Notificaciones de Visitas' },
    { key: 'entregas', label: 'Notificaciones de Entregas' },
    { key: 'vencimientos', label: 'Vencimientos de presupuestos' },
  ]

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-green-100 p-2">
            <Bell className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
        </div>
      </div>
      <div className="space-y-4 p-6">
        {fields.map((f) => (
          <label key={f.key} className="flex cursor-pointer items-center justify-between">
            <span className="text-gray-700">{f.label}</span>
            <input
              type="checkbox"
              checked={data[f.key]}
              onChange={(e) => onChange(f.key, e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
          </label>
        ))}
      </div>
    </div>
  )
}

export function PerfilCard({ data, onChange }: SectionProps<PerfilConfig>) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-blue-100 p-2">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Perfil</h3>
        </div>
      </div>
      <div className="space-y-4 p-6">
        {(['nombre', 'apellido', 'cuil'] as const).map((f) => (
          <div key={f}>
            <label className="mb-1 block text-sm font-medium text-gray-700 capitalize">{f}</label>
            <input
              type="text"
              value={data[f]}
              onChange={(e) => onChange(f, e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function NegocioCard({ data, onChange }: SectionProps<NegocioConfig>) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
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
            checked={data.checkboxEjemplo}
            onChange={(e) => onChange('checkboxEjemplo', e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
        </label>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Vigencia presupuesto (días)</label>
          <input
            type="number"
            value={data.presupuesto}
            onChange={(e) => onChange('presupuesto', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Costo Viático diario</label>
          <input
            type="number"
            step="0.01"
            value={data.viaticos}
            onChange={(e) => onChange('viaticos', e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  )
}

export function SeguridadCard() {
  const actions = [
    { label: 'Cambiar Contraseña', desc: 'Actualiza tu acceso', color: 'gray' },
    { label: 'Configurar 2FA', desc: 'Doble autenticación', color: 'gray' },
    { label: 'Exportar Datos', desc: 'Copia de seguridad', color: 'gray' },
    { label: 'Eliminar Cuenta', desc: 'Acción irreversible', color: 'red' },
  ]

  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">
       <div className="border-b border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-red-100 p-2"><Shield className="h-5 w-5 text-red-600" /></div>
            <h3 className="text-lg font-semibold text-gray-900">Seguridad y Datos</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {actions.map((a) => (
              <button key={a.label} className={`rounded-lg border p-4 text-left transition-colors ${a.color === 'red' ? 'border-red-200 hover:bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <div className={`font-medium ${a.color === 'red' ? 'text-red-600' : 'text-gray-900'}`}>{a.label}</div>
                <div className="mt-1 text-sm text-gray-500">{a.desc}</div>
              </button>
            ))}
          </div>
        </div>
    </div>
  )
}
