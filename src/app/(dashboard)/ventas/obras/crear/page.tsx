import CrearObra from '@/components/ventas/CrearObra'
import { obtenerClientes } from '@/actions/clientes'

export default async function CrearObraPage() {
  const clientes = await obtenerClientes()

  return (
    <CrearObra
      clientes={clientes}
      onCancel={() => {}}
      onSubmit={async (obraData, presupuesto) => {}}
    />
  )
}
