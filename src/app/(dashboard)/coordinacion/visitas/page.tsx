import VisitasPageContent from '@/components/pages/VisitasPageContent'
import { obtenerEmpleadoActual } from '@/actions/empleado'

export default async function CoordinacionVisitasPage({
  searchParams,
}: {
  searchParams?: any
}) {
  const sp = await searchParams
  const [usuarioResponse] = await Promise.all([obtenerEmpleadoActual()])
  const usuario = usuarioResponse?.data

  return (
    <VisitasPageContent
      searchQuery={sp?.q ?? ''}
      canCreate={true} // ✅ Coordinación SÍ crea visitas
      createUrl="/coordinacion/visitas/crear"
      rolActual={usuario?.rol_actual}
    />
  )
}
