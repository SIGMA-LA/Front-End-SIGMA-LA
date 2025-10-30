import ClientesList from '@/components/shared/ClientesList'

import { obtenerClientes, eliminarCliente } from '@/actions/clientes'
import type { Cliente } from '@/types'

export default async function ClientesPage({
  searchParams,
}: {
  searchParams?: { q?: string }
}) {
  const filtro = (await searchParams?.q) ?? ''
  let clientes: Cliente[] = []

  try {
    clientes = await obtenerClientes(filtro)
  } catch (err) {
    console.error('Error cargando datos de clientes en page.tsx:', err)
  }

  return (
    <>
      <ClientesList clientes={clientes} />
    </>
  )
}
