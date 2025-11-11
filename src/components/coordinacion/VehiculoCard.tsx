'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  Package,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Vehiculo } from '@/types'

interface VehiculoCardProps {
  vehiculo: Vehiculo
  onToggleEstado: (patente: string, estadoActual: string) => Promise<void>
  onDelete: (patente: string) => Promise<void>
  isTogglingEstado: boolean
}

export default function VehiculoCard({
  vehiculo,
  onToggleEstado,
  onDelete,
  isTogglingEstado,
}: VehiculoCardProps) {
  const router = useRouter()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'DISPONIBLE':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'FUERA DE SERVICIO':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <CheckCircle className="h-5 w-5 text-gray-600" />
    }
  }

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'DISPONIBLE':
        return 'bg-green-100 text-green-800'
      case 'FUERA DE SERVICIO':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(vehiculo.patente)
      setShowDeleteModal(false)
    } catch (error) {
      console.error('Error al eliminar:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getEstadoIcon(vehiculo.estado)}
            <span className="text-sm font-medium text-gray-700">
              {vehiculo.tipo_vehiculo}
            </span>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${getEstadoBadgeColor(vehiculo.estado)}`}
          >
            {vehiculo.estado}
          </span>
        </div>

        <div className="mb-4">
          <p className="mb-2 font-mono text-2xl font-bold text-gray-900">
            {vehiculo.patente}
          </p>
          <div className="space-y-1 text-sm text-gray-600">
            {vehiculo.marca && vehiculo.modelo && (
              <div className="flex items-center gap-1.5">
                <Package className="h-4 w-4" />
                <span>
                  {vehiculo.marca} {vehiculo.modelo}
                </span>
              </div>
            )}
            {vehiculo.anio && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{vehiculo.anio}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onToggleEstado(vehiculo.patente, vehiculo.estado)}
            disabled={isTogglingEstado}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              vehiculo.estado === 'DISPONIBLE'
                ? 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                : 'border border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            {isTogglingEstado ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Cambiando...</span>
              </>
            ) : vehiculo.estado === 'DISPONIBLE' ? (
              <>
                <XCircle className="h-4 w-4" />
                <span>Marcar como Fuera de Servicio</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Activar</span>
              </>
            )}
          </button>

          <button
            onClick={() =>
              router.push(`/coordinacion/vehiculos/${vehiculo.patente}/editar`)
            }
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Eliminar Vehículo
                </h3>
                <p className="text-sm text-gray-600">
                  Esta acción no se puede deshacer
                </p>
              </div>
            </div>

            <p className="mb-6 text-sm text-gray-700">
              ¿Estás seguro de que deseas eliminar el vehículo con patente{' '}
              <span className="font-semibold">{vehiculo.patente}</span>?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
