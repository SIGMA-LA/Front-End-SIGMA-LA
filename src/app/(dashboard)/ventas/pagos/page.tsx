import PagosPageContent from '@/components/pages/PagosPageContent'
import { getUsuario } from '@/lib/cache'

import type { SearchParams } from '@/types'

export default async function PagosPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams
  const usuario = await getUsuario()
  const qParam = Array.isArray(sp?.q) ? sp.q[0] : (sp?.q ?? '')
  const direccionParam = Array.isArray(sp?.direccion)
    ? sp.direccion[0]
    : sp?.direccion

  return (
    <PagosPageContent
      searchQuery={qParam}
      direccionObra={qParam || direccionParam}
      fechaDesde={
        Array.isArray(sp?.fechaDesde) ? sp.fechaDesde[0] : sp?.fechaDesde
      }
      fechaHasta={
        Array.isArray(sp?.fechaHasta) ? sp.fechaHasta[0] : sp?.fechaHasta
      }
      montoMin={
        sp?.montoMin
          ? Number(Array.isArray(sp.montoMin) ? sp.montoMin[0] : sp.montoMin)
          : undefined
      }
      montoMax={
        sp?.montoMax
          ? Number(Array.isArray(sp.montoMax) ? sp.montoMax[0] : sp.montoMax)
          : undefined
      }
      canCreate={
        usuario?.rol_actual === 'VENTAS' || usuario?.rol_actual === 'ADMIN'
      }
      usuarioRol={usuario?.rol_actual}
      page={sp?.page ? Number(sp.page) : undefined}
    />
  )
}
