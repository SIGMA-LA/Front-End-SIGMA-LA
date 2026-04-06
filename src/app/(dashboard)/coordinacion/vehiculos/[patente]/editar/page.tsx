'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import VehiculoForm from '@/components/coordinacion/VehiculoForm'
import { getVehiculo, updateVehiculo } from '@/actions/vehiculos'
import { Vehiculo, VehiculoFormData } from '@/types'

export default function EditarVehiculoPage() {
  const params = useParams()
  const router = useRouter()
  const patente = params.patente as string
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVehiculo = async () => {
      try {
        const data = await getVehiculo(patente)
        setVehiculo(data)
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchVehiculo()
  }, [patente])

  const handleSubmit = async (data: VehiculoFormData) => {
    setIsPending(true)
    setError(null)

    try {
      const res = await updateVehiculo(patente, data)
      if (!res.success) {
        setError(res.error || 'Error al actualizar el vehículo')
        return
      }
      router.push('/coordinacion/vehiculos')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsPending(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
      </div>
    )
  }

  if (!vehiculo) {
    return (
      <div className="p-8 text-center text-red-600">Vehículo no encontrado</div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <VehiculoForm
        vehiculo={vehiculo}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/coordinacion/vehiculos')}
        isPending={isPending}
        error={error}
        isEdit
      />
    </div>
  )
}
