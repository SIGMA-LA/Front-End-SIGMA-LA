import VisitasPageContent from '@/components/pages/VisitasPageContent'
import { getUsuario } from '@/lib/cache'

export default async function CoordinacionVisitasPage({
  searchParams,
}: {
  searchParams?: any
}) {
  const sp = await searchParams
  const usuario = await getUsuario()

  return (
    <VisitasPageContent
      searchQuery={sp?.q ?? ''}
      canCreate={true}
      createUrl="/coordinacion/visitas/crear"
      rolActual={usuario?.rol_actual}
    />
  )
}
