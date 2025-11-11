import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { getMaquinaria } from '@/actions/maquinarias'
import MaquinariaForm from '@/components/coordinacion/maquinaria/MaquinariaForm'

async function EditarMaquinariaContent({ id }: { id: string }) {
  const maquinaria = await getMaquinaria(Number(id))
  if (!maquinaria) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">No se encontró la maquinaria</p>
      </div>
    )
  }

  return <MaquinariaForm maquinariaToEdit={maquinaria} />
}

function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
        <p className="mt-4 text-gray-600">Cargando maquinaria...</p>
      </div>
    </div>
  )
}

export default async function EditarMaquinariaPage({
  params,
}: {
  params: any
}) {
  const { id } = await params

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <EditarMaquinariaContent id={id} />
    </Suspense>
  )
}
