'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import CrearVisita from '@/components/coordinacion/CrearVisita'
import { Obra } from '@/types'
import { obtenerObra } from '@/actions/obras'

export default function CrearVisitaPage() {
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

  if (loading) return <div className="p-8 text-center">Cargando...</div>

  return (
    <CrearVisita
      onCancel={() => router.push('/coordinacion/visitas')}
      onSubmit={() => router.push('/coordinacion/visitas')}
      preloadedObra={preloadedObra}
    />
  )
}
