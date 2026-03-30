import CrearObra from '@/components/ventas/CrearObra'
import { getProvincias } from '@/actions/localidad'
import { getObra } from '@/actions/obras'

interface EditarObraPageProps {
  params: Promise<{ id: string }>
}

export default async function EditarObraPage({ params }: EditarObraPageProps) {
  const { id } = await params
  const [provincias, obra] = await Promise.all([
    getProvincias(),
    getObra(Number(id)),
  ])

  if (!obra) return <div>Obra no encontrada</div>

  return <CrearObra provincias={provincias} obraExistente={obra} />
}
