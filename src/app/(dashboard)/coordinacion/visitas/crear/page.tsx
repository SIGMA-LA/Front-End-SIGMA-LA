import CrearVisita from '@/components/coordinacion/CrearVisita'
import { getLocalidadesByProvincia } from '@/actions/localidad'
import { getProvincias } from '@/lib/cache'
import { getVehiculosDisponibles } from '@/actions/vehiculos'
import { getObras, getObra } from '@/actions/obras'
import { getVisitadores } from '@/actions/empleado'

import type { SearchParams } from '@/types'

export default async function CrearVisitaPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams
  const obraId = (typeof sp.obraId === 'string' ? sp.obraId : sp.obraId?.[0]) ?? null

  const [provincias, vehiculos, empleados, obraPreseleccionada] =
    await Promise.all([
      getProvincias(),
      getVehiculosDisponibles(),
      getVisitadores(),
      obraId ? getObra(Number(obraId)) : null,
    ])

  return (
    <CrearVisita
      provincias={provincias}
      vehiculos={vehiculos}
      empleados={Array.isArray(empleados) ? empleados : []}
      buscarObras={getObras}
      buscarLocalidades={getLocalidadesByProvincia}
      preloadedObra={obraPreseleccionada}
    />
  )
}
