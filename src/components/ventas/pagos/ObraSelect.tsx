'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Label } from '@/components/ui/Label'
import type {
  ObraConPresupuesto,
  ObraSelectProps,
  ObraSearchResultsProps,
} from '@/types'
import { getObrasConPresupuestoAceptado } from '@/actions/pagos'

export default function ObraSelect({
  selectedObra,
  onObraSelect,
  placeholder = 'Buscar obra...',
  required = false,
  showResults = false,
  searchResults = [],
  loading: externalLoading = false,
  error: externalError = null,
  onSearchChange,
  initialSearchTerm = '',
}: ObraSelectProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [internalObras, setInternalObras] = useState<ObraConPresupuesto[]>([])
  const [internalLoading, setInternalLoading] = useState(false)
  const [internalError, setInternalError] = useState<string | null>(null)

  // Usar props externos si están disponibles, sino usar estados internos
  const obras = showResults ? searchResults : internalObras
  const loading = showResults ? externalLoading : internalLoading
  const error = showResults ? externalError : internalError

  const loadObras = useCallback(async () => {
    try {
      setInternalLoading(true)
      setInternalError(null)
      const data = await getObrasConPresupuestoAceptado(searchTerm.trim())
      setInternalObras(data)
    } catch (err: unknown) {
      setInternalError(
        err instanceof Error ? err.message : 'Error al buscar obras'
      )
      setInternalObras([])
    } finally {
      setInternalLoading(false)
    }
  }, [searchTerm])

  useEffect(() => {
    if (!showResults && searchTerm.trim()) {
      loadObras()
    } else if (!showResults && !searchTerm.trim()) {
      setInternalObras([])
      setInternalLoading(false)
      setInternalError(null)
    }
  }, [searchTerm, showResults, loadObras])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    if (onSearchChange) {
      onSearchChange(value)
    }
  }

  const handleSelect = (obra: ObraConPresupuesto) => {
    onObraSelect(obra)
    setSearchTerm('')
  }

  const handleClear = () => {
    onObraSelect(null)
    setSearchTerm('')
  }

  const getClienteName = (obra: ObraConPresupuesto) => {
    const cliente = obra?.cliente
    if (cliente?.razon_social) return cliente.razon_social
    if (cliente?.nombre && cliente?.apellido)
      return `${cliente.nombre} ${cliente.apellido}`
    return 'Cliente no identificado'
  }

  const formatMonto = (monto?: number) => {
    return monto ? `$${monto.toLocaleString()}` : '$0'
  }

  const formatPorcentaje = (porcentaje?: number) => {
    return porcentaje ? `${porcentaje.toFixed(1)}%` : '0%'
  }

  return (
    <div className="space-y-2">
      <Label>Obra {required && <span className="text-red-500">*</span>}</Label>

      <div className="relative">
        {selectedObra ? (
          <Card className="p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">#{selectedObra.cod_obra}</span>
                  <span className="text-sm text-gray-600">
                    {getClienteName(selectedObra)}
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  {selectedObra.direccion}
                </p>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500">Presupuesto:</span>
                    <p className="font-medium">
                      {formatMonto(selectedObra.presupuesto?.valor)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Pagado:</span>
                    <p className="font-medium text-green-600">
                      {formatMonto(selectedObra.totalPagado)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Pendiente:</span>
                    <p className="font-medium text-orange-600">
                      {formatMonto(selectedObra.saldoPendiente)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-green-500 transition-all"
                      style={{
                        width: `${Math.min(selectedObra.porcentajePagado || 0, 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium">
                    {formatPorcentaje(selectedObra.porcentajePagado)}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="ml-2 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ) : (
          <div className="relative">
            <Input
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pr-10"
              required={required}
            />
            <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          </div>
        )}
      </div>
    </div>
  )
}

export function ObraSearchResults({
  obras,
  loading,
  error,
  searchTerm,
  onObraSelect,
}: ObraSearchResultsProps) {
  const getClienteName = (obra: ObraConPresupuesto) => {
    const cliente = obra?.cliente
    if (cliente?.razon_social) return cliente.razon_social
    if (cliente?.nombre && cliente?.apellido)
      return `${cliente.nombre} ${cliente.apellido}`
    return 'Cliente no identificado'
  }

  const formatMonto = (monto?: number) => {
    return monto ? `$${monto.toLocaleString()}` : '$0'
  }

  const formatPorcentaje = (porcentaje?: number) => {
    return porcentaje ? `${porcentaje.toFixed(1)}%` : '0%'
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="mb-3 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p className="text-sm text-gray-500">Buscando obras...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center text-sm text-red-600">{error}</div>
      </div>
    )
  }

  // Eliminar esta condición - ahora siempre mostramos las obras
  // if (!searchTerm.trim()) { ... }

  if (obras.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center text-sm text-gray-500">
          {searchTerm.trim()
            ? `No se encontraron obras con el criterio: "${searchTerm}"`
            : 'No hay obras con presupuesto aceptado y saldo pendiente'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="mb-4 text-sm text-gray-600">
        {obras.length} obra{obras.length !== 1 ? 's' : ''}{' '}
        {searchTerm.trim() ? 'encontrada' : 'disponible'}
        {obras.length !== 1 ? 's' : ''}
        {!searchTerm.trim() && (
          <span className="text-gray-500">
            {' '}
            (mostrando todas las obras con pagos pendientes)
          </span>
        )}
      </div>

      {obras.map((obra) => (
        <Card
          key={obra.cod_obra}
          className="cursor-pointer border p-4 transition-colors hover:border-blue-300 hover:bg-gray-50"
          onClick={() => onObraSelect(obra)}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-medium text-blue-600">
                #{obra.cod_obra}
              </span>
              <span className="text-sm text-gray-600">
                {getClienteName(obra)}
              </span>
            </div>
            <p className="text-sm text-gray-700">{obra.direccion}</p>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-gray-500">Presupuesto:</span>
                <p className="font-medium">
                  {formatMonto(obra.presupuesto?.valor)}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Pagado:</span>
                <p className="font-medium text-green-600">
                  {formatMonto(obra.totalPagado)}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Pendiente:</span>
                <p className="font-medium text-orange-600">
                  {formatMonto(obra.saldoPendiente)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-gray-200">
                <div
                  className="h-1.5 rounded-full bg-green-500 transition-all"
                  style={{
                    width: `${Math.min(obra.porcentajePagado || 0, 100)}%`,
                  }}
                />
              </div>
              <span className="text-xs font-medium">
                {formatPorcentaje(obra.porcentajePagado)}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
