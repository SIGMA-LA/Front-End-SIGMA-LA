import { useState, useEffect, useCallback } from 'react'
import { Package, ExternalLink, Calendar, FileText } from 'lucide-react'
import type { OrdenProduccion } from '@/types'
import { getOrdenesByObra } from '@/actions/ordenes'
import { formatDateOnly } from '@/lib/utils'

interface OrdenesProduccionListProps {
  cod_obra: number
  onOrdenesLoaded?: (ordenes: OrdenProduccion[]) => void
}

const getEstadoBadge = (estado: string) => {
  const badges = {
    PENDIENTE: 'bg-gray-100 text-gray-800',
    APROBADA: 'bg-blue-100 text-blue-800',
    'EN PRODUCCION': 'bg-yellow-100 text-yellow-800',
    FINALIZADA: 'bg-green-100 text-green-800',
  }
  return badges[estado as keyof typeof badges] || 'bg-gray-100 text-gray-800'
}

export default function OrdenesProduccionList({
  cod_obra,
  onOrdenesLoaded,
}: OrdenesProduccionListProps) {
  const [ordenes, setOrdenes] = useState<OrdenProduccion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadOrdenes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getOrdenesByObra(cod_obra)
      setOrdenes(data)
      onOrdenesLoaded?.(data)
    } catch (error) {
      console.error('Error al cargar órdenes:', error)
      setError('Error al cargar las órdenes de producción')
    } finally {
      setLoading(false)
    }
  }, [cod_obra, onOrdenesLoaded])

  useEffect(() => {
    void loadOrdenes()
  }, [loadOrdenes])

  const handleOpenPdf = (url: string) => {
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-500">Cargando órdenes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-800">{error}</p>
      </div>
    )
  }

  if (ordenes.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
        <Package className="mx-auto mb-3 h-8 w-8 text-gray-400" />
        <p className="text-sm text-gray-500">
          No hay órdenes de producción para esta obra
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {ordenes.map((orden) => (
        <div
          key={orden.cod_op}
          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-3">
              <Package className="h-5 w-5 text-gray-400" />
              <span className="font-semibold text-gray-800">
                Orden #{orden.cod_op}
              </span>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getEstadoBadge(orden.estado)}`}
              >
                {orden.estado}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Confección: {formatDateOnly(orden.fecha_confeccion)}
                </span>
              </div>
              {orden.fecha_validacion && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Validación: {formatDateOnly(orden.fecha_validacion)}
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => handleOpenPdf(orden.url)}
            className="flex items-center space-x-2 rounded-md border border-blue-500 bg-white px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
          >
            <FileText className="h-4 w-4" />
            <span>Ver PDF</span>
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
