'use client'

import { Calendar, Filter } from 'lucide-react'
import type { Obra, EstadoNotaFabricaProduccion } from '@/types'
import NotaFabricaCard from './NotaFabricaCard'

type TabType = EstadoNotaFabricaProduccion

interface SidebarNotasFabricaFilters {
  fechaDesde: string
  fechaHasta: string
}

interface SidebarNotasFabricaProps {
  obras: Obra[]
  statusFilter: TabType
  onStatusChange: (status: TabType) => void
  filters: SidebarNotasFabricaFilters
  onFiltersChange: (filters: SidebarNotasFabricaFilters) => void
  selectedObra: Obra | null
  onSelectObra: (obra: Obra) => void
  loading?: boolean
  error?: string | null
  onRetry: () => void
}

export default function SidebarNotasFabrica({
  obras,
  statusFilter,
  onStatusChange,
  filters,
  onFiltersChange,
  selectedObra,
  onSelectObra,
  loading = false,
  error = null,
  onRetry,
}: SidebarNotasFabricaProps) {
  const hasActiveFilters =
    Boolean(filters.fechaDesde) || Boolean(filters.fechaHasta)

  const handleClearFilters = () => {
    onFiltersChange({ fechaDesde: '', fechaHasta: '' })
  }

  if (loading && obras.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-white p-12">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-4 text-sm font-medium tracking-tight text-gray-500">
          Cargando notas...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-white p-8 text-center">
        <div className="mb-4 rounded-full bg-red-50 p-4 text-red-500">
          <Filter className="h-8 w-8" />
        </div>
        <p className="mb-2 text-base font-bold text-gray-900">
          Error al cargar notas
        </p>
        <p className="mb-6 text-xs leading-relaxed font-medium text-gray-500">
          {error}
        </p>
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
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      {/* Filters Header */}
      <div className="space-y-3 border-b border-gray-100 bg-gray-50/50 p-4">
        <p className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
          Filtrar por fecha (inicio de obra)
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-gray-500">
              Fecha desde
            </label>
            <div className="relative">
              <Calendar className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={filters.fechaDesde}
                onChange={(e) =>
                  onFiltersChange({ ...filters, fechaDesde: e.target.value })
                }
                className="w-full cursor-pointer rounded-lg border border-gray-200 bg-white py-1.5 pr-3 pl-9 text-xs font-medium transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-medium text-gray-500">
              Fecha hasta
            </label>
            <div className="relative">
              <Calendar className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={filters.fechaHasta}
                onChange={(e) =>
                  onFiltersChange({ ...filters, fechaHasta: e.target.value })
                }
                className="w-full cursor-pointer rounded-lg border border-gray-200 bg-white py-1.5 pr-3 pl-9 text-xs font-medium transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="self-end rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-[10px] font-bold text-gray-500 shadow-sm transition-colors hover:text-red-500"
          >
            LIMPIAR FILTROS
          </button>
        )}
      </div>

      {/* Status Switcher */}
      <div className="border-b border-gray-50 bg-white px-4 py-3">
        <div className="flex rounded-xl bg-gray-100/80 p-1">
          <button
            onClick={() => onStatusChange('SIN_ORDEN')}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-[10px] font-bold transition-all ${
              statusFilter === 'SIN_ORDEN'
                ? 'bg-white text-orange-600 shadow-sm ring-1 ring-gray-200'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            SIN ORDEN
          </button>
          <button
            onClick={() => onStatusChange('EN_PRODUCCION')}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-[10px] font-bold transition-all ${
              statusFilter === 'EN_PRODUCCION'
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            EN PRODUCCION
          </button>
          <button
            onClick={() => onStatusChange('FINALIZADA')}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-[10px] font-bold transition-all ${
              statusFilter === 'FINALIZADA'
                ? 'bg-white text-green-600 shadow-sm ring-1 ring-gray-200'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            FINALIZADAS
          </button>
        </div>
      </div>

      {/* List content */}
      <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto bg-gray-50/30 p-4 lg:p-6">
        {obras.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Filter className="mb-3 h-8 w-8 text-gray-200" />
            <p className="text-sm font-medium text-gray-500">
              No hay notas para mostrar
            </p>
          </div>
        ) : (
          obras.map((obra) => (
            <NotaFabricaCard
              key={obra.cod_obra}
              obra={obra}
              status={statusFilter}
              isSelected={selectedObra?.cod_obra === obra.cod_obra}
              onClick={() => onSelectObra(obra)}
            />
          ))
        )}
      </div>
    </div>
  )
}
