'use client'

import { useState, useEffect } from 'react'
import {
  Calendar,
  Clock,
  User,
  PackageOpen,
  Eye,
  Plus,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import type { EntregasListProps, Entrega } from '@/types'
import { useAuth } from '@/context/AuthContext'
import entregasService from '@/services/entregas.service'

export default function EntregasList({ onCreateClick }: EntregasListProps) {
  const { usuario } = useAuth()
  const [entregas, setEntregas] = useState<Entrega[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEntregas = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await entregasService.getAllEntregas()
        setEntregas(data)
      } catch (err) {
        console.error('Error al cargar entregas:', err)
        setError('No se pudieron cargar las entregas. Intente de nuevo.')
      } finally {
        setLoading(false)
      }
    }

    fetchEntregas()
  }, [])

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'bg-yellow-500'
      case 'EN CURSO':
        return 'bg-blue-500'
      case 'ENTREGADO':
        return 'bg-green-500'
      case 'CANCELADO':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (estado: string) => {
    const estados: { [key: string]: string } = {
      PENDIENTE: 'Pendiente',
      'EN CURSO': 'En Curso',
      ENTREGADO: 'Entregada',
      CANCELADO: 'Cancelada',
    }
    return estados[estado] || estado
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      timeZone: 'UTC',
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    })
  }

  const getEncargado = (entrega: Entrega) => {
    const encargado = entrega.empleados_asignados?.find(
      (e) => e.rol_entrega === 'ENCARGADO',
    )
    return encargado
      ? `${encargado.empleado.nombre} ${encargado.empleado.apellido}`
      : 'No asignado'
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <AlertCircle className="mx-auto h-10 w-10" />
        <p className="mt-4">{error}</p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <PackageOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Entregas
              </h1>
              <p className="text-sm text-gray-600">
                Gestión de entregas de aberturas y materiales
              </p>
            </div>
          </div>
          {usuario?.rol_actual === 'COORDINACION' && (
            <button
              onClick={onCreateClick}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              Nueva Entrega
            </button>
          )}
        </div>

        <div className="space-y-4">
          {entregas.length === 0 ? (
            <div className="mt-8 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <PackageOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No hay entregas registradas
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Comienza creando una nueva entrega.
              </p>
            </div>
          ) : (
            entregas.map((entrega) => (
              <div key={entrega.cod_entrega} className="flex items-center space-x-4">
                <div
                  className={`h-6 w-6 rounded-full ${getStatusColor(entrega.estado)}`}
                />
                <div className="flex-1 rounded-xl border border-blue-200 bg-blue-50 p-6 transition-shadow hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-semibold text-gray-800">
                        {entrega.obra?.direccion || 'Dirección no disponible'}
                      </h3>
                      <div className="mb-3 grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(entrega.fecha_hora_entrega)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(entrega.fecha_hora_entrega)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{getEncargado(entrega)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <PackageOpen className="h-4 w-4" />
                          <span className="font-medium">
                            {getStatusText(entrega.estado)}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-500">
                        {entrega.observaciones || 'Sin observaciones.'}
                      </p>
                    </div>

                    <div className="ml-4">
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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}