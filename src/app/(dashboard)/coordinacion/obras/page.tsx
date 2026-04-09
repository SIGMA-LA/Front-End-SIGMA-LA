import ObrasPageContent from '@/components/pages/ObrasPageContent'
import type { SearchParams, EstadoObra } from '@/types'
import { ESTADOS_OBRA } from '@/constants'

function parseEstadoObra(
  estado: string | string[] | undefined
): EstadoObra | undefined {
  const value = typeof estado === 'string' ? estado : estado?.[0]
  if (!value) return undefined
  return ESTADOS_OBRA.includes(value as EstadoObra)
    ? (value as EstadoObra)
    : undefined
}

export default async function CoordinacionObrasPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams
  const estado = parseEstadoObra(sp.estado)

  return (
    <ObrasPageContent
      searchQuery={(typeof sp.q === 'string' ? sp.q : sp.q?.[0]) ?? ''}
      cod_localidad={sp?.cod_localidad ? Number(sp.cod_localidad) : undefined}
      estado={estado}
      canCreate={false}
      title="Coordinación de Obras"
      subtitle="Visualiza y filtra todas las obras registradas"
    />
  )
}
