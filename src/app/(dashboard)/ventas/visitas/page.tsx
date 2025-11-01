import VisitasPageContent from '@/components/pages/VisitasPageContent'
import { obtenerEmpleadoActual } from '@/actions/empleado'

export default async function VentasVisitasPage({
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
      canCreate={false} // ✅ Ventas NO crea visitas
      rolActual={usuario?.rol_actual}
      title="Visitas"
      subtitle="Consulta de visitas programadas"
    />
  )
}
