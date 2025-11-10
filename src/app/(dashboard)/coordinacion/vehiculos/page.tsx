import { obtenerVehiculos } from '@/actions/vehiculos'
import VehiculosPageContent from '@/components/pages/VehiculosPageContent'

export default async function VehiculosPage() {
  const vehiculos = await obtenerVehiculos()

  return <VehiculosPageContent vehiculos={vehiculos} />
}
