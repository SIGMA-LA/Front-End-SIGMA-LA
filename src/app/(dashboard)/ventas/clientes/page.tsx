import ClientesPageContent from '@/components/pages/ClientesPageContent'
import { obtenerEmpleadoActual } from '@/actions/empleado'

export default async function VentasClientesPage({
  searchParams,
}: {
  searchParams?: any
}) {
  const sp = await searchParams
  const [usuarioResponse] = await Promise.all([obtenerEmpleadoActual()])
  const usuario = usuarioResponse?.data

  return (
    <ClientesPageContent
      searchQuery={sp?.q ?? ''}
      canCreate={usuario?.rol_actual === 'VENTAS'}
      createUrl="/ventas/clientes/crear"
    />
  )
}
