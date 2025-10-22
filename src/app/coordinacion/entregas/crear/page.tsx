'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import CrearEntrega from '@/components/coordinacion/CrearEntrega'
import { Obra } from '@/types'
import { obtenerObra } from '@/actions/obras'

export default function CrearEntregaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const obraId = searchParams.get('obra')
  const [preloadedObra, setPreloadedObra] = useState<Obra | null>(null)
  const [loading, setLoading] = useState(!!obraId)

  useEffect(() => {
    if (obraId) {
      const fetchObra = async () => {
        try {
          const data = await obtenerObra(Number(obraId))
          setPreloadedObra(data)
        } catch (error) {
          console.error('Error al cargar obra:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchObra()
    } else {
      setLoading(false)
    }
  }, [obraId])

  return (
    <CrearEntrega
      onCancel={() => router.push('/coordinacion/entregas')}
      onSubmit={() => router.push('/coordinacion/entregas')}
      preloadedObra={preloadedObra}
    />
  )
}
