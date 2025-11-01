import CrearVisita from '@/components/coordinacion/CrearVisita'
import { obtenerProvincias, localidadesPorProvincia } from '@/actions/localidad'
import { obtenerVehiculosDisponibles } from '@/actions/vehiculos'
import { obtenerTodosLosEmpleados } from '@/actions/empleado'
import { obtenerObras } from '@/actions/obras'

export default async function CrearVisitaPage() {
  const provincias = await obtenerProvincias()
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
