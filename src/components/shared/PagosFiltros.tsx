'use client'

import { useCallback, useTransition, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, Calendar, DollarSign } from 'lucide-react'

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

  const [localMontoMin, setLocalMontoMin] = useState('')
  const [localMontoMax, setLocalMontoMax] = useState('')
  const [error, setError] = useState<string | null>(null)

  const formatMonto = (value: string) => {
    if (!value) return ''
    // Quitar puntos de miles existentes
    const raw = value.replace(/\./g, '')
    // Separar parte entera y decimal
    const parts = raw.split(',')
    let integerPart = parts[0].replace(/\D/g, '')
    
    // Agregar separadores de miles
    if (integerPart) {
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }
    
    if (parts.length > 1) {
      const decimalPart = parts[1].replace(/\D/g, '').slice(0, 2)
      return `${integerPart},${decimalPart}`
    }
    
    return integerPart
  }

  const parseMonto = (formattedValue: string) => {
    if (!formattedValue) return ''
    let raw = formattedValue.replace(/\./g, '')
    raw = raw.replace(',', '.')
    return raw
  }

  useEffect(() => {
    if (montoMin !== undefined && montoMin !== null) {
      const stringVal = montoMin.toString().replace('.', ',')
      setLocalMontoMin(formatMonto(stringVal))
    } else {
      setLocalMontoMin('')
    }
  }, [montoMin])

  useEffect(() => {
    if (montoMax !== undefined && montoMax !== null) {
      const stringVal = montoMax.toString().replace('.', ',')
      setLocalMontoMax(formatMonto(stringVal))
    } else {
      setLocalMontoMax('')
    }
  }, [montoMax])

  const hasActiveFilters = Boolean(
    fechaDesde || fechaHasta || montoMin !== undefined || montoMax !== undefined
  )

  const updateFilters = useCallback(
    (newFilters: Record<string, string>) => {
      // Validaciones
      const currentDesde = newFilters.fechaDesde !== undefined ? newFilters.fechaDesde : fechaDesde
      const currentHasta = newFilters.fechaHasta !== undefined ? newFilters.fechaHasta : fechaHasta

      if (currentDesde && currentHasta) {
        if (new Date(currentDesde) > new Date(currentHasta)) {
          setError('La fecha de inicio no puede ser mayor a la fecha final.')
          return
        }
      }

      const rawMontoMin = newFilters.montoMin !== undefined ? newFilters.montoMin : montoMin?.toString()
      const rawMontoMax = newFilters.montoMax !== undefined ? newFilters.montoMax : montoMax?.toString()

      if (rawMontoMin && rawMontoMax) {
        if (parseFloat(rawMontoMin) > parseFloat(rawMontoMax)) {
          setError('El monto mínimo no puede ser mayor al monto máximo.')
          return
        }
      }

      setError(null)

      const params = new URLSearchParams(searchParams.toString())

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })

      // Reset page when filters change
      params.delete('page')

      startTransition(() => {
        router.push(`?${params.toString()}`)
      })
    },
    [searchParams, router, fechaDesde, fechaHasta, montoMin, montoMax]
  )

  const clearFilters = () => {
    setError(null)
    const params = new URLSearchParams(searchParams.toString())
    params.delete('fechaDesde')
    params.delete('fechaHasta')
    params.delete('montoMin')
    params.delete('montoMax')
    params.delete('page')

    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Filter className="h-4 w-4" />
          Filtros
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            disabled={isPending}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm font-medium text-red-600 border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Fechas */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            <Calendar className="mr-1 inline h-4 w-4" />
            Fecha Desde
          </label>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => updateFilters({ fechaDesde: e.target.value })}
            disabled={isPending}
            className="w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            <Calendar className="mr-1 inline h-4 w-4" />
            Fecha Hasta
          </label>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => updateFilters({ fechaHasta: e.target.value })}
            disabled={isPending}
            className="w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
          />
        </div>

        {/* Montos */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            <DollarSign className="mr-1 inline h-4 w-4" />
            Monto Mínimo
          </label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={localMontoMin}
            onChange={(e) => setLocalMontoMin(formatMonto(e.target.value))}
            onBlur={() => updateFilters({ montoMin: parseMonto(localMontoMin) })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateFilters({ montoMin: parseMonto(localMontoMin) })
              }
            }}
            disabled={isPending}
            className="w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            <DollarSign className="mr-1 inline h-4 w-4" />
            Monto Máximo
          </label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={localMontoMax}
            onChange={(e) => setLocalMontoMax(formatMonto(e.target.value))}
            onBlur={() => updateFilters({ montoMax: parseMonto(localMontoMax) })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateFilters({ montoMax: parseMonto(localMontoMax) })
              }
            }}
            disabled={isPending}
            className="w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  )
}
