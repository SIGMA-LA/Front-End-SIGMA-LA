import CrearVisita from '@/components/coordinacion/CrearVisita'
import { getVisita } from '@/actions/visitas'
import { getLocalidadesByProvincia } from '@/actions/localidad'
import { getProvincias } from '@/lib/cache'
import { getVehiculosDisponibles } from '@/actions/vehiculos'
import { getVisitadores } from '@/actions/empleado'
import { getObras } from '@/actions/obras'

export default async function EditarVisitaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [visita, provincias, vehiculos, empleados] = await Promise.all([
    getVisita(Number(id)),
    getProvincias(),
    getVehiculosDisponibles(),
    getVisitadores(),
  ])

  return (
    <CrearVisita
      provincias={provincias}
      vehiculos={vehiculos}
      empleados={empleados}
      visitaEditar={visita}
      buscarObras={getObras}
      buscarLocalidades={getLocalidadesByProvincia}
    />
  )
}
