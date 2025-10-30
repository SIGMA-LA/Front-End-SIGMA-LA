import ClientesList from '@/components/shared/ClientesList'
import { obtenerClientes } from '@/actions/clientes'
import type { Cliente } from '@/types'
import { eliminarCliente } from '@/actions/clientes'

export default async function VentasClientesPage({
  searchParams,
}: {
  searchParams?: { q?: string } | Promise<{ q?: string }>
}) {
  const resolved = await (searchParams as
    | Promise<{ q?: string }>
    | { q?: string }
    | undefined)
  const filtro = resolved?.q ?? ''

  let clientes: Cliente[] = []
  try {
    clientes = await obtenerClientes(filtro)
  } catch (err) {
    console.error('Error cargando clientes (ventas):', err)
  }

  return <ClientesList clientes={clientes} deleteAction={eliminarCliente} />
}
