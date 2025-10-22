import ObrasList from '@/components/shared/ObrasList'
import {
  obtenerObrasCompletas,
  deleteObra,
  obtenerObras,
} from '@/actions/obras'
import { obtenerProvincias, localidadesPorProvincia } from '@/actions/localidad'
import type { Obra } from '@/types'
import { revalidatePath } from 'next/cache'
import ObrasClientWrapper from '@/components/shared/ObraSearchWrapper'

export default async function ObrasPage({
  searchParams,
}: {
  searchParams?: any
}) {
  const filtros = {
    estado: searchParams?.estado ?? undefined,
    cod_localidad: searchParams?.cod_localidad
      ? Number(searchParams.cod_localidad)
      : undefined,
    cod_provincia: searchParams?.cod_provincia
      ? Number(searchParams.cod_provincia)
      : undefined,
  }

  const obras: Obra[] = await obtenerObrasCompletas({
    estado: filtros.estado,
    cod_localidad: filtros.cod_localidad,
  })
  const provincias = await obtenerProvincias()
  const localidades = filtros.cod_provincia
    ? await localidadesPorProvincia(filtros.cod_provincia)
    : []

  return (
    <>
      <ObrasClientWrapper
        obras={obras}
        provincias={provincias}
        localidades={localidades}
        // paso la server action para que el componente cliente la invoque
        searchAction={obtenerObras}
      />
      <ObrasList
        obras={obras}
        provincias={provincias}
        localidades={localidades}
        buscarObrasAction={obtenerObras}
        onFilterChange={() => {
          /* filtrar se hace cambiando searchParams desde el cliente (router.push/replace) */
        }}
      />
    </>
  )
}
