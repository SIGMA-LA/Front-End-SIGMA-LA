import ObrasPageContent from '@/components/pages/ObrasPageContent'
import { obtenerEmpleadoActual } from '@/actions/empleado'

export default async function AdminObrasPage({
  searchParams,
}: {
  searchParams?: any
}) {
  const sp = await searchParams
  const [usuarioResponse] = await Promise.all([obtenerEmpleadoActual()])
  const usuario = usuarioResponse?.data

  return (
    <ObrasPageContent
      searchQuery={sp?.q ?? ''}
      estado={sp?.estado}
      cod_localidad={sp?.cod_localidad ? Number(sp.cod_localidad) : undefined}
      canCreate={false}
      usuarioRol={usuario?.rol_actual}
      title="Obras"
      subtitle="Gestión administrativa de obras"
    />
  )
}
