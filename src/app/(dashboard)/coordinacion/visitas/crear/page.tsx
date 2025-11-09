import CrearVisita from '@/components/coordinacion/CrearVisita'
import { localidadesPorProvincia } from '@/actions/localidad'
import { getProvincias } from '@/lib/cache'
import { obtenerVehiculosDisponibles } from '@/actions/vehiculos'
import { obtenerTodosLosEmpleados } from '@/actions/empleado'
import { obtenerObras } from '@/actions/obras'

export default async function CrearVisitaPage() {
  const provincias = await getProvincias()
  const vehiculos = await obtenerVehiculosDisponibles()
  const empleados = await obtenerTodosLosEmpleados()

  return (
    <CrearVisita
      provincias={provincias}
      vehiculos={vehiculos}
      empleados={Array.isArray(empleados) ? empleados : []}
      buscarObras={obtenerObras}
      buscarLocalidades={localidadesPorProvincia}
    />
  )
}
