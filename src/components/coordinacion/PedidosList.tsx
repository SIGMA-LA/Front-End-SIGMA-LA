'use client'

import { useState, useEffect } from 'react'
import { Package, Check, Loader2, Plus, ArrowRight, Building2, ChevronDown, ChevronUp } from 'lucide-react'
import type { Obra, PedidoStock, EstadoPedidoStock } from '@/types'

import { getObrasParaPedidoStock } from '@/actions/obras'
import { getPedidosStock, updatePedidoStockEstado } from '@/actions/pedidoStock'
import SolicitarStockModal from '../produccion/SolicitarStockModal'
import { notify } from '@/lib/toast'

export default function PedidosList() {
  const [pedidos, setPedidos] = useState<PedidoStock[]>([])
  const [obrasElegibles, setObrasElegibles] = useState<Obra[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [modalOpenForObraId, setModalOpenForObraId] = useState<number | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [pedidosRes, obrasRes] = await Promise.all([
        getPedidosStock(),
        getObrasParaPedidoStock(),
      ])

      if (pedidosRes.success && pedidosRes.data) {
        setPedidos(pedidosRes.data)
        const activeObrasIds = new Set(pedidosRes.data.map(p => p.obraId))
        setObrasElegibles(obrasRes.filter((o: Obra) => !activeObrasIds.has(o.cod_obra)))
      } else {
        throw new Error(pedidosRes.error || 'Error al obtener pedidos')
      }
    } catch (err) {
      setError('No se pudieron cargar los datos de stock.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleUpdateEstado = async (id: string, nuevoEstado: EstadoPedidoStock) => {
    setUpdatingId(id)
    try {
      const res = await updatePedidoStockEstado(id, nuevoEstado)
      if (!res.success) {
        notify.error(res.error || 'Error al actualizar el estado del pedido.')
        return
      }
      await fetchData()
      notify.success('Estado del pedido actualizado.')
    } catch (err) {
      notify.error('Error de conexión.')
      console.error(err)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleOpenCrearPedido = (obraId: number) => {
    setModalOpenForObraId(obraId)
  }

  const handlePedidoCreado = () => {
    fetchData()
  }

  if (loading && pedidos.length === 0 && obrasElegibles.length === 0) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>
  }

  const pedidosActivos = pedidos.filter(p => p.estado !== 'RECIBIDO')


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
              Gestión de pedidos de stock para obras.
            </p>
          </div>
        </div>

        {/* Pedidos Activos */}
        <div className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800">
            Pedidos Activos <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-sm text-blue-700">{pedidosActivos.length}</span>
          </h2>
          <div className="grid gap-4 sm:gap-6">
            {pedidosActivos.length > 0 ? (
              pedidosActivos.map((pedido) => (
                <PedidoCard
                  key={pedido.id}
                  pedido={pedido}
                  isUpdating={updatingId === pedido.id}
                  onUpdateEstado={handleUpdateEstado}
                />
              ))
            ) : (
              <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
                No hay pedidos de stock activos en este momento.
              </p>
            )}
          </div>
        </div>

        {/* Obras listas para pedir stock */}
        <div className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800">
            Crear Pedido Manual (Obras Pagadas) <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-sm text-orange-700">{obrasElegibles.length}</span>
          </h2>
          <div className="grid gap-4 sm:gap-6">
            {obrasElegibles.length > 0 ? (
              obrasElegibles.map((obra) => (
                <div key={obra.cod_obra} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">Obra #{obra.cod_obra} - {obra.direccion}</h3>
                        <ObraTypeBadge esGrande={obra.esGrande} />
                      </div>
                      <p className="text-gray-600">Cliente: {obra.cliente.razon_social || `${obra.cliente.nombre} ${obra.cliente.apellido}`}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenCrearPedido(obra.cod_obra)}
                    className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-700 disabled:opacity-50"
                  >
                    <Plus className="h-5 w-5" />
                    Generar Pedido
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No hay obras elegibles para crear pedidos de stock.
              </p>
            )}
          </div>
        </div>
      </div>
      <SolicitarStockModal
        isOpen={modalOpenForObraId !== null}
        onClose={() => setModalOpenForObraId(null)}
        obraId={modalOpenForObraId || 0}
        onSuccess={handlePedidoCreado}
        isCoordinacion={true}
      />
    </div>
  )
}

function ObraTypeBadge({ esGrande }: { esGrande?: boolean }) {
  if (!esGrande) return null
  return (
    <div title="Obra Mayor" className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-600">
      <Building2 className="h-4 w-4" />
    </div>
  )
}

function PedidoCard({ pedido, isUpdating, onUpdateEstado }: { pedido: PedidoStock, isUpdating: boolean, onUpdateEstado: (id: string, estado: EstadoPedidoStock) => void }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const obra = pedido.obra
  if (!obra) return null

  const getStatusColor = (estado: EstadoPedidoStock) => {
    switch (estado) {
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'APROBADO': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'PEDIDO': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'RECIBIDO': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className={`rounded-xl border border-l-4 bg-white p-6 shadow-sm transition-shadow hover:shadow-md border-l-blue-500`}>
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <h3 className="text-lg font-bold text-gray-900">
              Obra #{pedido.obraId} - {obra.direccion}
            </h3>
            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusColor(pedido.estado)}`}>
              {pedido.estado}
            </span>
            <ObraTypeBadge esGrande={obra.esGrande} />
          </div>
          <p className="mb-1 text-sm text-gray-600">
            <span className="font-semibold text-gray-700">Cliente:</span> {obra.cliente?.razon_social || `${obra.cliente?.nombre} ${obra.cliente?.apellido}`}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {isExpanded ? 'Ocultar Detalles' : 'Ver Detalles'}
            </button>
          </div>
          {isExpanded && (
            <div className="mt-3 rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-700">Detalle del Pedido:</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">{pedido.descripcion}</p>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
          {pedido.estado === 'PENDIENTE' && (
            <button
              onClick={() => onUpdateEstado(pedido.id, 'APROBADO')}
              disabled={isUpdating}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {isUpdating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
              Aprobar
            </button>
          )}
          {pedido.estado === 'APROBADO' && (
            <button
              onClick={() => onUpdateEstado(pedido.id, 'PEDIDO')}
              disabled={isUpdating}
              className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 font-medium text-white transition hover:bg-purple-700 disabled:opacity-50"
            >
              {isUpdating ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
              Marcar como Pedido
            </button>
          )}
          {pedido.estado === 'PEDIDO' && (
            <button
              onClick={() => onUpdateEstado(pedido.id, 'RECIBIDO')}
              disabled={isUpdating}
              className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
            >
              {isUpdating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Package className="h-5 w-5" />}
              Marcar Recepción
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
