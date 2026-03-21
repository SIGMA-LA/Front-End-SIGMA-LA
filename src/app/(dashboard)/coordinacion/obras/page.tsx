import ObrasPageContent from '@/components/pages/ObrasPageContent'
import type { SearchParams } from '@/types'

export default async function CoordinacionObrasPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams

  return (
    <ObrasPageContent
      searchQuery={(typeof sp.q === 'string' ? sp.q : sp.q?.[0]) ?? ''}
      cod_localidad={sp?.cod_localidad ? Number(sp.cod_localidad) : undefined}
      canCreate={false}
      title="Coordinación de Obras"
      subtitle="Visualiza y filtra todas las obras registradas"
    />
  )
}
