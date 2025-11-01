import { Suspense } from 'react'
import { Users, Plus } from 'lucide-react'
import { obtenerClientes } from '@/actions/clientes'
import { obtenerEmpleadoActual } from '@/actions/empleado'
import ClienteCard from '@/components/shared/ClienteCard'
import SearchWrapper from '@/components/shared/SearchWrapper'
import Link from 'next/link'
import type { Cliente } from '@/types'

// ✅ Skeleton para loading
function ClientesListSkeleton() {
  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-3 h-6 w-3/4 animate-pulse rounded bg-gray-200"></div>
          <div className="space-y-2">
            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200"></div>
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

// ✅ Tipar clientes correctamente
async function ClientesGrid({ searchQuery }: { searchQuery?: string }) {
  let clientes: Cliente[] = []

  try {
    clientes = await obtenerClientes(searchQuery)
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
        {!searchQuery && (
          <Link
            href="/ventas/clientes/crear"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Agregar Cliente
          </Link>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clientes.map((cliente) => (
          <ClienteCard key={cliente.cuil} cliente={cliente} />
        ))}
      </div>
      <div className="mt-6 text-center text-sm text-gray-600">
        Mostrando {clientes.length} cliente{clientes.length !== 1 ? 's' : ''}
      </div>
    </>
  )
}

// ✅ Page como Server Component
export default async function ClientesPage({
  searchParams,
}: {
  searchParams?: any
}) {
  const sp = await searchParams
  const [usuarioResponse] = await Promise.all([obtenerEmpleadoActual()])

  const usuario = usuarioResponse?.data
  const esVentas = usuario?.rol_actual === 'VENTAS'

  const filtros = {
    searchQuery: sp?.q ?? '',
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Clientes
              </h1>
              <p className="text-sm text-gray-600">
                Gestión de clientes y empresas
              </p>
            </div>
          </div>
          {esVentas && (
            <Link
              href="/ventas/clientes/crear"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-700 sm:w-auto"
            >
              <Plus className="h-5 w-5" />
              Nuevo Cliente
            </Link>
          )}
        </div>

        {/* Buscador */}
        <SearchWrapper
          placeholder="Buscar por razón social, CUIL, email o teléfono..."
          initialValue={filtros.searchQuery}
        />

        {/* Grid con Suspense */}
        <Suspense key={filtros.searchQuery} fallback={<ClientesListSkeleton />}>
          <ClientesGrid searchQuery={filtros.searchQuery} />
        </Suspense>
      </div>
    </div>
  )
}
