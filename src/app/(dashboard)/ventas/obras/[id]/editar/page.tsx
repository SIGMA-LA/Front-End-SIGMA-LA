import CrearObra from '@/components/ventas/CrearObra'
import { obtenerClientes } from '@/actions/clientes'
import { getObraById } from '@/services/obra.service'

interface EditarObraPageProps {
  params: Promise<{ id: string }>
}

export default async function EditarObraPage({ params }: EditarObraPageProps) {
  const { id } = await params
  const [clientes, obra] = await Promise.all([
    obtenerClientes(),
    getObraById(Number(id)),
  ])

  if (!obra) return <div>Obra no encontrada</div>

  return (
    <CrearObra
      clientes={clientes}
      obraExistente={obra}
      onCancel={() => {}}
      onSubmit={async (obraData, presupuestos) => {}}
    />
  )
}
