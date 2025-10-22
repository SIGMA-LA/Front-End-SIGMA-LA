'use client'

import { useRouter } from 'next/navigation'
import ObrasList from '@/components/shared/ObrasList'
import { Obra } from '@/types'

export default function ObrasPage() {
  const router = useRouter()

  return (
    <ObrasList
      onCreateClick={() => {}}
      onEditClick={(obra: Obra) => {}}
      onScheduleVisit={(obra: Obra) => {
        router.push(`/coordinacion/visitas/crear?obra=${obra.cod_obra}`)
      }}
      onScheduleEntrega={(obra: Obra) => {
        router.push(`/coordinacion/entregas/crear?obra=${obra.cod_obra}`)
      }}
    />
  )
}
