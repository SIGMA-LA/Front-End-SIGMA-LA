'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import VehiculoForm from '@/components/coordinacion/VehiculoForm'
import { createVehiculo } from '@/actions/vehiculos'
import { VehiculoFormData } from '@/types'

export default function CrearVehiculoPage() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: VehiculoFormData) => {
    setIsPending(true)
    setError(null)

    try {
      await createVehiculo(data)
      router.push('/coordinacion/vehiculos')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <VehiculoForm
        onSubmit={handleSubmit}
        onCancel={() => router.push('/coordinacion/vehiculos')}
        isPending={isPending}
        error={error}
      />
    </div>
  )
}
