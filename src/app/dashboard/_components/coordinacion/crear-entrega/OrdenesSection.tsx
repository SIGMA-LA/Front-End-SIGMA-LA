'use client'

import { Package, Loader2 } from 'lucide-react'
import type { OrdenProduccion } from '@/types'
import OrdenProduccionCard from '../../produccion/OrdenProduccionCard'

interface OrdenesSectionProps {
  obraId: number | null
  loading: boolean
  error: string | null
  ordenes: OrdenProduccion[]
  selectedOrden: OrdenProduccion | null
  onSelectOrden: (orden: OrdenProduccion) => void
}

export default function OrdenesSection({
  obraId,
  loading,
  error,
  ordenes,
  selectedOrden,
  onSelectOrden,
}: OrdenesSectionProps) {
  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-gray-700">
        <Package className="mr-1 inline h-4 w-4" />
        Órdenes de Producción (Opcional)
      </label>
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        {!obraId ? (
          <p className="text-center text-sm text-gray-500">
            Seleccione una obra para ver las órdenes de producción.
          </p>
        ) : loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <p className="ml-2 text-sm text-gray-600">Cargando órdenes...</p>
          </div>
        ) : error ? (
          <p className="text-center text-sm text-red-600">{error}</p>
        ) : ordenes.length === 0 ? (
          <p className="text-center text-sm text-gray-500">
            No hay órdenes de producción finalizadas para esta obra.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {ordenes.map((orden) => (
              <OrdenProduccionCard
                key={orden.cod_op}
                orden={orden}
                isSelected={selectedOrden?.cod_op === orden.cod_op}
                onClick={() => onSelectOrden(orden)}
                estado={orden.estado}
              />
            ))}
          </div>
        )}
      </div>

      {/* Visualizador de PDF */}
      {selectedOrden && (
        <div className="mt-4">
          <h4 className="mb-2 text-base font-semibold text-gray-700">
            Visualización de Orden #{selectedOrden.cod_op}
          </h4>
          <div className="relative h-[600px] w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
            <iframe
              src={`${selectedOrden.url}#view=FitH`}
              className="h-full w-full"
              title={`Orden de Producción #${selectedOrden.cod_op}`}
            />
          </div>
        </div>
      )}
    </div>
  )
}
