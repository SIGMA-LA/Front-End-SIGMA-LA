import CrearObra from '@/components/ventas/CrearObra'
import { getClientes } from '@/actions/clientes'
import { getObra } from '@/actions/obras'

interface EditarObraPageProps {
  params: Promise<{ id: string }>
}

export default async function EditarObraPage({ params }: EditarObraPageProps) {
  const { id } = await params
  const [clientes, obra] = await Promise.all([
    getClientes(),
    getObra(Number(id)),
  ])

  if (!obra) return <div>Obra no encontrada</div>

  return <CrearObra clientes={clientes} obraExistente={obra} />
}
