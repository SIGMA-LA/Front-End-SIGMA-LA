import VisitasPageContent from '@/components/pages/VisitasPageContent'
import type { SearchParams } from '@/types'

export default async function CoordinacionVisitasPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams

  return (
    <VisitasPageContent
      searchQuery={(typeof sp.q === 'string' ? sp.q : sp.q?.[0]) ?? ''}
      status={(typeof sp.estado === 'string' ? sp.estado : sp.estado?.[0]) ?? 'ALL'}
      canCreate={true}
      rolActual="COORDINACION"
      title="Coordinación de Visitas"
      subtitle="Gestiona y programa las visitas técnicas"
    />
  )
}
