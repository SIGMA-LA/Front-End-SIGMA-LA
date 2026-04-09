import VisitasPageContent from '@/components/pages/VisitasPageContent'
import { getUsuario } from '@/lib/cache'

import type { SearchParams } from '@/types'

export default async function VentasVisitasPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams
  const usuario = await getUsuario()

  return (
    <VisitasPageContent
      searchQuery={(typeof sp.q === 'string' ? sp.q : sp.q?.[0]) ?? ''}
      status={(typeof sp.estado === 'string' ? sp.estado : sp.estado?.[0]) ?? 'ALL'}
      page={Number(typeof sp.page === 'string' ? sp.page : sp.page?.[0]) || 1}
      canCreate={false}
      rolActual={usuario?.rol_actual}
      title="Visitas"
      subtitle="Consulta de visitas programadas"
    />
  )
}
