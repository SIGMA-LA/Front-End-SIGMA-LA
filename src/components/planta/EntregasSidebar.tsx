'use client'

import type { EntregaEmpleado } from '@/types'
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
  if (loadingEntregas) {
    return (
      <aside className="h-full w-full flex-shrink-0 space-y-4 overflow-y-auto border-r border-gray-200 bg-white p-2 sm:p-4 lg:space-y-6 lg:p-6">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600 lg:h-10 lg:w-10"></div>
            <p className="text-sm text-gray-500 lg:text-base">
              Cargando entregas...
            </p>
          </div>
        </div>
      </aside>
    )
  }

  if (errorEntregas) {
    return (
      <aside className="h-full w-full flex-shrink-0 space-y-4 overflow-y-auto border-r border-gray-200 bg-white p-2 sm:p-4 lg:space-y-6 lg:p-6">
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
      </aside>
    )
  }

  return (
    <aside className="h-full w-full flex-shrink-0 space-y-4 overflow-y-auto border-r border-gray-200 bg-white p-2 sm:p-4 lg:space-y-8 lg:p-6">
      {/* Entregas Pendientes */}
      <div className="px-1 sm:px-2 lg:px-3">
        <div className="mb-3 flex items-center space-x-2 px-1 pt-2 sm:mb-4 sm:space-x-3 sm:pt-3 lg:mb-5">
          <div className="h-3 w-3 rounded-full bg-orange-500 lg:h-4 lg:w-4"></div>
          <h2 className="text-xs font-semibold tracking-wider text-gray-700 uppercase sm:text-sm lg:text-base">
            Entregas Pendientes ({entregasPendientes.length})
          </h2>
        </div>
        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          {entregasPendientes.length === 0 ? (
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-xs text-gray-500 sm:text-sm lg:text-base">
                No hay entregas pendientes
              </p>
            </div>
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
      <div className="px-1 sm:px-2 lg:px-3">
        <div className="mb-3 flex items-center space-x-2 px-1 sm:mb-4 sm:space-x-3 lg:mb-5">
          <div className="h-3 w-3 rounded-full bg-green-500 lg:h-4 lg:w-4"></div>
          <h2 className="text-xs font-semibold tracking-wider text-gray-700 uppercase sm:text-sm lg:text-base">
            Entregas Realizadas ({entregasRealizadas.length})
          </h2>
        </div>
        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          {entregasRealizadas.length === 0 ? (
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
                No hay entregas realizadas
              </p>
            </div>
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
    </aside>
  )
}
