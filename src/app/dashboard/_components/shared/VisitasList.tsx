'use client'

import { Calendar, Clock, User, Eye, Plus } from 'lucide-react'
import { VisitasListProps } from '@/types'
import { useAuth } from '@/context/AuthContext'
import { useState, useEffect } from 'react'
import { obtenerVisitas, type Visita } from '@/actions/visitas'

export default function VisitasList({ onCreateClick }: VisitasListProps) {
  const { usuario, logout } = useAuth() // Cambiado de 'usuario' por consistencia
  const [visitas, setVisitas] = useState<Visita[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVisitas = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await obtenerVisitas()
      console.log('Visitas obtenidas:', data)
      setVisitas(data)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido'

      // Si hay error de autenticación, hacer logout
      if (
        errorMessage.includes('sesión') ||
        errorMessage.includes('Token expirado')
      ) {
        logout()
        return
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVisitas()
  }, [])
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'PROGRAMADA':
        return 'bg-yellow-500'
      case 'COMPLETADA':
        return 'bg-green-500'
      case 'CANCELADA':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getTipoText = (tipo: string) => {
    switch (tipo) {
      case 'VISITA INICIAL':
        return 'Visita Inicial'
      case 'MEDICION':
        return 'Medición'
      case 'RE-MEDICION':
        return 'Re-Medición'
      case 'REPARACION':
        return 'Reparación'
      case 'ASESORAMIENTO':
        return 'Asesoramiento'
      default:
        return tipo
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR')
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Cargando visitas...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600">Error: {error}</p>
              <button
                onClick={fetchVisitas}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Visitas
              </h1>
              <p className="text-sm text-gray-600">
                Gestión de visitas a obras y clientes
              </p>
            </div>
          </div>
          {usuario?.rol_actual === 'COORDINACION' && (
            <button
              onClick={onCreateClick}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              Nueva Visita
            </button>
          )}
        </div>

        {visitas.length === 0 ? (
          <div className="py-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">No hay visitas registradas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {visitas.map((visita) => (
              <div
                key={visita.cod_visita}
                className="flex items-center space-x-4"
              >
                {/* Visita Card */}
                <div className="flex flex-1 flex-col rounded-xl border border-blue-200 bg-blue-50 p-6 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {visita.obra?.direccion || 'Visita sin obra asignada'}
                      </h3>
                      {/* Estado Badge */}
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wide text-white uppercase ${getStatusColor(
                          visita.estado
                        )} shadow`}
                      >
                        {visita.estado}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(visita.fecha_hora_visita)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-medium">
                          Tipo: {getTipoText(visita.motivo_visita)}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-500">{visita.observaciones}</p>
                  </div>
                  {/* Action Button */}
                  <div className="mt-4 sm:mt-0 sm:ml-4">
                    <button className="flex items-center space-x-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600">
                      <Eye className="h-4 w-4" />
                      <span>
                        Ver
                        <br />
                        Detalles
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
