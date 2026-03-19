'use client'

import { useState } from 'react'
import { ArrowLeft, Save, Settings } from 'lucide-react'
import { ConfiguracionesProps } from '@/types'

import { NotificacionesSection } from './configuraciones/NotificacionesSection'
import { PerfilSection } from './configuraciones/PerfilSection'
import { NegocioSection } from './configuraciones/NegocioSection'
import { SeguridadSection } from './configuraciones/SeguridadSection'

export default function Configuraciones({
  onBack,
  className = '',
}: ConfiguracionesProps) {
  const [configuraciones, setConfiguraciones] = useState({
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

  const handleConfigChange = (section: string, field: string, value: any) => {
    setConfiguraciones((prev) => {
      const sectionValue = prev[section as keyof typeof prev]
      if (typeof sectionValue !== 'object' || sectionValue === null) {
        return prev
      }
      return {
        ...prev,
        [section]: {
          ...sectionValue,
          [field]: value,
        },
      }
    })
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simular guardado
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert('Configuraciones guardadas exitosamente!')
    } catch (error) {
      alert('Error al guardar configuraciones')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Configuraciones
                </h1>
                <p className="text-sm text-gray-600">
                  Edita los ajustes de tu cuenta y preferencias del negocio
                </p>
              </div>
            </div>
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center space-x-2 font-medium text-blue-600 transition-colors hover:text-blue-800"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Volver</span>
              </button>
            )}

            <button
              onClick={handleSave}
              disabled={isLoading}
              className="ml-auto flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isLoading ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            <NotificacionesSection
              notificaciones={configuraciones.notificaciones}
              onChange={(field, value) => handleConfigChange('notificaciones', field, value)}
            />
            
            <PerfilSection
              perfil={configuraciones.perfil}
              onChange={(field, value) => handleConfigChange('perfil', field, value)}
            />

            <NegocioSection
              negocio={configuraciones.negocio}
              onChange={(field, value) => handleConfigChange('negocio', field, value)}
            />
          </div>

          <SeguridadSection />
        </div>
      </main>
    </div>
  )
}
