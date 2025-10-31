'use client'

import { useRouter } from 'next/navigation'
import CrearVehiculo from '@/components/coordinacion/CrearVehiculo'

export default function CrearVehiculoPage() {
  const router = useRouter()

  return (
    <CrearVehiculo
      onCancel={() => router.push('/coordinacion/vehiculos')}
      onSubmit={() => router.push('/coordinacion/vehiculos')}
    />
  )
}
