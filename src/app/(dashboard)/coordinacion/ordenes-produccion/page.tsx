import OrdenesPageContent from '@/components/pages/OrdenesPageContent'
import { getUsuario } from '@/lib/cache'
import { redirect } from 'next/navigation'
import type { SearchParams } from '@/types'

export default async function CoordinacionOrdenesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams
  const usuario = await getUsuario()

  if (usuario?.rol_actual !== 'COORDINACION') {
    redirect('/')
  }

  return (
    <OrdenesPageContent
      searchQuery={(typeof sp.q === 'string' ? sp.q : sp.q?.[0]) ?? ''}
      estadoInitial={typeof sp.estado === 'string' ? sp.estado : sp.estado?.[0]}
    />
  )
}
