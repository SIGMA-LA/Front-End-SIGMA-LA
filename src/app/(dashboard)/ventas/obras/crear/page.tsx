import CrearObra from '@/components/ventas/CrearObra'
import { getClientes } from '@/actions/clientes'

export default async function CrearObraPage() {
  const clientes = await getClientes()

  return <CrearObra clientes={clientes} />
}
