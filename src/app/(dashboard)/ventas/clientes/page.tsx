import ClientesPageContent from '@/components/pages/ClientesPageContent'
import { getUsuario } from '@/lib/cache'

export default async function VentasClientesPage({
  searchParams,
}: {
  searchParams?: any
}) {
  const sp = await searchParams
  const usuario = await getUsuario()

  return (
    <ClientesPageContent
      searchQuery={sp?.q ?? ''}
      canCreate={usuario?.rol_actual === 'VENTAS'}
      createUrl="/ventas/clientes/crear"
    />
  )
}
