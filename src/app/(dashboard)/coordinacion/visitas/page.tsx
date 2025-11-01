import { Calendar, Plus } from 'lucide-react'
import { obtenerVisitas } from '@/actions/visitas'
import { obtenerEmpleadoActual } from '@/actions/empleado'
import VisitaCard from '@/components/shared/VisitaCard'
import Link from 'next/link'

export default async function VisitasPage() {
  const [visitas, usuarioResponse] = await Promise.all([
    obtenerVisitas(),
    obtenerEmpleadoActual(),
  ])
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

        {visitas.length === 0 ? (
          <div className="py-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">No hay visitas registradas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {visitas.map((visita) => (
              <VisitaCard
                key={visita.cod_visita}
                visita={visita}
                rolActual={usuario?.rol_actual}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
