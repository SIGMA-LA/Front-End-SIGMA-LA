'use client'

import { Calendar, Plus } from 'lucide-react'
import { VisitasListProps, Visita } from '@/types'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'
import VisitaCard from './VisitaCard'
import { useRouter } from 'next/navigation'

export default function VisitasList({
  visitas: initialVisitas,
  empleadosMap,
}: VisitasListProps) {
  const { usuario, logout } = useAuth()
  const [visitas, setVisitas] = useState<Visita[]>(initialVisitas)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Cargando visitas...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600">Error: {error}</p>
              <button
                onClick={() => router.refresh()}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
          {usuario?.rol_actual === 'COORDINACION' && (
            <button
              onClick={() => {
                router.push('/coordinacion/visitas/crear')
              }}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              Nueva Visita
            </button>
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
                onEdit={() =>
                  router.push(
                    '`/coordinacion/visitas/${visita.cod_visita}/editar`'
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
