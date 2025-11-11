import CrearVisita from '@/components/coordinacion/CrearVisita'
import { getVisita } from '@/actions/visitas'
import { getLocalidadesByProvincia } from '@/actions/localidad'
import { getProvincias } from '@/lib/cache'
import { getVehiculosDisponibles } from '@/actions/vehiculos'
import { getEmpleadosDisponiblesEntrega } from '@/actions/empleado'
import { getObras } from '@/actions/obras'

export default async function EditarVisitaPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = await params

  const [visita, provincias, vehiculos, empleados] = await Promise.all([
    getVisita(Number(id)),
    getProvincias(),
    getVehiculosDisponibles(),
    getEmpleadosDisponiblesEntrega(),
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
