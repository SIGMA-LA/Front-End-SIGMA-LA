'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import RegistrarPedido from '@/components/coordinacion/RegistrarPedido'
import { Obra } from '@/types'
import { getObra } from '@/actions/obras'

export default function CrearPedidoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const obraId = searchParams.get('obra')
  const [preloadedObra, setPreloadedObra] = useState<Obra | null>(null)
  const [_loading, setLoading] = useState(!!obraId)

  useEffect(() => {
    if (obraId) {
      const fetchObra = async () => {
        try {
          const data = await getObra(Number(obraId))
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
    <RegistrarPedido
      onCancel={() => router.push('/coordinacion/pedidos')}
      onSubmit={() => router.push('/coordinacion/pedidos')}
      preloadedObra={preloadedObra}
    />
  )
}
