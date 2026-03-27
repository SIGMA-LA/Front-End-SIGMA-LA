import ClientesPageContent from '@/components/pages/ClientesPageContent'
import { getUsuario } from '@/lib/cache'

import type { SearchParams } from '@/types'

export default async function VentasClientesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams
  const usuario = await getUsuario()

  return (
    <ClientesPageContent
      searchQuery={(typeof sp.q === 'string' ? sp.q : sp.q?.[0]) ?? ''}
      toast={(typeof sp.toast === 'string' ? sp.toast : sp.toast?.[0]) ?? ''}
      canCreate={usuario?.rol_actual === 'VENTAS'}
      createUrl="/ventas/clientes/crear"
    />
  )
}
