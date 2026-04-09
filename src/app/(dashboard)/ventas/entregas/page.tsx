import EntregasPageContent from '@/components/pages/EntregasPageContent'

import type { SearchParams } from '@/types'

export default async function VentasEntregasPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams

  return (
    <EntregasPageContent
      searchQuery={(typeof sp.q === 'string' ? sp.q : sp.q?.[0]) ?? ''}
      estado={(typeof sp.estado === 'string' ? sp.estado : sp.estado?.[0]) ?? ''}
      page={Number(typeof sp.page === 'string' ? sp.page : sp.page?.[0]) || 1}
      canCreate={false}
      title="Entregas"
      subtitle="Consulta de entregas programadas y realizadas"
    />
  )
}
