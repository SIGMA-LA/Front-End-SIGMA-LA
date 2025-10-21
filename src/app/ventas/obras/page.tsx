'use client'

import ObrasList from '@/components/shared/ObrasList'
import { useRouter } from 'next/navigation'

export default function ObrasPage() {
  const router = useRouter()

  return (
    <ObrasList
      onCreateClick={() => router.push('/ventas/obras/crear')}
      onEditClick={(obra) =>
        router.push(`/ventas/obras/${obra.cod_obra}/editar`)
      }
      onScheduleVisit={(obra) => {
        /* lógica para agendar visita */
      }}
      onScheduleEntrega={(obra) => {
        /* lógica para agendar entrega */
      }}
      onNotaFabricaClick={(obra) => {
        /* lógica para nota de fábrica */
      }}
    />
  )
}
