import ObrasPageContent from '@/components/pages/ObrasPageContent'
import { getUsuario } from '@/lib/cache'

export default async function CoordinacionObrasPage({
  searchParams,
}: {
  searchParams?: any
}) {
  const sp = await searchParams
  const usuario = await getUsuario()

  return (
    <ObrasPageContent
      searchQuery={sp?.q ?? ''}
      estado={sp?.estado}
      cod_localidad={sp?.cod_localidad ? Number(sp.cod_localidad) : undefined}
      canCreate={false}
      usuarioRol={usuario?.rol_actual}
      title="Obras"
      subtitle="Consulta de obras y asignación de visitas"
    />
  )
}
