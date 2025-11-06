import CrearVisita from '@/components/coordinacion/CrearVisita'
import { obtenerVisitaPorId } from '@/actions/visitas'
import { obtenerProvincias, localidadesPorProvincia } from '@/actions/localidad'
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
    obtenerProvincias(),
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
