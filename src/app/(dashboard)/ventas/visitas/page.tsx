import { Calendar, Plus } from 'lucide-react'
import { Suspense } from 'react'
import { obtenerVisitas } from '@/actions/visitas'
import { obtenerEmpleadoActual } from '@/actions/empleado'
import VisitaCard from '@/components/shared/VisitaCard'
import Link from 'next/link'

// Componente que carga las visitas
async function VisitasList({ rolActual }: { rolActual?: string }) {
  const visitas = await obtenerVisitas()

  if (visitas.length === 0) {
    return (
      <div className="py-12 text-center">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-600">No hay visitas registradas</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {visitas.map((visita) => (
        <VisitaCard
          key={visita.cod_visita}
          visita={visita}
          rolActual={rolActual}
        />
      ))}
    </div>
  )
}

// Loading component
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
                  <div>
                    <div className="mb-2 h-3 w-16 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-5 w-24 animate-pulse rounded bg-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function VisitasPage() {
  const usuarioResponse = await obtenerEmpleadoActual()
  const usuario = usuarioResponse?.data

  const esCoordinacion =
    usuario?.rol_actual?.trim().toUpperCase() === 'COORDINACION'

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Visitas
              </h1>
              <p className="text-sm text-gray-600">
                Gestión de visitas a obras y clientes
              </p>
            </div>
          </div>

          {esCoordinacion && (
            <Link
              href="/coordinacion/visitas/crear"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              Nueva Visita
            </Link>
          )}
        </div>

        <Suspense fallback={<VisitasListSkeleton />}>
          <VisitasList rolActual={usuario?.rol_actual} />
        </Suspense>
      </div>
    </div>
  )
}
