import ClientesList from '@/components/shared/ClientesList'
import {
  obtenerClientes,
  actualizarCliente,
  eliminarCliente,
  crearCliente,
} from '@/actions/clientes'
import type { Cliente } from '@/types'

export default async function ClientesPage({}: { searchParams?: any }) {
  let clientes: Cliente[] = []

  try {
    clientes = await obtenerClientes()
  } catch (err) {
    console.error('Error cargando datos de clientes en page.tsx:', err)
  }
  return <ClientesList clientes={clientes} onDeleteClick={eliminarCliente} />
}
