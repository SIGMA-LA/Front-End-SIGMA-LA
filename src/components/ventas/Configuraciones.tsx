'use client'

import { useState } from 'react'
import { ArrowLeft, Save, Settings } from 'lucide-react'
import { notify } from '@/lib/toast'
import { 
  NotificacionesCard, 
  PerfilCard, 
  NegocioCard, 
  SeguridadCard,
  type NotificacionesConfig,
  type PerfilConfig,
  type NegocioConfig
} from './configuraciones/SeccionesConfig'

interface ConfigState {
  notificaciones: NotificacionesConfig
  perfil: PerfilConfig
  negocio: NegocioConfig
}

export default function Configuraciones({ onBack, className = '' }: { onBack?: () => void, className?: string }) {
  const [configuraciones, setConfiguraciones] = useState<ConfigState>({
    notificaciones: {
      email: true,
      push: true,
      visitas: true,
      entregas: true,
      vencimientos: true,
    },
    perfil: {
      nombre: 'Usuario',
      apellido: 'Aberturas',
      cuil: '20-45678912-3',
    },
    negocio: {
      presupuesto: '10',
      viaticos: '50.00',
      checkboxEjemplo: true,
    },
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleConfigChange = <S extends keyof ConfigState>(
    section: S,
    field: keyof ConfigState[S],
    value: string | boolean
  ) => {
    setConfiguraciones((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as object),
        [field]: value,
      },
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      notify.success('Configuraciones guardadas exitosamente!')
    } catch {
      notify.error('Error al guardar configuraciones.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen bg-gray-50/50 ${className}`}>
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">Configuraciones</h1>
                <p className="text-sm font-medium text-gray-500">Administra tus preferencias y ajustes de negocio</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-100"
                >
                  <ArrowLeft className="h-4 w-4" /> Volver
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-indigo-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            <NotificacionesCard 
              data={configuraciones.notificaciones} 
              onChange={(f, v) => handleConfigChange('notificaciones', f, v)} 
            />
            <PerfilCard 
              data={configuraciones.perfil} 
              onChange={(f, v) => handleConfigChange('perfil', f, v)} 
            />
            <NegocioCard 
              data={configuraciones.negocio} 
              onChange={(f, v) => handleConfigChange('negocio', f, v)} 
            />
          </div>

          <SeguridadCard />
        </div>
      </main>
    </div>
  )
}
