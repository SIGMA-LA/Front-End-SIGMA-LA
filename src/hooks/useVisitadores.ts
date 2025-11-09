// src/hooks/useVisitadores.ts

'use client'

import { useState, useEffect } from 'react'
import type { Empleado } from '@/types'
import { obtenerVisitadores } from '@/actions/empleado' // Asegúrate de que la ruta a tu Server Action sea correcta

export function useVisitadores() {
  // 1. Estado para los datos que vamos a obtener
  const [visitadores, setVisitadores] = useState<Empleado[]>([])

  // 2. Estado para saber si la petición está en curso
  const [isLoading, setIsLoading] = useState(true)

  // 3. Estado para almacenar cualquier error que ocurra
  const [error, setError] = useState<string | null>(null)

  // 4. useEffect para ejecutar la obtención de datos cuando el componente que usa el hook se monta
  useEffect(() => {
    // Definimos una función async dentro del efecto para poder usar await
    async function fetchVisitadores() {
      try {
        // Reiniciamos el estado antes de empezar
        setIsLoading(true)
        setError(null)

        // Llamamos a nuestra Server Action
        const data = await obtenerVisitadores()

        // Si todo sale bien, guardamos los datos
        setVisitadores(data)
      } catch (err) {
        // Si la Server Action lanza un error, lo capturamos
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Ocurrió un error desconocido al cargar los visitadores.'

        setError(errorMessage)
      } finally {
        // Esto se ejecuta siempre, tanto si hubo éxito como si hubo error
        setIsLoading(false)
      }
    }

    fetchVisitadores()
  }, []) // El array de dependencias vacío `[]` asegura que esto se ejecute solo una vez

  // 5. Devolvemos el estado y los datos para que el componente los pueda usar
  return { visitadores, isLoading, error }
}
