import { Suspense } from 'react'
import { Users, Plus } from 'lucide-react'
import { getClientes } from '@/actions/clientes'
import { getUsuario } from '@/lib/cache'
import ClienteCard from '@/components/shared/ClienteCard'
import SearchWrapper from '@/components/shared/SearchWrapper'
import ClientesToastFromQuery from '@/components/pages/ClientesToastFromQuery'
import PaginationControls from '@/components/shared/PaginationControls'
import Link from 'next/link'
import type { Cliente, PaginatedResponse } from '@/types'

function ClientesListSkeleton() {
  return (
    <div className="grid gap-4 sm:gap-5">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-3 h-5 w-28 animate-pulse rounded-full bg-gray-200"></div>
          <div className="space-y-3">
            <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="mt-4 flex gap-2">
            <div className="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
            <div className="h-8 w-20 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

async function ClientesGrid({ searchQuery, page = 1 }: { searchQuery?: string; page?: number }) {
  let clientesResponse: PaginatedResponse<Cliente> | null = null
  let clientes: Cliente[] = []
  const usuario = await getUsuario()

  try {
    clientesResponse = await getClientes(searchQuery, page, 10)
    clientes = clientesResponse?.data || []
  } catch (err) {
    console.error('Error cargando clientes:', err)
  }

  if (clientes.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <Users className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          {searchQuery
            ? 'No se encontraron clientes'
            : 'No hay clientes registrados'}
        </h3>
        <p className="mt-2 text-gray-600">
          {searchQuery
            ? 'Intenta con otros términos de búsqueda'
            : 'Comienza agregando tu primer cliente'}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:gap-5">
        {clientes.map((cliente) => (
          <ClienteCard key={cliente.cuil} cliente={cliente} usuario={usuario} />
        ))}
      </div>
      {clientesResponse && (
        <div className="mt-6 flex flex-col items-center gap-4">
          <PaginationControls
            totalPages={clientesResponse.totalPages}
            page={clientesResponse.page}
            total={clientesResponse.total}
            pageSize={clientesResponse.pageSize}
          />
          <div className="text-sm text-gray-600">
            Mostrando {clientes.length} de {clientesResponse.total} cliente{clientesResponse.total !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </>
  )
}

interface ClientesPageContentProps {
  searchQuery?: string
  page?: number
  toast?: string
  canCreate?: boolean
  createUrl?: string
  title?: string
  subtitle?: string
}

export default async function ClientesPageContent({
  searchQuery = '',
  page = 1,
  toast,
  canCreate = false,
  createUrl = '/ventas/clientes/crear',
  title = 'Clientes',
  subtitle = 'Gestión de clientes y empresas',
}: ClientesPageContentProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ClientesToastFromQuery toast={toast} />
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
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
              Nuevo Cliente
            </Link>
          )}
        </div>

        <div className="mb-8">
          <SearchWrapper
            placeholder="Buscar por razón social, CUIL, email o teléfono..."
            initialValue={searchQuery}
          />
        </div>

        <Suspense key={`${searchQuery}-${page}`} fallback={<ClientesListSkeleton />}>
          <ClientesGrid searchQuery={searchQuery} page={page} />
        </Suspense>
      </div>
    </div>
  )
}
