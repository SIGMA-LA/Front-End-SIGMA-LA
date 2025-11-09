import CrearVisita from '@/components/coordinacion/CrearVisita'
import { localidadesPorProvincia } from '@/actions/localidad'
import { getProvincias } from '@/lib/cache'
import { obtenerVehiculosDisponibles } from '@/actions/vehiculos'
import { obtenerTodosLosEmpleados } from '@/actions/empleado'
import { obtenerObras, obtenerObra } from '@/actions/obras'

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
      obtenerVehiculosDisponibles(),
      obtenerTodosLosEmpleados(),
      obraId ? obtenerObra(Number(obraId)) : null,
    ])

  return (
    <CrearVisita
      provincias={provincias}
      vehiculos={vehiculos}
      empleados={Array.isArray(empleados) ? empleados : []}
      buscarObras={obtenerObras}
      buscarLocalidades={localidadesPorProvincia}
      preloadedObra={obraPreseleccionada}
    />
  )
}
