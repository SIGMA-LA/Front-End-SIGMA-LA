import CrearVisita from '@/components/coordinacion/CrearVisita'
import { obtenerVisitaPorId } from '@/actions/visitas'
import { localidadesPorProvincia } from '@/actions/localidad'
import { getProvincias } from '@/lib/cache'
import { obtenerVehiculosDisponibles } from '@/actions/vehiculos'
import { obtenerTodosLosEmpleados } from '@/actions/empleado'
import { obtenerObras } from '@/actions/obras'

export default async function EditarVisitaPage({
  params,
}: {
  params: { id: string }
}) {
  const [visita, provincias, vehiculos, empleados] = await Promise.all([
    obtenerVisitaPorId(Number(params.id)),
    getProvincias(),
    obtenerVehiculosDisponibles(),
    obtenerTodosLosEmpleados(),
  ])

  return (
    <CrearVisita
      provincias={provincias}
      vehiculos={vehiculos}
      empleados={empleados}
      visitaEditar={visita}
      buscarObras={obtenerObras}
      buscarLocalidades={localidadesPorProvincia}
    />
  )
}
