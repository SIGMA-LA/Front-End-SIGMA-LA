'use client'

import { useState, useEffect } from 'react'
import type { OrdenProduccion } from '@/types'
import { getOrdenesByObraAndFinalizada } from '@/actions/ordenes'

export function useOrdenesProduccion(obraId: number | null) {
  const [ordenes, setOrdenes] = useState<OrdenProduccion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!obraId) {
      setOrdenes([])
      return
    }

    async function fetchOrdenes() {
      setLoading(true)
      setError(null)
      try {
        const data = await getOrdenesByObraAndFinalizada(obraId!)
        setOrdenes(data)
      } catch (err) {
        console.error('Error fetching OPs:', err)
        setError('Error al cargar las órdenes de producción')
      } finally {
        setLoading(false)
      }
    }

    fetchOrdenes()
  }, [obraId])

  return { ordenes, loading, error }
}
