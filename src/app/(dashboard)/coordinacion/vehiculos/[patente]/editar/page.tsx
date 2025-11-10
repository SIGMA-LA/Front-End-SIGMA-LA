'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import VehiculoForm from '@/components/coordinacion/VehiculoForm'
import { obtenerVehiculo, actualizarVehiculo } from '@/actions/vehiculos'
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
        const data = await obtenerVehiculo(patente)
        setVehiculo(data)
      } catch (error: any) {
        setError(error.message)
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
      await actualizarVehiculo(patente, data)
      router.push('/coordinacion/vehiculos')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el vehículo')
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
