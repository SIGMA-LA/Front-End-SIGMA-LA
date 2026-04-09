'use client'

import type { EntregaEmpleado } from '@/types'
import { Calendar, Search, Filter, X } from 'lucide-react'
import EntregaCard from './EntregaCard'

interface EntregasSidebarProps {
  entregas: EntregaEmpleado[]
  estadoFiltro?: 'PENDIENTE' | 'ENTREGADO' | 'CANCELADO'
  onEstadoFiltroChange?: (estado: 'PENDIENTE' | 'ENTREGADO' | 'CANCELADO') => void
  searchTerm?: string
  onSearchTermChange?: (term: string) => void
  filterDate?: string
  onFilterDateChange?: (date: string) => void
  selectedEntrega: EntregaEmpleado | null
  onSelectEntrega: (entrega: EntregaEmpleado) => void
  loadingEntregas: boolean
  errorEntregas: string | null
  onRetry: () => void
  onClose?: () => void
  lastElementRef?: (node: HTMLDivElement | null) => void
  loadingMore?: boolean
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
  onRetry,
  onClose,
  lastElementRef,
  loadingMore,
  loadingEntregas,
  errorEntregas
}: EntregasSidebarProps) {
  const currentList = entregas

  if (loadingEntregas) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center bg-white p-12">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-4 text-sm text-gray-500 font-medium tracking-tight">Cargando entregas...</p>
      </div>
    )
  }

  if (errorEntregas) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center p-8 text-center bg-white">
        <div className="mb-4 text-red-500 bg-red-50 p-4 rounded-full">
          <Filter className="h-8 w-8" />
        </div>
        <p className="mb-2 text-base font-bold text-gray-900">Error al cargar entregas</p>
        <p className="mb-6 text-xs text-gray-500 font-medium leading-relaxed">{errorEntregas}</p>
        <button
          onClick={onRetry}
          className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-white">
      {/* Mobile-only Header */}
      {onClose && (
        <div className="flex justify-between items-center lg:hidden px-4 py-3 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800">Menú de Entregas</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded-md transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Search and Filters Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50/50 space-y-3">
        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Buscar por cliente, detalle o dirección..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange?.(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 bg-white shadow-sm outline-none transition-all placeholder:text-gray-400"
          />
        </div>

        <div className="flex gap-2">
          {/* Date Filter */}
          <div className="relative flex-1">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => onFilterDateChange?.(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 bg-white outline-none transition-all cursor-pointer"
            />
          </div>

          {/* Clear Date Button */}
          {filterDate && (
            <button
              onClick={() => onFilterDateChange?.('')}
              className="px-2 py-1.5 text-[10px] font-bold text-gray-500 hover:text-red-500 transition-colors bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              LIMPIAR
            </button>
          )}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="px-4 py-3 border-b border-gray-50 bg-white">
        <div className="flex p-1 bg-gray-100/80 rounded-xl">
          <button
            onClick={() => onEstadoFiltroChange?.('PENDIENTE')}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-bold transition-all ${estadoFiltro === 'PENDIENTE'
                ? 'bg-white text-orange-600 shadow-sm ring-1 ring-gray-200'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            PENDIENTES
          </button>
          <button
            onClick={() => onEstadoFiltroChange?.('ENTREGADO')}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-bold transition-all ${estadoFiltro === 'ENTREGADO'
                ? 'bg-white text-green-600 shadow-sm ring-1 ring-gray-200'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            REALIZADAS
          </button>
          <button
            onClick={() => onEstadoFiltroChange?.('CANCELADO')}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-bold transition-all ${estadoFiltro === 'CANCELADO'
                ? 'bg-white text-red-600 shadow-sm ring-1 ring-gray-200'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            CANCELADAS
          </button>
        </div>
      </div>

      {/* List content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 lg:p-6 custom-scrollbar bg-gray-50/30">
        {currentList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Filter className="h-8 w-8 text-gray-200 mb-3" />
            <p className="text-sm font-medium text-gray-500">
              {searchTerm || filterDate ? 'No se encontraron resultados' : `No hay entregas ${estadoFiltro === 'PENDIENTE' ? 'pendiente' : 'realizada'}as`}
            </p>
          </div>
        ) : (
          <>
            {currentList.map((entregaEmpleado) => (
              <EntregaCard
                key={entregaEmpleado.cod_entrega}
                entregaEmpleado={entregaEmpleado}
                isSelected={selectedEntrega?.cod_entrega === entregaEmpleado.cod_entrega}
                onClick={() => onSelectEntrega(entregaEmpleado)}
                variant={
                  estadoFiltro === 'PENDIENTE'
                    ? 'pendiente'
                    : estadoFiltro === 'CANCELADO'
                      ? 'cancelada'
                      : 'realizada'
                }
              />
            ))}

            {/* Infinite Scroll Sentinel */}
            <div
              ref={lastElementRef}
              className="h-10 flex items-center justify-center py-8"
            >
              {loadingMore && (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                  <span className="text-xs text-gray-400 font-medium">Cargando más...</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
