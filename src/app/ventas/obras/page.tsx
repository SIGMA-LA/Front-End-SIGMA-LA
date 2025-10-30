import ObrasList from '@/components/shared/ObrasList'
import {
  deleteObra,
  obtenerObras,
  obtenerObra,
  filtrarObrasAction,
} from '@/actions/obras'
import { obtenerProvincias, localidadesPorProvincia } from '@/actions/localidad'
import type { Obra, Provincia } from '@/types'

export default async function ObrasPage({
  searchParams,
}: {
  searchParams?: any
}) {
  const sp = await (searchParams ?? {})

  const filtros = {
    estado: sp?.estado ?? undefined,
    cod_localidad: sp?.cod_localidad ? Number(sp.cod_localidad) : undefined,
  }

  const filtroTexto = sp?.q ?? ''
  let obras: Obra[] = []
  let provincias: Provincia[] = []

  try {
    if (filtroTexto) {
      obras = await obtenerObras(filtroTexto)
    } else {
      obras = await filtrarObrasAction({
        estado: filtros.estado,
        cod_localidad: filtros.cod_localidad,
      })
    }
    provincias = await obtenerProvincias()
  } catch (err) {
    console.error('Error cargando datos de obras en page.tsx:', err)
    obras = []
    provincias = []
  }

  return (
    <ObrasList
      obras={obras}
      provincias={provincias}
      buscarLocalidades={localidadesPorProvincia}
      onDeleteClick={deleteObra}
      obtenerObraAction={obtenerObra}
      filtrarObrasAction={filtrarObrasAction}
      searchQuery={filtroTexto}
    />
  )
}
