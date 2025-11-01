import { Calendar, Plus } from 'lucide-react'
import { Suspense } from 'react'
import { obtenerVisitas } from '@/actions/visitas'
import VisitaCard from '@/components/shared/VisitaCard'
import Link from 'next/link'

async function VisitasList({
  searchQuery,
  rolActual,
}: {
  searchQuery?: string
  rolActual?: string
}) {
  const visitas = await obtenerVisitas()

  if (visitas.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          {searchQuery
            ? 'No se encontraron visitas'
            : 'No hay visitas registradas'}
        </h3>
        <p className="mt-2 text-gray-600">
          {searchQuery
            ? 'Intenta con otros términos de búsqueda'
            : 'Comienza agendando tu primera visita'}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {visitas.map((visita) => (
          <VisitaCard
            key={visita.cod_visita}
            visita={visita}
            rolActual={rolActual}
          />
        ))}
      </div>
      <div className="mt-6 text-center text-sm text-gray-600">
        Mostrando {visitas.length} visita{visitas.length !== 1 ? 's' : ''}
      </div>
    </>
  )
}

function VisitasListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="border-b bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-3">
            <div className="h-5 w-64 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="p-6">
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-start gap-3">
                  <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200"></div>
                  <div className="flex-1">
                    <div className="mb-2 h-3 w-16 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-5 w-24 animate-pulse rounded bg-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
              <div className="h-8 w-20 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

interface VisitasPageContentProps {
  searchQuery?: string
  canCreate?: boolean
  createUrl?: string
  rolActual?: string
  title?: string
  subtitle?: string
}

export default async function VisitasPageContent({
  searchQuery = '',
  canCreate = false,
  createUrl = '/coordinacion/visitas/crear',
  rolActual,
  title = 'Visitas',
  subtitle = 'Gestión de visitas a obras y clientes',
}: VisitasPageContentProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
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
              Nueva Visita
            </Link>
          )}
        </div>

        {/* Lista con Suspense */}
        <Suspense key={searchQuery} fallback={<VisitasListSkeleton />}>
          <VisitasList searchQuery={searchQuery} rolActual={rolActual} />
        </Suspense>
      </div>
    </div>
  )
}
