'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Car, Plus, CheckCircle, XCircle } from 'lucide-react'
import { Vehiculo, VehiculoEstado } from '@/types'
import { updateVehiculo, deleteVehiculo } from '@/actions/vehiculos'
import VehiculoCard from '@/components/coordinacion/VehiculoCard'
import { notify } from '@/lib/toast'

interface VehiculosPageContentProps {
  vehiculos: Vehiculo[]
  isLoading?: boolean
}

function VehiculosSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200" />
            <div className="space-y-2">
              <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-56 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
          <div className="h-10 w-40 animate-pulse rounded-lg bg-gray-200" />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-lg bg-gray-200"
            />
          ))}
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-lg bg-gray-200"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function VehiculosPageContent({
  vehiculos: initialVehiculos,
  isLoading,
}: VehiculosPageContentProps) {
  const router = useRouter()
  const [vehiculos, setVehiculos] = useState(initialVehiculos)
  const [togglingEstado, setTogglingEstado] = useState<string | null>(null)

  if (isLoading) {
    return <VehiculosSkeleton />
  }

  const handleToggleEstado = async (
    patente: string,
    estadoActual: VehiculoEstado
  ) => {
    setTogglingEstado(patente)
    try {
      const nuevoEstado =
        estadoActual === 'DISPONIBLE' ? 'FUERA DE SERVICIO' : 'DISPONIBLE'

      const res = await updateVehiculo(patente, {
        estado: nuevoEstado as VehiculoEstado,
      })
      if (!res.success) {
        notify.error(res.error || 'Error al cambiar el estado del vehiculo.')
        return
      }

      setVehiculos((prev) =>
        prev.map((v) =>
          v.patente === patente
            ? { ...v, estado: nuevoEstado as VehiculoEstado }
            : v
        )
      )

      notify.success(
        nuevoEstado === 'DISPONIBLE'
          ? 'Vehiculo marcado como disponible.'
          : 'Vehiculo marcado como fuera de servicio.'
      )

      router.refresh()
    } catch (error) {
      console.error('Error al cambiar estado:', error)
      notify.error('Error al cambiar el estado del vehiculo.')
    } finally {
      setTogglingEstado(null)
    }
  }

  const handleDelete = async (patente: string) => {
    try {
      const res = await deleteVehiculo(patente)
      if (!res.success) {
        notify.error(res.error || 'No se pudo eliminar el vehiculo.')
        return
      }
      setVehiculos((prev) => prev.filter((v) => v.patente !== patente))
      notify.success('Vehiculo eliminado correctamente.')
      router.refresh()
    } catch (error) {
      console.error('Error al eliminar vehiculo:', error)
      notify.error('No se pudo eliminar el vehiculo.')
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Vehículos
              </h1>
              <p className="text-sm text-gray-600">
                Administra y controla el inventario de vehículos
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push('/coordinacion/vehiculos/crear')}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Nuevo Vehículo
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                Disponibles
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {vehiculos.filter((v) => v.estado === 'DISPONIBLE').length}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-2 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-gray-700">
                Fuera de Servicio
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {vehiculos.filter((v) => v.estado === 'FUERA DE SERVICIO').length}
            </p>
          </div>
        </div>

        {vehiculos.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
            <Car className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No hay vehículos registrados
            </h3>
            <p className="mt-2 mb-6 text-gray-600">
              Comienza agregando el primer vehículo a la flota
            </p>
            <button
              onClick={() => router.push('/coordinacion/vehiculos/crear')}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              Nuevo Vehículo
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vehiculos.map((vehiculo) => (
              <VehiculoCard
                key={vehiculo.patente}
                vehiculo={vehiculo}
                onToggleEstado={handleToggleEstado}
                onDelete={handleDelete}
                isTogglingEstado={togglingEstado === vehiculo.patente}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
