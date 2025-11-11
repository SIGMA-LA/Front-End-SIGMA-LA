import CrearVisita from '@/components/coordinacion/CrearVisita'
import { getLocalidadesByProvincia } from '@/actions/localidad'
import { getProvincias } from '@/lib/cache'
import { getVehiculosDisponibles } from '@/actions/vehiculos'
import { getEmpleados } from '@/actions/empleado'
import { getObras, getObra } from '@/actions/obras'

export default async function CrearVisitaPage({
  searchParams,
}: {
  searchParams?: any
}) {
  const sp = await searchParams
  const obraId = sp?.obraId ?? null

  const [provincias, vehiculos, empleados, obraPreseleccionada] =
    await Promise.all([
      getProvincias(),
      getVehiculosDisponibles(),
      getEmpleados(),
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
