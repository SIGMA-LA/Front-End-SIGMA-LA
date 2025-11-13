'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Vehiculo } from '@/types'
import { getVehiculos } from '@/actions/vehiculos'

export function useVehiculos() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

  const fetchVehiculos = useCallback(async () => {
    setIsLoading(true)
    // LIMPIAR ERRORES PREVIOS al iniciar una nueva petición
    setError(null)

    try {
      const data = await getVehiculos()
      setVehiculos(data)
    } catch (err) {
      // CAPTURAR Y GUARDAR EL ERROR en el estado
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Ocurrió un error desconocido al obtener los vehículos'

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVehiculos()
  }, [fetchVehiculos])

  return { vehiculos, isLoading, error, refreshVehiculos: fetchVehiculos }
}
