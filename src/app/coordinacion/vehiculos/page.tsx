'use client'

import { useRouter } from 'next/navigation'
import VehiculosList from '@/components/coordinacion/VehiculosList'
import { Vehiculo } from '@/types'

export default function VehiculosPage() {
  const router = useRouter()

  return (
    <VehiculosList
      onCreateClick={() => {
        router.push('/coordinacion/vehiculos/crear')
      }}
      onEditClick={(vehiculo: Vehiculo) => {
        router.push(`/coordinacion/vehiculos/${vehiculo.patente}/editar`)
      }}
    />
  )
}
