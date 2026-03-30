import { Package } from 'lucide-react'
import type { OrdenProduccion } from '@/types'
import OrdenProduccionCard from './OrdenProduccionCard'

interface SidebarOrdenesProduccionProps {
  ordenesAprobadas: OrdenProduccion[]
  ordenesEnProduccion: OrdenProduccion[]
  selectedOrden: OrdenProduccion | null
  onSelectOrden: (orden: OrdenProduccion) => void
  loading?: boolean
  error?: string | null
}

export default function SidebarOrdenesProduccion({
  ordenesAprobadas,
  ordenesEnProduccion,
  selectedOrden,
  onSelectOrden,
  loading = false,
  error = null,
}: SidebarOrdenesProduccionProps) {
  if (loading) {
    return (
      <aside className="h-full w-full flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white p-2 sm:p-4 lg:p-6">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600 lg:h-10 lg:w-10"></div>
            <p className="text-sm text-gray-500 lg:text-base">
              Cargando órdenes...
            </p>
          </div>
        </div>
      </aside>
    )
  }

  if (error) {
    return (
      <aside className="h-full w-full flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white p-2 sm:p-4 lg:p-6">
        <div className="flex h-64 items-center justify-center">
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
              Error al cargar órdenes
            </p>
            <p className="text-sm text-gray-500 lg:text-base">{error}</p>
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside className="h-full w-full flex-shrink-0 space-y-4 overflow-y-auto border-r border-gray-200 bg-white p-2 sm:p-4 lg:space-y-8 lg:p-6">
      {/* Órdenes Aprobadas (Por Iniciar) */}
      <div className="px-1 sm:px-2 lg:px-3">
        <div className="mb-3 flex items-center space-x-2 px-1 pt-2 sm:mb-4 sm:space-x-3 sm:pt-3 lg:mb-5">
          <div className="h-3 w-3 rounded-full bg-blue-500 lg:h-4 lg:w-4"></div>
          <h2 className="text-xs font-semibold tracking-wider text-gray-700 uppercase sm:text-sm lg:text-base">
            Órdenes Aprobadas ({ordenesAprobadas.length})
          </h2>
        </div>
        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          {ordenesAprobadas.length === 0 ? (
            <div className="py-6 text-center sm:py-8 lg:py-12">
              <div className="mb-3 text-gray-400 sm:mb-4">
                <Package className="mx-auto h-8 w-8 sm:h-10 sm:w-10 lg:h-14 lg:w-14" />
              </div>
              <p className="text-xs text-gray-500 sm:text-sm lg:text-base">
                No hay órdenes aprobadas
              </p>
            </div>
          ) : (
            ordenesAprobadas.map((orden) => (
              <OrdenProduccionCard
                key={orden.cod_op}
                orden={orden}
                isSelected={selectedOrden?.cod_op === orden.cod_op}
                onClick={() => onSelectOrden(orden)}
                estado={orden.estado}
              />
            ))
          )}
        </div>
      </div>

      {/* Órdenes En Producción */}
      <div className="px-1 sm:px-2 lg:px-3">
        <div className="mb-3 flex items-center space-x-2 px-1 sm:mb-4 sm:space-x-3 lg:mb-5">
          <div className="h-3 w-3 rounded-full bg-green-500 lg:h-4 lg:w-4"></div>
          <h2 className="text-xs font-semibold tracking-wider text-gray-700 uppercase sm:text-sm lg:text-base">
            En Producción ({ordenesEnProduccion.length})
          </h2>
        </div>
        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          {ordenesEnProduccion.length === 0 ? (
            <div className="py-6 text-center sm:py-8 lg:py-12">
              <div className="mb-3 text-gray-400 sm:mb-4">
                <svg
                  className="mx-auto h-6 w-6 sm:h-8 sm:w-8 lg:h-12 lg:w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-xs text-gray-500 sm:text-sm lg:text-base">
                No hay órdenes en producción
              </p>
            </div>
          ) : (
            ordenesEnProduccion.map((orden) => (
              <OrdenProduccionCard
                key={orden.cod_op}
                orden={orden}
                isSelected={selectedOrden?.cod_op === orden.cod_op}
                onClick={() => onSelectOrden(orden)}
                estado={orden.estado}
              />
            ))
          )}
        </div>
      </div>
    </aside>
  )
}
