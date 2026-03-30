import ClientesPageContent from '@/components/pages/ClientesPageContent'

import type { SearchParams } from '@/types'

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams

  return (
    <ClientesPageContent
      searchQuery={(typeof sp.q === 'string' ? sp.q : sp.q?.[0]) ?? ''}
      toast={(typeof sp.toast === 'string' ? sp.toast : sp.toast?.[0]) ?? ''}
      canCreate
      createUrl="/admin/clientes/crear"
    />
  )
}
