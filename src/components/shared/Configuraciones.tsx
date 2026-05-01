'use client'

import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Save,
  Settings,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
interface ConfiguracionesProps {
  onBack?: () => void
  className?: string
}

import { PerfilSection } from './configuraciones/PerfilSection'
import { NegocioSection } from './configuraciones/NegocioSection'
import { SeguridadSection } from './configuraciones/SeguridadSection'

import { getPerfilConfig, updatePerfilConfig } from '@/actions/configuraciones'
import { getActualParametros, updateParametros } from '@/actions/parametros'
import { getCurrentUser } from '@/actions/auth'
import { notify } from '@/lib/toast'
import { NotificacionesData } from '@/types'

export default function Configuraciones({
  onBack,
  className = '',
}: ConfiguracionesProps) {
  const [configuraciones, setConfiguraciones] = useState({
    notificaciones: {
      configuracion: {
        canales: [] as { id: string; label: string }[],
        eventos: [] as { id: string; label: string }[],
      },
      valores: {} as Record<string, boolean>,
    },
    perfil: {
      nombre: 'Usuario',
      apellido: 'Aberturas',
      cuil: '20-45678912-3',
      mail: '',
    },
    negocio: {
      presupuesto: '10',
      viaticos: '50.00',
      checkboxEjemplo: true,
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [errorStatus, setErrorStatus] = useState<string | null>(null)
  const [successStatus, setSuccessStatus] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

  // Cargar datos iniciales del backend (apartado perfil)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setErrorStatus(null)
        const [perfilDB, parametrosDB, currentUser] = await Promise.all([
          getPerfilConfig(),
          getActualParametros(),
          getCurrentUser(),
        ])

        if (currentUser) {
          setUserRole(currentUser.rol_actual)
        }

        if (perfilDB) {
          setConfiguraciones((prev) => ({
            ...prev,
            perfil: {
              nombre: perfilDB.nombre || prev.perfil.nombre,
              apellido: perfilDB.apellido || prev.perfil.apellido,
              cuil: perfilDB.cuil || prev.perfil.cuil,
              mail: perfilDB.mail || prev.perfil.mail,
            },
            notificaciones:
              (perfilDB.notificaciones as NotificacionesData) ||
              prev.notificaciones,
          }))
        }

        if (parametrosDB) {
          setConfiguraciones((prev) => ({
            ...prev,
            negocio: {
              ...prev.negocio,
              presupuesto: parametrosDB.dias_vigencia_presu?.toString() || prev.negocio.presupuesto,
              viaticos: parametrosDB.viatico_dia_persona?.toString() || prev.negocio.viaticos,
            }
          }))
        }
      } catch (error) {
        console.error('Error cargando configuración de perfil:', error)
        setErrorStatus(
          'No se pudo establecer conexión con el backend para cargar el perfil.'
        )
      } finally {
        setIsFetching(false)
      }
    }

    fetchInitialData()
  }, [])

  const handleConfigChange = (
    section: string,
    field: string,
    value: boolean | string
  ) => {
    setConfiguraciones((prev) => {
      if (section === 'notificaciones') {
        return {
          ...prev,
          notificaciones: {
            ...prev.notificaciones,
            valores: {
              ...prev.notificaciones.valores,
              [field]: value as boolean,
            },
          },
        }
      }

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
    // Validaciones previas al guardado
    const { presupuesto, viaticos } = configuraciones.negocio
    if (!presupuesto || parseFloat(presupuesto) <= 0) {
      setErrorStatus('Los días de vigencia del presupuesto deben ser mayores a 0.')
      notify.error('Los días de vigencia del presupuesto deben ser mayores a 0.')
      return
    }
    if (!viaticos || parseFloat(viaticos) <= 0) {
      setErrorStatus('El costo de viático por día debe ser mayor a 0.')
      notify.error('El costo de viático por día debe ser mayor a 0.')
      return
    }

    setIsLoading(true)
    setErrorStatus(null)
    setSuccessStatus(null)
    try {
      const currentDate = new Date()
      const dateString = currentDate.toISOString().split('T')[0]
      const timeString = currentDate.toTimeString().split(' ')[0]

      // Usar el nuevo action para guardar el perfil y las notificaciones en el backend
      const promises = [
        updatePerfilConfig(configuraciones.perfil),
        // Aquí podrías tener un updateNotificacionesConfig o incluirlo en el perfil
        updatePerfilConfig({
          ...configuraciones.perfil,
          notificaciones: configuraciones.notificaciones.valores,
        }),
      ]

      if (userRole === 'VENTAS') {
        promises.push(
          updateParametros({
            dias_vigencia_presu: parseInt(presupuesto),
            viatico_dia_persona: parseFloat(viaticos),
            fecha_cambio: dateString,
            hora_cambio: timeString
          })
        )
      }

      await Promise.all(promises)
      setSuccessStatus('Configuraciones guardadas exitosamente.')
      notify.success('Configuraciones guardadas exitosamente.')
      setTimeout(() => setSuccessStatus(null), 4000)
    } catch {
      setErrorStatus('Error al guardar las configuraciones en el servidor.')
      notify.error('Error al guardar las configuraciones en el servidor.')
    } finally {
      setIsLoading(false)
    }
  }

  const isUIBlocked = isLoading || isFetching

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
              disabled={isUIBlocked}
              className="ml-auto flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isLoading ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>

          {/* Feedback Banners */}
          {errorStatus && (
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
              <p className="text-sm font-medium">{errorStatus}</p>
            </div>
          )}

          {successStatus && (
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
              <p className="text-sm font-medium">{successStatus}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-2">
            <PerfilSection
              perfil={configuraciones.perfil}
              onChange={(field, value) =>
                handleConfigChange('perfil', field, value)
              }
              disabled={isUIBlocked}
            />

            <NegocioSection
              negocio={configuraciones.negocio}
              onChange={(field, value) =>
                handleConfigChange('negocio', field, value)
              }
              disabled={isUIBlocked || userRole !== 'VENTAS'}
            />
          </div>

          <SeguridadSection />
        </div>
      </main>
    </div>
  )
}
