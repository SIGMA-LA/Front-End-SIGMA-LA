'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import CrearVisita from '@/components/coordinacion/CrearVisita'
import { Visita } from '@/types'
import { obtenerVisitas } from '@/actions/visitas'

export default function EditarVisitaPage() {
  const params = useParams()
  const router = useRouter()
  const visitaId = params.id as string
  const [visita, setVisita] = useState<Visita | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVisita = async () => {
      try {
        const data = await obtenerVisitas()
        setVisita(data.find((v) => v.cod_visita === Number(visitaId)) || null)
      } catch (error) {
        console.error('Error al cargar visita:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVisita()
  }, [visitaId])

  if (loading) return <div className="p-8 text-center">Cargando...</div>

  return (
    <CrearVisita
      onCancel={() => router.push('/coordinacion/visitas')}
      onSubmit={() => router.push('/coordinacion/visitas')}
      visitaEditar={visita}
    />
  )
}
