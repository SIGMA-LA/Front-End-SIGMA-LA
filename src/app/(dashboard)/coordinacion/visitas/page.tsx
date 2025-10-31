'use client'

import { useRouter } from 'next/navigation'
import VisitasList from '@/components/shared/VisitasList'
import { Visita } from '@/types'

export default function VisitasPage() {
  const router = useRouter()

  return (
    <VisitasList
      onCreateClick={() => {
        router.push('/coordinacion/visitas/crear')
      }}
      onEditClick={(visita: Visita) => {
        router.push(`/coordinacion/visitas/${visita.cod_visita}/editar`)
      }}
    />
  )
}
