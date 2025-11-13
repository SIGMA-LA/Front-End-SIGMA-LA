'use client'

import { useState, useEffect } from 'react'
import { Package, Calendar, Check, Loader2 } from 'lucide-react'
import type { Obra, PedidosListProps } from '@/types'
import EstadoObraBadge from '../shared/EstadoObraBadge'
import {
  getObrasParaPedidoStock,
  recibirStockObra,
  filterObras,
} from '@/actions/obras'

export default function PedidosList({ onSchedulePedido }: PedidosListProps) {
  const [obrasParaPedir, setObrasParaPedir] = useState<Obra[]>([])
  const [obrasEnEspera, setObrasEnEspera] = useState<Obra[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [paraPedirData, enEsperaData] = await Promise.all([
        getObrasParaPedidoStock(),
        filterObras({ estado: 'EN ESPERA DE STOCK' }),
      ])

      setObrasParaPedir(paraPedirData)
      // Filtramos también por tipo de cliente en el frontend por si la acción no lo hace
      setObrasEnEspera(
        enEsperaData.filter((o) => o.cliente.tipo_cliente === 'EMPRESA')
      )
    } catch (err) {
      setError('No se pudieron cargar las obras para pedidos de stock.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleRecibirStock = async (obraId: number) => {
    setUpdatingId(obraId)
    try {
      await recibirStockObra(obraId)
      // Refrescar los datos para que la obra cambie de lista
      await fetchData()
    } catch (err) {
      alert('Error al confirmar la recepción del stock.')
      console.error(err)
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading && obrasParaPedir.length === 0 && obrasEnEspera.length === 0) {
    return <div className="p-8 text-center">Cargando obras...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Pedidos de Stock
            </h1>
            <p className="text-sm text-gray-600">
              Gestión de pedidos de stock para obras de empresas.
            </p>
          </div>
        </div>

        {/* Obras listas para pedir stock */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Obras para Solicitar Stock ({obrasParaPedir.length})
          </h2>
          <div className="grid gap-4 sm:gap-6">
            {obrasParaPedir.length > 0 ? (
              obrasParaPedir.map((obra) => (
                <ObraPedidoCard
                  key={obra.cod_obra}
                  obra={obra}
                  onActionClick={() =>
                    onSchedulePedido && onSchedulePedido(obra)
                  }
                  actionLabel="Pedir Stock"
                  actionIcon={Calendar}
                />
              ))
            ) : (
              <p className="text-gray-500">
                No hay obras que requieran pedido de stock en este momento.
              </p>
            )}
          </div>
        </div>

        {/* Obras en espera de stock */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Obras en Espera de Stock ({obrasEnEspera.length})
          </h2>
          <div className="grid gap-4 sm:gap-6">
            {obrasEnEspera.length > 0 ? (
              obrasEnEspera.map((obra) => (
                <ObraPedidoCard
                  key={obra.cod_obra}
                  obra={obra}
                  onActionClick={() => handleRecibirStock(obra.cod_obra)}
                  actionLabel={
                    updatingId === obra.cod_obra
                      ? 'Confirmando...'
                      : 'Confirmar Recepción'
                  }
                  actionIcon={updatingId === obra.cod_obra ? Loader2 : Check}
                  isUpdating={updatingId === obra.cod_obra}
                />
              ))
            ) : (
              <p className="text-gray-500">
                No hay obras esperando recepción de materiales.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente interno para evitar repetir código
const ObraPedidoCard = ({
  obra,
  onActionClick,
  actionLabel,
  actionIcon: Icon,
  isUpdating = false,
}: {
  obra: Obra
  onActionClick: () => void
  actionLabel: string
  actionIcon: React.ElementType
  isUpdating?: boolean
}) => (
  <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm transition-shadow hover:shadow-md">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {obra.direccion}
        </h3>
        <p className="text-gray-600">
          Cliente: {`${obra.cliente.razon_social}`}
        </p>
        <p className="text-sm text-gray-500">
          Inicio: {new Date(obra.fecha_ini).toLocaleDateString('es-AR')}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <EstadoObraBadge estado={obra.estado} />
        <button
          onClick={onActionClick}
          disabled={isUpdating}
          className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-400"
        >
          <Icon className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
          {actionLabel}
        </button>
      </div>
    </div>
  </div>
)
