import EntregasPageContent from '@/components/pages/EntregasPageContent'
import type { SearchParams } from '@/types'

export default async function CoordinacionEntregasPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams

  return (
    <EntregasPageContent
      searchQuery={(typeof sp.q === 'string' ? sp.q : sp.q?.[0]) ?? ''}
      canCreate={true}
      title="Coordinación de Entregas"
      subtitle="Gestiona y programa las entregas a obra"
    />
  )
}
