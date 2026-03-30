'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, Calendar, DollarSign, X } from 'lucide-react'

interface PagosFiltrosProps {
  fechaDesde?: string
  fechaHasta?: string
  montoMin?: number
  montoMax?: number
}

export default function PagosFiltros({
  fechaDesde = '',
  fechaHasta = '',
  montoMin,
  montoMax,
}: PagosFiltrosProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [isExpanded, setIsExpanded] = useState(false)

  const [localFechaDesde, setLocalFechaDesde] = useState(fechaDesde)
  const [localFechaHasta, setLocalFechaHasta] = useState(fechaHasta)
  const [localMontoMin, setLocalMontoMin] = useState(montoMin?.toString() || '')
  const [localMontoMax, setLocalMontoMax] = useState(montoMax?.toString() || '')

  const hasActiveFilters = Boolean(fechaDesde || fechaHasta || montoMin !== undefined || montoMax !== undefined)

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (localFechaDesde) params.set('fechaDesde', localFechaDesde)
    else params.delete('fechaDesde')

    if (localFechaHasta) params.set('fechaHasta', localFechaHasta)
    else params.delete('fechaHasta')

    if (localMontoMin && parseFloat(localMontoMin) > 0) params.set('montoMin', localMontoMin)
    else params.delete('montoMin')

    if (localMontoMax && parseFloat(localMontoMax) > 0) params.set('montoMax', localMontoMax)
    else params.delete('montoMax')

    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  const clearFilters = () => {
    setLocalFechaDesde('')
    setLocalFechaHasta('')
    setLocalMontoMin('')
    setLocalMontoMax('')

    const params = new URLSearchParams(searchParams.toString())
    params.delete('fechaDesde')
    params.delete('fechaHasta')
    params.delete('montoMin')
    params.delete('montoMax')

    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Filtros Avanzados</h3>
          {hasActiveFilters && (
            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
              Activos
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={isPending}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              isExpanded
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isExpanded ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Fechas */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                <Calendar className="mr-1 inline h-4 w-4" />
                Fecha Desde
              </label>
              <input
                type="date"
                value={localFechaDesde}
                onChange={(e) => setLocalFechaDesde(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isPending}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                <Calendar className="mr-1 inline h-4 w-4" />
                Fecha Hasta
              </label>
              <input
                type="date"
                value={localFechaHasta}
                onChange={(e) => setLocalFechaHasta(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isPending}
              />
            </div>

            {/* Montos */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                <DollarSign className="mr-1 inline h-4 w-4" />
                Monto Mínimo
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={localMontoMin}
                onChange={(e) => setLocalMontoMin(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isPending}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                <DollarSign className="mr-1 inline h-4 w-4" />
                Monto Máximo
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={localMontoMax}
                onChange={(e) => setLocalMontoMax(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-4">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                disabled={isPending}
                className="flex items-center gap-1 rounded-md px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
                Limpiar Filtros
              </button>
            )}
            <button
              onClick={applyFilters}
              disabled={isPending}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? 'Aplicando...' : 'Aplicar Filtros'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
