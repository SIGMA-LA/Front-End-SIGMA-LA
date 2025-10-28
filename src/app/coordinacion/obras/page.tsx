import ObrasList from '@/components/shared/ObrasList'
import {
  obtenerObrasCompletas,
  deleteObra,
  obtenerObras,
  obtenerObra,
  filtrarObrasAction,
} from '@/actions/obras'
import { obtenerProvincias, localidadesPorProvincia } from '@/actions/localidad'
import type { Obra, Localidad, Provincia } from '@/types'

export default async function ObrasPage({
  searchParams,
}: {
  searchParams?: any
}) {
  const sp = await (searchParams ?? {})

  const filtros = {
    estado: sp?.estado ?? undefined,
    cod_localidad: sp?.cod_localidad ? Number(sp.cod_localidad) : undefined,
    cod_provincia: sp?.cod_provincia ? Number(sp.cod_provincia) : undefined,
  }

  let obras: Obra[] = []
  let provincias: Provincia[] = []
  let localidades: Localidad[] = []

  try {
    obras = await obtenerObrasCompletas({
      estado: filtros.estado,
      cod_localidad: filtros.cod_localidad,
    })
    provincias = await obtenerProvincias()
    localidades = filtros.cod_provincia
      ? await localidadesPorProvincia(filtros.cod_provincia)
      : []
  } catch (err) {
    console.error('Error cargando datos de obras en page.tsx:', err)
    obras = []
    provincias = []
    localidades = []
  }
  return (
    <ObrasList
      obras={obras}
      provincias={provincias}
      localidades={localidades}
      buscarObrasAction={obtenerObras}
      onDeleteClick={deleteObra}
      obtenerObraAction={obtenerObra}
      filtrarObrasAction={filtrarObrasAction}
    />
  )
}
