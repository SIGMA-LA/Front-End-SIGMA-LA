import { Metadata } from 'next'
import ObraDetalleView from '@/components/admin/ObraDetalleView'
import { getObraById } from '@/actions/obras'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Detalle de Obra | SIGMA-LA',
  description: 'Información completa de la obra',
}

const ObraDetalleSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 w-1/2 rounded bg-gray-200"></div>
      <div className="h-4 w-1/4 rounded bg-gray-200"></div>
      <div className="h-4 w-1/4 rounded bg-gray-200"></div>
    </div>
  )
}

export default async function ObraDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const obraId = Number(id)

  // Cargar todos los datos en paralelo en el servidor
  const obra = await getObraById(obraId)

  // Prisma devuelve las relaciones con los nombres del schema (singular)
  const visitas = (obra as any)?.visita || obra?.visitas || []
  const entregas = (obra as any)?.entrega || obra?.entregas || []
  const pagos = (obra as any)?.pago || obra?.pagos || []
  const presupuestos = (obra as any)?.presupuesto || obra?.presupuesto || []

  if (!obra) {
    return (
      <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <p>Obra no encontrada</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <Suspense fallback={<ObraDetalleSkeleton />}>
          <ObraDetalleView
            obra={obra}
            visitas={visitas}
            entregas={entregas}
            pagos={pagos}
            presupuestos={presupuestos}
          />
        </Suspense>
      </div>
    </main>
  )
}
