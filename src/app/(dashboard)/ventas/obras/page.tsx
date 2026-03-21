import ObrasPageContent from '@/components/pages/ObrasPageContent'
import { getUsuario } from '@/lib/cache'

import type { SearchParams } from '@/types'

export default async function VentasObrasPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams
  const usuario = await getUsuario()

  return (
    <ObrasPageContent
      searchQuery={(typeof sp.q === 'string' ? sp.q : sp.q?.[0]) ?? ''}
      estado={(typeof sp.estado === 'string' ? sp.estado : sp.estado?.[0])}
      cod_localidad={sp?.cod_localidad ? Number(sp.cod_localidad) : undefined}
      canCreate={usuario?.rol_actual === 'VENTAS'}
      createUrl="/ventas/obras/crear"
      usuarioRol={usuario?.rol_actual}
    />
  )
}
