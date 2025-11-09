import VisitasPageContent from '@/components/pages/VisitasPageContent'
import { getUsuario } from '@/lib/cache'

export default async function VentasVisitasPage({
  searchParams,
}: {
  searchParams?: any
}) {
  const sp = await searchParams
  const usuario = await getUsuario()

  return (
    <VisitasPageContent
      searchQuery={sp?.q ?? ''}
      canCreate={false}
      rolActual={usuario?.rol_actual}
      title="Visitas"
      subtitle="Consulta de visitas programadas"
    />
  )
}
