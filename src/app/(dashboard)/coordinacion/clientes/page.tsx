import ClientesPageContent from '@/components/pages/ClientesPageContent'

import type { SearchParams } from '@/types'

export default async function CoordinacionClientesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams

  return (
    <ClientesPageContent 
      searchQuery={(typeof sp.q === 'string' ? sp.q : sp.q?.[0]) ?? ''} 
      page={Number(typeof sp.page === 'string' ? sp.page : sp.page?.[0]) || 1}
      canCreate={false} 
    />
  )
}
