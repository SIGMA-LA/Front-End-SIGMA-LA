'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import EditarVehiculo from '@/components/coordinacion/EditarVehiculo'
import { Vehiculo } from '@/types'
import { obtenerVehiculo } from '@/actions/vehiculos'

export default function EditarVehiculoPage() {
  const params = useParams()
  const router = useRouter()
  const patente = params.patente as string
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVehiculo = async () => {
      try {
        const data = await obtenerVehiculo(patente)
        setVehiculo(data)
      } catch (error) {
        console.error('Error al cargar vehículo:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVehiculo()
  }, [patente])

  if (loading) return <div className="p-8 text-center">Cargando...</div>
  if (!vehiculo)
    return (
      <div className="p-8 text-center text-red-600">Vehículo no encontrado</div>
    )

  return (
    <EditarVehiculo
      vehiculo={vehiculo}
      onCancel={() => router.push('/coordinacion/vehiculos')}
      onSubmit={() => router.push('/coordinacion/vehiculos')}
    />
  )
}
