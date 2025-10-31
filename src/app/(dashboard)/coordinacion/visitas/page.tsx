'use client'

import { useRouter } from 'next/navigation'
import VisitasList from '@/components/shared/VisitasList'
import { Visita } from '@/types'
import { obtenerVisitas } from '@/actions/visitas'

export default async function VisitasPage() {
  const router = useRouter()
  const visitas = await obtenerVisitas()

  return (
    <VisitasList
      visitas={visitas}
      onCreateClick={() => {
        router.push('/coordinacion/visitas/crear')
      }}
      onEditClick={(visita: Visita) => {
        router.push(`/coordinacion/visitas/${visita.cod_visita}/editar`)
      }}
    />
  )
}
