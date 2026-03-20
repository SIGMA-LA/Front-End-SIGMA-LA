import PagosPageContent from '@/components/pages/PagosPageContent'
import { getUsuario } from '@/lib/cache'

export default async function PagosPage({
  searchParams,
}: {
  searchParams?: any
}) {
  const sp = await searchParams
  const usuario = await getUsuario()

  return (
    <PagosPageContent
      searchQuery={sp?.q ?? ''}
      fechaDesde={sp?.fechaDesde}
      fechaHasta={sp?.fechaHasta}
      montoMin={sp?.montoMin ? Number(sp.montoMin) : undefined}
      montoMax={sp?.montoMax ? Number(sp.montoMax) : undefined}
      canCreate={usuario?.rol_actual === 'VENTAS' || usuario?.rol_actual === 'ADMIN'}
      usuarioRol={usuario?.rol_actual}
    />
  )
}
