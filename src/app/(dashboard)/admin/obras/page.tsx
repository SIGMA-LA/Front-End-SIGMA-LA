import ObrasPageContent from '@/components/pages/ObrasPageContent'
import { getUsuario } from '@/lib/cache'
import { ESTADOS_OBRA } from '@/constants'

import type { EstadoObra, SearchParams } from '@/types'

function parseEstadoObra(
  estado: string | string[] | undefined
): EstadoObra | undefined {
  const value = typeof estado === 'string' ? estado : estado?.[0]
  if (!value) return undefined
  return ESTADOS_OBRA.includes(value as EstadoObra)
    ? (value as EstadoObra)
    : undefined
}

export default async function AdminObrasPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams
  const usuario = await getUsuario()
  const estado = parseEstadoObra(sp.estado)

  return (
    <ObrasPageContent
      searchQuery={(typeof sp.q === 'string' ? sp.q : sp.q?.[0]) ?? ''}
      estado={estado}
      cod_localidad={sp?.cod_localidad ? Number(sp.cod_localidad) : undefined}
      canCreate={false}
      usuarioRol={usuario?.rol_actual}
      title="Obras"
      subtitle="Gestión administrativa de obras"
      page={sp?.page ? Number(sp.page) : undefined}
    />
  )
}
