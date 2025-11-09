import ObrasPageContent from '@/components/pages/ObrasPageContent'
import { getUsuario } from '@/lib/cache'

export default async function VentasObrasPage({
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
      canCreate={usuario?.rol_actual === 'VENTAS'}
      createUrl="/ventas/obras/crear"
      usuarioRol={usuario?.rol_actual}
    />
  )
}
