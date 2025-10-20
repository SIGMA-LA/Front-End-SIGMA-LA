'use client'

import { useState, useEffect, useCallback } from 'react'
import { PagosFilter } from '@/types'
import {
  Search,
  Filter,
  X,
  Calendar,
  DollarSign,
  Building2,
  User,
} from 'lucide-react'

interface PagosFiltersProps {
  filters: PagosFilter
  onFiltersChange: (filters: PagosFilter) => void
  onClearFilters: () => void
  isLoading?: boolean
}

export default function PagosFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  isLoading = false,
}: PagosFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [localFilters, setLocalFilters] = useState<PagosFilter>(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleFilterChange = useCallback(
    (key: keyof PagosFilter, value: string | number | undefined) => {
      setLocalFilters((prev) => {
        const updated = { ...prev }

        if (value === '' || value === undefined || value === null) {
          delete updated[key]
        } else {
          if (key === 'montoMin' || key === 'montoMax') {
            const numValue =
              typeof value === 'string' ? parseFloat(value) : value
            if (!isNaN(numValue) && numValue > 0) {
              ;(updated as any)[key] = numValue
            } else {
              delete updated[key]
            }
          } else {
            ;(updated as any)[key] = value
          }
        }

        return updated
      })
    },
    []
  )

  const hasActiveFilters = Object.keys(filters).length > 0
  const hasLocalChanges =
    JSON.stringify(localFilters) !== JSON.stringify(filters)

  const handleSearch = () => {
    onFiltersChange(localFilters)
  }

  const handleReset = () => {
    setLocalFilters({})
    onClearFilters()
  }

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 p-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Filtrar Pagos</h3>
          {hasActiveFilters && (
            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
              {Object.keys(filters).length} filtro
              {Object.keys(filters).length !== 1 ? 's' : ''}
            </span>
          )}
          {hasLocalChanges && (
            <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
              Cambios pendientes
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSearch}
            disabled={isLoading || !hasLocalChanges}
            className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Search className="h-3 w-3" />
            Buscar
          </button>

          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 rounded-md px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
              Limpiar
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
              isExpanded
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isExpanded ? 'Contraer' : 'Expandir'}
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              <User className="mr-1 inline h-4 w-4" />
              Cliente
            </label>
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por cliente..."
                value={localFilters.cliente || ''}
                onChange={(e) => handleFilterChange('cliente', e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              <Building2 className="mr-1 inline h-4 w-4" />
              Obra
            </label>
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por dirección..."
                value={localFilters.obra || ''}
                onChange={(e) => handleFilterChange('obra', e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100 p-4">
          <h4 className="mb-3 text-sm font-medium text-gray-900">
            Filtros Avanzados
          </h4>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                <Calendar className="mr-1 inline h-4 w-4" />
                Fecha desde
              </label>
              <input
                type="date"
                value={localFilters.fechaDesde || ''}
                onChange={(e) =>
                  handleFilterChange('fechaDesde', e.target.value)
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                <Calendar className="mr-1 inline h-4 w-4" />
                Fecha hasta
              </label>
              <input
                type="date"
                value={localFilters.fechaHasta || ''}
                onChange={(e) =>
                  handleFilterChange('fechaHasta', e.target.value)
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                <DollarSign className="mr-1 inline h-4 w-4" />
                Monto mínimo
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={localFilters.montoMin || ''}
                onChange={(e) => handleFilterChange('montoMin', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                <DollarSign className="mr-1 inline h-4 w-4" />
                Monto máximo
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={localFilters.montoMax || ''}
                onChange={(e) => handleFilterChange('montoMax', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
