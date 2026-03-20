'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Bell,
  User,
  Shield,
  Save,
  Building,
  Settings,
} from 'lucide-react'
interface ConfiguracionesProps {
  onBack?: () => void
  className?: string
}

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
  const [error, setError] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(false)

  const handleConfigChange = (
    section: string,
    field: string,
    value: string | boolean | number
  ) => {
    setConfiguraciones((prev) => {
      if (section === 'tema') {
        // "tema" is a string, not an object
        return {
          ...prev,
          tema: value,
        }
      } else {
        const sectionValue = prev[section as keyof typeof prev]
        if (typeof sectionValue !== 'object' || sectionValue === null) {
          return prev // or throw an error if you want to handle this case
        }
        return {
          ...prev,
          [section]: {
            ...sectionValue,
            [field]: value,
          },
        }
      }
    })
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError(null) // Clear previous errors
    try {
      // Simular guardado
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert('Configuraciones guardadas exitosamente!')
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Error al guardar configuraciones'
      )
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
            {/* Notificaciones */}
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
                  <span className="text-gray-700">
                    Notificaciones por email
                  </span>
                  <input
                    type="checkbox"
                    checked={configuraciones.notificaciones.email}
                    onChange={(e) =>
                      handleConfigChange(
                        'notificaciones',
                        'email',
                        e.target.checked
                      )
                    }
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-gray-700">Notificaciones push</span>
                  <input
                    type="checkbox"
                    checked={configuraciones.notificaciones.push}
                    onChange={(e) =>
                      handleConfigChange(
                        'notificaciones',
                        'push',
                        e.target.checked
                      )
                    }
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-gray-700">
                    Notificaciones de Visitas
                  </span>
                  <input
                    type="checkbox"
                    checked={configuraciones.notificaciones.visitas}
                    onChange={(e) =>
                      handleConfigChange(
                        'notificaciones',
                        'recordatorios',
                        e.target.checked
                      )
                    }
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-gray-700">
                    Notificaciones de Entregas
                  </span>
                  <input
                    type="checkbox"
                    checked={configuraciones.notificaciones.entregas}
                    onChange={(e) =>
                      handleConfigChange(
                        'notificaciones',
                        'presupuestos',
                        e.target.checked
                      )
                    }
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-gray-700">
                    Vencimientos de presupuestos
                  </span>
                  <input
                    type="checkbox"
                    checked={configuraciones.notificaciones.vencimientos}
                    onChange={(e) =>
                      handleConfigChange(
                        'notificaciones',
                        'vencimientos',
                        e.target.checked
                      )
                    }
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>

            {/* Perfil de Usuario */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Perfil
                  </h3>
                </div>
              </div>
              <div className="space-y-4 p-6">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={configuraciones.perfil.nombre}
                    onChange={(e) =>
                      handleConfigChange('perfil', 'nombre', e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={configuraciones.perfil.apellido}
                    onChange={(e) =>
                      handleConfigChange('perfil', 'apellido', e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    CUIL
                  </label>
                  <input
                    type="text"
                    value={configuraciones.perfil.cuil}
                    onChange={(e) =>
                      handleConfigChange('perfil', 'empresa', e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Configuraciones del Negocio */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-indigo-100 p-2">
                    <Building className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Negocio
                  </h3>
                </div>
              </div>
              <div className="space-y-4 p-6">
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="text-gray-700">Checkbox para algo</span>
                  <input
                    type="checkbox"
                    checked={configuraciones.negocio.checkboxEjemplo}
                    onChange={(e) =>
                      handleConfigChange(
                        'negocio',
                        'mostrarPrecios',
                        e.target.checked
                      )
                    }
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Días de vigencia del presupuesto
                  </label>
                  <input
                    type="number"
                    placeholder={configuraciones.negocio.presupuesto}
                    onChange={(e) =>
                      handleConfigChange(
                        'negocio',
                        'stockMinimo',
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Costo de Viático por día
                  </label>
                  <input
                    type="number"
                    step={'0.01'}
                    placeholder={configuraciones.negocio.viaticos}
                    onChange={(e) =>
                      handleConfigChange(
                        'negocio',
                        'stockMinimo',
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Seguridad */}
          <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-red-100 p-2">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Seguridad y Datos
                </h3>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <button className="rounded-lg border border-gray-300 p-4 text-left transition-colors hover:bg-gray-50">
                  <div className="font-medium text-gray-900">
                    Cambiar Contraseña
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    Actualiza tu contraseña de acceso
                  </div>
                </button>
                <button className="rounded-lg border border-gray-300 p-4 text-left transition-colors hover:bg-gray-50">
                  <div className="font-medium text-gray-900">
                    Configurar 2FA
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    Autenticación de dos factores
                  </div>
                </button>
                <button className="rounded-lg border border-gray-300 p-4 text-left transition-colors hover:bg-gray-50">
                  <div className="font-medium text-gray-900">
                    Exportar Datos
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    Descarga una copia de seguridad
                  </div>
                </button>
                <button className="rounded-lg border border-red-300 p-4 text-left transition-colors hover:bg-red-50">
                  <div className="font-medium text-red-600">
                    Eliminar Cuenta
                  </div>
                  <div className="mt-1 text-sm text-red-500">
                    Acción irreversible
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
