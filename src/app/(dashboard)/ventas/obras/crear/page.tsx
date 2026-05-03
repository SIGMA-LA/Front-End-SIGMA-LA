import CrearObra from '@/components/ventas/CrearObra'
import { getProvincias } from '@/actions/localidad'
import { getVisita } from '@/actions/visitas'
import type { SearchParams } from '@/types'

export default async function CrearObraPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const provincias = await getProvincias()
  const sp = await searchParams
  const prospectoId = sp.prospecto ? Number(sp.prospecto) : undefined
  
  let prospectoData = null
  if (prospectoId) {
    prospectoData = await getVisita(prospectoId)
  }

  return <CrearObra provincias={provincias} prospecto={prospectoData} />
}
