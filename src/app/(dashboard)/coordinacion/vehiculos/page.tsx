import { getVehiculos } from '@/actions/vehiculos'
import VehiculosPageContent from '@/components/pages/VehiculosPageContent'

export default async function VehiculosPage() {
  const vehiculos = await getVehiculos()
  return <VehiculosPageContent vehiculos={vehiculos} />
}
