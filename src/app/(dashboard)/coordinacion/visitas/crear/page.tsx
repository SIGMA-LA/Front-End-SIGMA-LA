import CrearVisita from '@/components/coordinacion/CrearVisita'
import { obtenerProvincias, localidadesPorProvincia } from '@/actions/localidad'
import { obtenerVehiculosDisponibles } from '@/actions/vehiculos'
import { obtenerVisitadores } from '@/actions/empleado'
import { obtenerObras } from '@/actions/obras'

export default async function CrearVisitaPage() {
  const provincias = await obtenerProvincias()
  const vehiculos = await obtenerVehiculosDisponibles()
  const visitadores = await obtenerVisitadores()
  return (
    <CrearVisita
      provincias={provincias}
      vehiculos={vehiculos}
      visitadores={Array.isArray(visitadores) ? visitadores : []}
      buscarObras={obtenerObras}
      buscarLocalidades={localidadesPorProvincia}
    />
  )
}
