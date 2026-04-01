import CrearEntregaForm from '@/components/coordinacion/CrearEntregaForm'
import { getEntrega } from '@/actions/entregas'
import { getObrasParaEntrega } from '@/actions/obras'
import { getVehiculos } from '@/actions/vehiculos'
import { getMaquinarias } from '@/actions/maquinarias'
import { getEmpleadosDisponiblesEntrega } from '@/actions/empleado'
import { notFound } from 'next/navigation'

export default async function EditarEntregaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const entregaId = parseInt(id)

  const [entrega, obras, vehiculos, maquinarias, empleados] = await Promise.all([
    getEntrega(entregaId),
    getObrasParaEntrega(),
    getVehiculos(),
    getMaquinarias(),
    getEmpleadosDisponiblesEntrega(),
  ])

  if (!entrega) {
    notFound()
  }

  return (
    <CrearEntregaForm
      preloadedObra={entrega.obra}
      entregaToEdit={entrega}
      empleados={empleados}
      vehiculos={vehiculos}
      maquinarias={maquinarias}
    />
  )
}
