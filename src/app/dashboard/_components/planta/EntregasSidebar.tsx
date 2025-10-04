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
  // Estado de carga
  if (loadingEntregas) {
    return (
      <aside className="w-96 flex-shrink-0 space-y-6 overflow-y-auto border-r border-gray-200 bg-white p-4">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-500">Cargando entregas...</p>
          </div>
        </div>
      </aside>
    )
  }

  // Estado de error
  if (errorEntregas) {
    return (
      <aside className="w-96 flex-shrink-0 space-y-6 overflow-y-auto border-r border-gray-200 bg-white p-4">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mb-2 text-red-500">
              <svg
                className="mx-auto h-12 w-12"
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
            <p className="mb-2 font-medium text-red-600">
              Error al cargar entregas
            </p>
            <p className="mb-4 text-sm text-gray-500">{errorEntregas}</p>
            <button
              onClick={onRetry}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-96 flex-shrink-0 space-y-6 overflow-y-auto border-r border-gray-200 bg-white p-4">
      <div className="px-3">
        <div className="mb-3 flex items-center space-x-2 px-1 pt-2">
          <div className="h-2.5 w-2.5 rounded-full bg-orange-500"></div>
          <h2 className="text-sm font-semibold tracking-wider text-gray-700 uppercase">
            Entregas Pendientes ({entregasPendientes.length})
          </h2>
        </div>
        <div className="space-y-2">
          {entregasPendientes.length === 0 ? (
            <div className="py-8 text-center">
              <div className="mb-2 text-gray-400">
                <svg
                  className="mx-auto h-8 w-8"
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
              <p className="text-sm text-gray-500">
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

      <div className="px-3">
        <div className="mb-3 flex items-center space-x-2 px-1">
          <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
          <h2 className="text-sm font-semibold tracking-wider text-gray-700 uppercase">
            Entregas Realizadas ({entregasRealizadas.length})
          </h2>
        </div>
        <div className="space-y-2">
          {entregasRealizadas.length === 0 ? (
            <div className="py-8 text-center">
              <div className="mb-2 text-gray-400">
                <svg
                  className="mx-auto h-8 w-8"
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
              <p className="text-sm text-gray-500">
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
