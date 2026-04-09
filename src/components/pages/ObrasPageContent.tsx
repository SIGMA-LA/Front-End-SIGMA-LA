import { Suspense } from 'react'
import { Building2, Plus } from 'lucide-react'
import { getObras, filterObras } from '@/actions/obras'
import { getLocalidadesByProvincia } from '@/actions/localidad'
import { getProvincias } from '@/lib/cache'
import ObraCard from '@/components/shared/ObraCard'
import SearchWrapper from '@/components/shared/SearchWrapper'
import ObrasFiltros from '@/components/shared/ObrasFiltros'
import PaginationControls from '@/components/shared/PaginationControls'
import Link from 'next/link'
import type { EstadoObra, RolEmpleado } from '@/types'

function ObrasListSkeleton() {
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
                <div className="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

async function ObrasGrid({
  searchQuery,
  estado,
  cod_localidad,
  usuarioRol,
  page,
  pageSize,
}: {
  searchQuery?: string
  estado?: EstadoObra
  cod_localidad?: number
  usuarioRol?: RolEmpleado | undefined
  page: number
  pageSize: number
}) {
  // Cargar provincias y obras en paralelo
  const [provincias, obrasResult] = await Promise.all([
    getProvincias(),
    (async () => {
      try {
        if (searchQuery) {
          return await getObras(searchQuery, page, pageSize)
        } else {
          return await filterObras({ estado, cod_localidad, page, pageSize })
        }
      } catch (err) {
        console.error('Error cargando obras:', err)
        return { data: [], total: 0, totalPages: 0, page, pageSize }
      }
    })(),
  ])

  if (obrasResult.data.length === 0) {
    return (
      <div className="mt-8 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No se encontraron obras
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Intenta ajustar los filtros o crea una nueva obra.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:gap-6">
        {obrasResult.data.map((obra) => (
          <ObraCard
            key={obra.cod_obra}
            obra={obra}
            provincias={provincias}
            usuarioRol={usuarioRol}
          />
        ))}
      </div>

      <PaginationControls
        page={obrasResult.page}
        totalPages={obrasResult.totalPages}
        total={obrasResult.total}
        pageSize={obrasResult.pageSize}
      />
    </>
  )
}

interface ObrasPageContentProps {
  searchQuery?: string
  estado?: EstadoObra
  cod_localidad?: number
  canCreate?: boolean
  createUrl?: string
  usuarioRol?: RolEmpleado | undefined
  title?: string
  subtitle?: string
  page?: number
  pageSize?: number
}

export default async function ObrasPageContent({
  searchQuery = '',
  estado,
  cod_localidad,
  canCreate = false,
  createUrl = '/ventas/obras/crear',
  usuarioRol,
  title = 'Obras',
  subtitle = 'Visualiza, filtra y gestiona todas las obras.',
  page = 1,
  pageSize = 10,
}: ObrasPageContentProps) {
  // Cargar provincias para los filtros (esto es rápido, viene de cache)
  const provincias = await getProvincias()

  const filtros = {
    searchQuery,
    estado,
    cod_localidad,
    page,
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {title}
              </h1>
              <p className="text-sm text-gray-600">{subtitle}</p>
            </div>
          </div>
          {canCreate && (
            <Link
              href={createUrl}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-700 sm:w-auto"
            >
              <Plus className="h-5 w-5" />
              Nueva Obra
            </Link>
          )}
        </div>

        {/* Buscador */}
        <div className="mb-6">
          <SearchWrapper
            placeholder="Buscar obra por dirección, cliente..."
            initialValue={searchQuery}
            clearOtherParams={['estado', 'cod_localidad', 'page']}
          />
        </div>

        {/* Filtros */}
        <div className="mb-8">
          <ObrasFiltros
            provincias={provincias}
            buscarLocalidades={getLocalidadesByProvincia}
            estadoInicial={estado}
            localidadInicial={cod_localidad}
          />
        </div>

        {/* Grid con Suspense - Solo las obras se cargan async */}
        <Suspense
          key={JSON.stringify(filtros)}
          fallback={<ObrasListSkeleton />}
        >
          <ObrasGrid
            searchQuery={searchQuery}
            estado={estado}
            cod_localidad={cod_localidad}
            usuarioRol={usuarioRol}
            page={page}
            pageSize={pageSize}
          />
        </Suspense>
      </div>
    </div>
  )
}
