import { Suspense } from 'react'
import { Package, ClipboardList } from 'lucide-react'
import { getOrdenesProduccion } from '@/actions/ordenes'
import OrdenesProduccionContent from '@/components/coordinacion/orden_produccion/OrdenesProduccionContent'
import SearchWrapper from '@/components/shared/SearchWrapper'
import type { OrdenProduccion, EstadoOrdenProduccion } from '@/types'

function OrdenesListSkeleton() {
  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="h-6 w-1/4 rounded bg-gray-200"></div>
              <div className="h-6 w-1/4 rounded-full bg-gray-200"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 w-3/4 rounded bg-gray-200"></div>
              <div className="h-4 w-1/2 rounded bg-gray-200"></div>
              <div className="h-4 w-2/3 rounded bg-gray-200"></div>
            </div>
            <div className="mt-4 flex gap-2">
              <div className="h-10 flex-1 rounded-lg bg-gray-200"></div>
              <div className="h-10 flex-1 rounded-lg bg-gray-200"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

async function OrdenesGrid({
  searchQuery,
  estado,
}: {
  searchQuery?: string
  estado?: string
}) {
  // Ajustamos el estado para que coincida con lo que espera la acción
  const estadoFilter = estado as EstadoOrdenProduccion | undefined


  const result = await getOrdenesProduccion(estadoFilter)

  if (!result.success) {
    return (
      <div className="rounded-lg border-2 border-dashed border-red-200 p-12 text-center">
        <p className="text-red-600">
          Error al cargar las órdenes: {result.error}
        </p>
      </div>
    )
  }

  let ordenes = result.data || []

  // Filtrado por texto en el servidor si hay searchQuery
  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    ordenes = ordenes.filter((o: OrdenProduccion) => {
      const codStr = o.cod_op.toString().toLowerCase()
      const direccion = o.obra?.direccion?.toLowerCase() || ''
      const clienteNombre = o.obra?.cliente?.nombre?.toLowerCase() || ''
      const clienteApellido = o.obra?.cliente?.apellido?.toLowerCase() || ''
      const razonSocial = o.obra?.cliente?.razon_social?.toLowerCase() || ''

      return (
        codStr.includes(q) ||
        direccion.includes(q) ||
        clienteNombre.includes(q) ||
        clienteApellido.includes(q) ||
        razonSocial.includes(q)
      )
    })
  }

  return <OrdenesProduccionContent ordenes={ordenes} />
}

interface OrdenesPageContentProps {
  searchQuery?: string
  estadoInitial?: string
}

export default async function OrdenesPageContent({
  searchQuery = '',
  estadoInitial = 'PENDIENTE',
}: OrdenesPageContentProps) {
  // El filtro 'estadoInitial' lo usa el componente cliente para su estado por defecto
  // y nosotros para la búsqueda inicial en el servidor.
  
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 shadow-sm border border-blue-200">
              <ClipboardList className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Órdenes de Producción
              </h1>
              <p className="text-sm text-gray-600">
                Visualiza, aprueba y gestiona todas las órdenes de producción.
              </p>
            </div>
          </div>
        </div>

        {/* Buscador */}
        <div className="mb-6">
          <SearchWrapper
            placeholder="Buscar por código, dirección de obra o cliente..."
            initialValue={searchQuery}
            clearOtherParams={['estado']}
          />
        </div>

        {/* Listado con Suspense */}
        <Suspense
          key={`${searchQuery}-${estadoInitial}`}
          fallback={<OrdenesListSkeleton />}
        >
          <OrdenesGrid searchQuery={searchQuery} estado={estadoInitial} />
        </Suspense>
      </div>
    </div>
  )
}
