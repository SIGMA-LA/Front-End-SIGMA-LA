'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Car,
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  Package,
  Edit,
  Trash2,
} from 'lucide-react'
import { Vehiculo, VehiculoEstado } from '@/types'
import { getUsosProgramadosVehiculo } from '@/actions/vehiculos'

interface VehiculoCardProps {
  vehiculo: Vehiculo
  onToggleEstado: (
    patente: string,
    estadoActual: VehiculoEstado
  ) => Promise<void>
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
  const [isCheckingUsos, setIsCheckingUsos] = useState(false)
  const [usos, setUsos] = useState<any>(null)

  const getEstadoBadgeColor = (estado: VehiculoEstado) => {
    switch (estado) {
      case 'DISPONIBLE':
        return 'bg-green-100 text-green-800'
      case 'FUERA DE SERVICIO':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleOpenDeleteModal = async () => {
    setIsCheckingUsos(true)
    try {
      const result = await getUsosProgramadosVehiculo(vehiculo.patente)
      setUsos(result)
    } catch (e) {
      console.error(e)
    } finally {
      setIsCheckingUsos(false)
      setShowDeleteModal(true)
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
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between border-b bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-3">
          <div className="flex items-center gap-2">
            <Car className="h-5 w-5 text-blue-600" />
            <span className="font-mono text-xs text-gray-600">
              {vehiculo.patente}
            </span>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${getEstadoBadgeColor(
              vehiculo.estado
            )}`}
          >
            {vehiculo.estado === 'DISPONIBLE' ? 'Disponible' : 'No Disponible'}
          </span>
        </div>

        <div className="p-6">
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">
            {vehiculo.marca && vehiculo.modelo
              ? `${vehiculo.marca} ${vehiculo.modelo}`
              : vehiculo.tipo_vehiculo}
          </h3>

          <div className="mb-4 space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Package className="h-4 w-4" />
              <span>{vehiculo.tipo_vehiculo}</span>
            </div>

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

          <div className="flex gap-2">
            <button
              onClick={() => onToggleEstado(vehiculo.patente, vehiculo.estado)}
              disabled={isTogglingEstado}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${vehiculo.estado === 'DISPONIBLE'
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
                  <span>Desactivar</span>
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
                router.push(
                  `/coordinacion/vehiculos/${vehiculo.patente}/editar`
                )
              }
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Edit className="h-4 w-4" />
              Editar
            </button>

            <button
              onClick={handleOpenDeleteModal}
              disabled={isCheckingUsos}
              className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              {isCheckingUsos ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center backdrop-blur">
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
                  Esta acción se puede deshacer luego contactando soporte
                </p>
              </div>
            </div>

            <p className="mb-6 text-sm text-gray-700">
              ¿Estás seguro de que deseas dar de baja el vehículo con patente{' '}
              <span className="font-semibold">{vehiculo.patente}</span>?
            </p>

            {usos && (usos.uso_vehiculo_entrega?.length > 0 || usos.uso_vehiculo_visita?.length > 0) && (
              <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <p className="font-semibold mb-2">Advertencia: Este vehículo está asignado a:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {usos.uso_vehiculo_entrega?.map((u: any) => (
                    <li key={`e-${u.cod_entrega}`}>
                      Entrega en {u.entrega.obra.direccion} ({new Date(u.entrega.fecha_hora_entrega).toLocaleDateString('es-AR')})
                    </li>
                  ))}
                  {usos.uso_vehiculo_visita?.map((u: any) => (
                    <li key={`v-${u.cod_visita}`}>
                      Visita a {u.visita.obra?.direccion || u.visita.direccion_visita} ({new Date(u.visita.fecha_hora_visita).toLocaleDateString('es-AR')})
                    </li>
                  ))}
                </ul>
                <p className="mt-2 font-medium">Se deberá reasignar otro vehículo a estas actividades.</p>
              </div>
            )}

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
