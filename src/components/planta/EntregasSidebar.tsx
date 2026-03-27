'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { EntregaEmpleado } from '@/types'
import { Search, Clock, CheckCircle } from 'lucide-react'
import EntregaCard from './EntregaCard'

interface EntregasSidebarProps {
  entregasPendientes: EntregaEmpleado[]
  entregasRealizadas: EntregaEmpleado[]
  selectedEntrega: EntregaEmpleado | null
  onSelectEntrega: (entrega: EntregaEmpleado) => void
  loadingEntregas: boolean
  errorEntregas: string | null
  onRetry: () => void
}

export default function EntregasSidebar({
  entregasPendientes,
  entregasRealizadas,
  selectedEntrega,
  onSelectEntrega,
  loadingEntregas,
  errorEntregas,
  onRetry,
}: EntregasSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (searchTerm) params.set('search', searchTerm)
      else params.delete('search')
      params.delete('date')

      router.push(`${pathname}?${params.toString()}`)
    }, 400)

    return () => clearTimeout(handler)
  }, [searchTerm, pathname, router, searchParams])

  if (loadingEntregas) {
    return (
      <div className="flex flex-col h-full w-full overflow-hidden bg-white p-2 sm:p-4 lg:space-y-6 lg:p-6">
        <div className="flex h-64 flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600 lg:h-10 lg:w-10"></div>
            <p className="text-sm text-gray-500 lg:text-base">
              Cargando entregas...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (errorEntregas) {
    return (
      <div className="flex flex-col h-full w-full overflow-hidden bg-white p-2 sm:p-4 lg:space-y-6 lg:p-6">
        <div className="flex h-64 flex-1 items-center justify-center">
          <div className="px-4 text-center sm:px-6">
            <div className="mb-4 text-red-500">
              <svg
                className="mx-auto h-12 w-12 lg:h-16 lg:w-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="mb-3 text-base font-medium text-red-600 lg:text-lg">
              Error al cargar entregas
            </p>
            <p className="mb-6 text-sm text-gray-500 lg:text-base">
              {errorEntregas}
            </p>
            <button
              onClick={onRetry}
              className="rounded-md bg-blue-600 px-4 py-3 text-sm text-white transition-colors hover:bg-blue-700 lg:px-6 lg:text-base"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-white">
      {/* Buscador */}
      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, detalle o dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8 lg:p-6">
        {/* Entregas Pendientes */}
        <div>
          <div className="mb-4 flex items-center space-x-2">
            <Clock className="h-4 w-4 text-orange-500 lg:h-5 lg:w-5" />
            <h2 className="text-xs font-semibold tracking-wider text-gray-700 uppercase sm:text-sm lg:text-base">
              Entregas Pendientes ({entregasPendientes.length})
            </h2>
          </div>
          <div className="space-y-3 lg:space-y-4">
            {entregasPendientes.length === 0 ? (
              <p className="text-xs text-gray-500 sm:text-sm lg:text-base">
                {searchTerm ? 'No se encontraron resultados' : 'No hay entregas pendientes'}
              </p>
            ) : (
              entregasPendientes.map((entregaEmpleado) => (
                <EntregaCard
                  key={entregaEmpleado.cod_entrega}
                  entregaEmpleado={entregaEmpleado}
                  isSelected={
                    selectedEntrega?.cod_entrega === entregaEmpleado.cod_entrega
                  }
                  onClick={() => onSelectEntrega(entregaEmpleado)}
                  variant="pendiente"
                />
              ))
            )}
          </div>
        </div>

        {/* Entregas Realizadas */}
        <div>
          <div className="mb-4 flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500 lg:h-5 lg:w-5" />
            <h2 className="text-xs font-semibold tracking-wider text-gray-700 uppercase sm:text-sm lg:text-base">
              Entregas Realizadas ({entregasRealizadas.length})
            </h2>
          </div>
          <div className="space-y-3 lg:space-y-4">
            {entregasRealizadas.length === 0 ? (
              <p className="text-xs text-gray-500 sm:text-sm lg:text-base">
                {searchTerm ? 'No se encontraron resultados' : 'No hay entregas realizadas'}
              </p>
            ) : (
              entregasRealizadas.map((entregaEmpleado) => (
                <EntregaCard
                  key={entregaEmpleado.cod_entrega}
                  entregaEmpleado={entregaEmpleado}
                  isSelected={
                    selectedEntrega?.cod_entrega === entregaEmpleado.cod_entrega
                  }
                  onClick={() => onSelectEntrega(entregaEmpleado)}
                  variant="realizada"
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
