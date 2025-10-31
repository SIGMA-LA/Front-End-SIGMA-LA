'use client'

import CrearObra from '@/components/ventas/CrearObra'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getObraById } from '@/services/obra.service'
import type { Obra } from '@/types'

export default function EditarObraPage() {
  const router = useRouter()
  const params = useParams()
  const [obra, setObra] = useState<Obra | null>(null)

  useEffect(() => {
    async function fetchObra() {
      if (params.id) {
        const obraData = await getObraById(Number(params.id))
        setObra(obraData)
      }
    }
    fetchObra()
  }, [params.id])

  if (!obra) return <div>Cargando...</div>

  return (
    <CrearObra
      obraExistente={obra}
      onCancel={() => router.push('/ventas/obras')}
      onSubmit={async (obraData, presupuestos) => {
        // lógica para actualizar obra y presupuestos
        router.push('/ventas/obras')
      }}
    />
  )
}
