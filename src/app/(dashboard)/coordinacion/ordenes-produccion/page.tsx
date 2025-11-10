import { Suspense } from 'react'
import { Package } from 'lucide-react'
import { obtenerOrdenesProduccion } from '@/actions/ordenes'
import OrdenesProduccionContent from '@/components/coordinacion/orden_produccion/OrdenesProduccionContent'

async function OrdenesProduccionList({
  estadoFiltro,
}: {
  estadoFiltro?: string
}) {
  const estadoParam = estadoFiltro as
    | 'PENDIENTE'
    | 'APROBADA'
    | 'EN PRODUCCION'
    | 'FINALIZADA'
    | undefined

  const result = await obtenerOrdenesProduccion(
    estadoFiltro ? estadoParam : undefined
  )

  if (!result.success) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-700">
          Error: {result.error || 'No se pudieron cargar las órdenes'}
        </p>
      </div>
    )
  }

  const ordenes = result.data || []

  return <OrdenesProduccionContent ordenes={ordenes} />
}

function OrdenesProduccionSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200"></div>
          <div>
            <div className="mb-2 h-8 w-64 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-96 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>

        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-3 h-6 w-32 animate-pulse rounded bg-gray-200"></div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="h-10 animate-pulse rounded bg-gray-200"></div>
            <div className="h-10 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white p-6"
            >
              <div className="mb-4 h-6 w-3/4 animate-pulse rounded bg-gray-200"></div>
              <div className="space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-9 flex-1 animate-pulse rounded bg-gray-200"></div>
                <div className="h-9 flex-1 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function OrdenesProduccionPage({
  searchParams,
}: {
  searchParams?: any
}) {
  const sp = await searchParams
  const estadoFiltro = sp?.estado ?? 'PENDIENTE'

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Órdenes de Producción
            </h1>
            <p className="text-sm text-gray-600">
              Gestión y aprobación de órdenes de producción
            </p>
          </div>
        </div>

        <Suspense key={estadoFiltro} fallback={<OrdenesProduccionSkeleton />}>
          <OrdenesProduccionList estadoFiltro={estadoFiltro} />
        </Suspense>
      </div>
    </div>
  )
}
