'use client'

import { useState, useMemo } from 'react'
import type { EntregaEmpleado } from '@/types'
import { Search, Calendar, X } from 'lucide-react'
import EntregaCard from './EntregaCard'

interface EntregasSidebarProps {
  entregas: EntregaEmpleado[]
  estadoFiltro: 'PENDIENTE' | 'ENTREGADO'
  onEstadoFiltroChange: (estado: 'PENDIENTE' | 'ENTREGADO') => void
  searchTerm: string
  onSearchTermChange: (term: string) => void
  filterDate: string
  onFilterDateChange: (date: string) => void
  selectedEntrega: EntregaEmpleado | null
  onSelectEntrega: (entrega: EntregaEmpleado) => void
  loadingEntregas: boolean
  errorEntregas: string | null
  onRetry: () => void
  onClose?: () => void
}

export default function EntregasSidebar({
  entregas,
  estadoFiltro,
  onEstadoFiltroChange,
  searchTerm,
  onSearchTermChange,
  filterDate,
  onFilterDateChange,
  selectedEntrega,
  onSelectEntrega,
  loadingEntregas,
  errorEntregas,
  onRetry,
  onClose,
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
    <aside className="h-full w-full flex-shrink-0 flex flex-col border-r border-gray-200 bg-white shadow-xl lg:shadow-none">
      {/* Search and Filter Fixed Header */}
      <div className="p-2 sm:p-4 lg:p-6 border-b border-gray-100 bg-white z-10 sticky top-0 space-y-3">
        {onClose && (
          <div className="flex justify-between items-center lg:hidden mb-1 px-1">
            <h2 className="text-base font-bold text-gray-800">Menú de Entregas</h2>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded-md transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        )}
        <div className="relative line-clamp-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por dirección..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm lg:text-base outline-none"
          />
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Calendar className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => onFilterDateChange(e.target.value)}
            className="block w-full rounded-md border-0 py-2 pl-10 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm lg:text-base outline-none cursor-pointer"
          />
        </div>

        {/* Toggle para estado */}
        <div className="flex bg-gray-100 p-1 mt-2 rounded-md">
          <button
            onClick={() => onEstadoFiltroChange('PENDIENTE')}
            className={`flex-1 py-1.5 text-sm rounded transition-colors ${estadoFiltro === 'PENDIENTE' ? 'bg-white shadow font-medium text-gray-900 border-2 border-orange-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Pendientes
          </button>
          <button
            onClick={() => onEstadoFiltroChange('ENTREGADO')}
            className={`flex-1 py-1.5 text-sm rounded transition-colors ${estadoFiltro === 'ENTREGADO' ? 'bg-white shadow font-medium text-gray-900 border-2 border-green-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Realizadas
          </button>
        </div>
      </div>

      {/* Scrollable List Container */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2 sm:p-4 lg:space-y-8 lg:p-6">
        <div className="px-1 sm:px-2 lg:px-3">
          <div className="mb-3 flex items-center space-x-2 px-1 pt-2 sm:mb-4 sm:space-x-3 sm:pt-3 lg:mb-5">
            <div className={`h-3 w-3 rounded-full lg:h-4 lg:w-4 ${estadoFiltro === 'PENDIENTE' ? 'bg-orange-500' : 'bg-green-500'}`}></div>
            <h2 className="text-xs font-semibold tracking-wider text-gray-700 uppercase sm:text-sm lg:text-base">
              Entregas ({entregas.length})
            </h2>
          </div>
          <div className="space-y-2 sm:space-y-3 lg:space-y-4">
            {entregas.length === 0 ? (
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
                  No se encontraron entregas
                </p>
              </div>
            ) : (
              entregas.map((entregaEmpleado) => (
                <EntregaCard
                  key={entregaEmpleado.cod_entrega}
                  entregaEmpleado={entregaEmpleado}
                  isSelected={
                    selectedEntrega?.cod_entrega === entregaEmpleado.cod_entrega
                  }
                  onClick={() => onSelectEntrega(entregaEmpleado)}
                  variant={estadoFiltro === 'PENDIENTE' ? 'pendiente' : 'realizada'}
                />
              ))
            )}
          </div>
        </div>

      </div>
    </aside>
  )
}
