import { Suspense } from 'react'
import { DollarSign } from 'lucide-react'
import { getPagos } from '@/actions/pagos'
import ObraPagosCard from '@/components/shared/ObraPagosCard'
import SearchWrapper from '@/components/shared/SearchWrapper'
import PagosFiltros from '@/components/shared/PagosFiltros'
import CrearPagoButton from '@/components/ventas/pagos/CrearPagoButton'
import { PagosFilter, Obra } from '@/types'

function PagosListSkeleton() {
  return (
    <div className="grid gap-4 sm:gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 space-y-3">
              <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

async function PagosGrid({
  filters,
  usuarioRol,
}: {
  filters: PagosFilter
  usuarioRol?: string
}) {
  const pagosData = await getPagos(filters)

  if (pagosData.length === 0) {
    return (
      <div className="mt-8 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No se encontraron pagos
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Intenta ajustar los filtros o registra un nuevo pago.
        </p>
      </div>
    )
  }

  // Calculate totals
  const totalPagos = pagosData.length
  const totalMonto = pagosData.reduce((sum, pago) => sum + pago.monto, 0)

  // Group by Obra
  const obrasMap = new Map<number, { obraInfo: Obra | undefined, pagos: typeof pagosData, totalPagado: number }>()

  pagosData.forEach(pago => {
    // Handling case where pago does not have an obra associated directly (backend safeguard)
    const cod_obra = pago.cod_obra || (pago.obra ? pago.obra.cod_obra : 0)
    if (!obrasMap.has(cod_obra)) {
      obrasMap.set(cod_obra, {
        obraInfo: pago.obra,
        pagos: [],
        totalPagado: 0
      })
    }
    const group = obrasMap.get(cod_obra)!
    group.pagos.push(pago)
    group.totalPagado += pago.monto
  })

  // Convert map to array and sort by latest payment
  const obrasGrouped = Array.from(obrasMap.values()).sort((a, b) => {
    // Get latest payment for each group
    const maxDateA = Math.max(...a.pagos.map(p => new Date(p.fecha_pago).getTime()))
    const maxDateB = Math.max(...b.pagos.map(p => new Date(p.fecha_pago).getTime()))
    return maxDateB - maxDateA
  })

  return (
    <div>
      <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 inline-block">
        Mostrando <span className="font-semibold text-gray-900">{totalPagos}</span> pagos en <span className="font-semibold text-gray-900">{obrasGrouped.length}</span> obras
        • Total: <span className="font-semibold text-green-700">${totalMonto.toLocaleString()}</span>
      </div>
      <div className="grid gap-4 sm:gap-6">
        {obrasGrouped.map((group, index) => (
          <ObraPagosCard
            key={group.obraInfo?.cod_obra || index}
            obraInfo={group.obraInfo}
            pagos={group.pagos}
            totalPagado={group.totalPagado}
            usuarioRol={usuarioRol}
          />
        ))}
      </div>
    </div>
  )
}

interface PagosPageContentProps {
  searchQuery?: string
  fechaDesde?: string
  fechaHasta?: string
  montoMin?: number
  montoMax?: number
  canCreate?: boolean
  usuarioRol?: string
  title?: string
  subtitle?: string
}

export default async function PagosPageContent({
  searchQuery = '',
  fechaDesde,
  fechaHasta,
  montoMin,
  montoMax,
  canCreate = false,
  usuarioRol,
  title = 'Pagos',
  subtitle = 'Visualiza, filtra y registra los pagos de obras.',
}: PagosPageContentProps) {

  const filtros: PagosFilter = {
    search: searchQuery, // map standard query to consolidated 'search'
    fechaDesde,
    fechaHasta,
    montoMin,
    montoMax,
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {title}
              </h1>
              <p className="text-sm text-gray-600">{subtitle}</p>
            </div>
          </div>
          {canCreate && (
            <CrearPagoButton />
          )}
        </div>

        {/* Buscador */}
        <div className="mb-6">
          <SearchWrapper
            placeholder="Buscar por cliente, razón social o dirección..."
            initialValue={searchQuery}
            paramName="q"
          />
        </div>

        {/* Filtros */}
        <div className="mb-8">
          <PagosFiltros
            fechaDesde={fechaDesde}
            fechaHasta={fechaHasta}
            montoMin={montoMin}
            montoMax={montoMax}
          />
        </div>

        {/* Grid con Suspense */}
        <Suspense
          key={JSON.stringify(filtros)}
          fallback={<PagosListSkeleton />}
        >
          <PagosGrid
            filters={filtros}
            usuarioRol={usuarioRol}
          />
        </Suspense>
      </div>
    </div>
  )
}
