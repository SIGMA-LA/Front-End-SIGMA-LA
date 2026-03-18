import CrearObra from '@/components/ventas/CrearObra'
import { getProvincias } from '@/actions/localidad'

export default async function CrearObraPage() {
  const provincias = await getProvincias()

  return <CrearObra provincias={provincias} />
}
