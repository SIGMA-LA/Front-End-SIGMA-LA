import { getObra } from '@/actions/obras'
import { getEmpleadosDisponiblesEntrega } from '@/actions/empleado'
import { getVehiculos } from '@/actions/vehiculos'
import { getMaquinariasDisponibles } from '@/actions/maquinarias'
import CrearEntregaForm from '@/components/coordinacion/CrearEntregaForm'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'

async function CrearEntregaContent({ obraId }: { obraId: string | null }) {
  const [obra, empleados, vehiculos, maquinarias] = await Promise.all([
    obraId ? getObra(Number(obraId)) : null,
    getEmpleadosDisponiblesEntrega(),
    getVehiculos(),
    getMaquinariasDisponibles(),
  ])

  return (
    <CrearEntregaForm
      preloadedObra={obra}
      empleados={empleados}
      vehiculos={vehiculos}
      maquinarias={maquinarias}
    />
  )
}

function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin pt-10 text-blue-600" />
        <p className="mt-4 text-gray-600">Cargando formulario...</p>
      </div>
    </div>
  )
}

export default async function CrearEntregaPage({
  searchParams,
}: {
  searchParams?: any
}) {
  const sp = await searchParams
  const obraId = sp?.obraId ?? null

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CrearEntregaContent obraId={obraId} />
    </Suspense>
  )
}
