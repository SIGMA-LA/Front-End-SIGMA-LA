'use client'

import { useState, useEffect } from 'react'
import {
  Package,
  Check,
  Loader2,
  Plus,
  ArrowRight,
  Building2,
  ChevronDown,
  ChevronUp,
  MapPin,
  User,
  X,
} from 'lucide-react'
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
  const [modalOpenForObraId, setModalOpenForObraId] = useState<number | null>(
    null
  )

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
        const activeObrasIds = new Set(pedidosRes.data.map((p) => p.obraId))
        setObrasElegibles(
          obrasRes.filter((o: Obra) => !activeObrasIds.has(o.cod_obra))
        )
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

  const handleUpdateEstado = async (
    id: string,
    nuevoEstado: EstadoPedidoStock
  ) => {
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
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>
  }

  const pedidosActivos = pedidos.filter((p) => p.estado !== 'RECIBIDO')

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
            Pedidos Activos{' '}
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-sm text-blue-700">
              {pedidosActivos.length}
            </span>
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
            Crear Pedido Manual (Obras Pagadas){' '}
            <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-sm text-orange-700">
              {obrasElegibles.length}
            </span>
          </h2>
          <div className="grid gap-4 sm:gap-6">
            {obrasElegibles.length > 0 ? (
              obrasElegibles.map((obra) => (
                <div
                  key={obra.cod_obra}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Obra #{obra.cod_obra} - {obra.direccion}
                        </h3>
                        <ObraTypeBadge esGrande={obra.esGrande} />
                      </div>
                      <p className="text-gray-600">
                        Cliente:{' '}
                        {obra.cliente.razon_social ||
                          `${obra.cliente.nombre} ${obra.cliente.apellido}`}
                      </p>
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
    <div
      title="Obra Mayor"
      className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-600"
    >
      <Building2 className="h-4 w-4" />
    </div>
  )
}

function PedidoCard({
  pedido,
  isUpdating,
  onUpdateEstado,
}: {
  pedido: PedidoStock
  isUpdating: boolean
  onUpdateEstado: (id: string, estado: EstadoPedidoStock) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const obra = pedido.obra
  if (!obra) return null

  const getStatusColor = (estado: EstadoPedidoStock) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'APROBADO':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'PEDIDO':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'RECIBIDO':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const nombreCliente =
    obra.cliente?.tipo_cliente === 'EMPRESA'
      ? obra.cliente.razon_social
      : `${obra.cliente?.nombre ?? ''} ${obra.cliente?.apellido ?? ''}`.trim() ||
        'N/A'

  return (
    <>
      <ConfirmRecepcionModal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => {
          onUpdateEstado(pedido.id, 'RECIBIDO')
          setConfirmModalOpen(false)
        }}
        direccionObra={obra.direccion}
        isUpdating={isUpdating}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
        {/* Header con dirección y estado */}
        <div className="flex items-center justify-between border-b bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-3">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">
              Obra #{pedido.obraId} - {obra.direccion}
            </h3>
            <ObraTypeBadge esGrande={obra.esGrande} />
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusColor(pedido.estado)}`}
          >
            {pedido.estado}
          </span>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Ubicación */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Ubicación</p>
                <p className="font-semibold text-gray-900">
                  {obra.localidad?.nombre_localidad || 'N/A'}
                </p>
              </div>
            </div>

            {/* Cliente */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Cliente</p>
                <p className="font-semibold text-gray-900">{nombreCliente}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                {isExpanded ? 'Ocultar Detalles' : 'Ver Detalles'}
              </button>

              {isExpanded && (
                <div className="mt-3 max-w-2xl rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-700">
                    Detalle del Pedido:
                  </p>
                  <p className="mt-1 text-sm whitespace-pre-wrap text-gray-600">
                    {pedido.descripcion}
                  </p>
                </div>
              )}
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              {pedido.estado === 'PENDIENTE' && (
                <button
                  onClick={() => onUpdateEstado(pedido.id, 'APROBADO')}
                  disabled={isUpdating}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Aprobar
                </button>
              )}
              {pedido.estado === 'APROBADO' && (
                <button
                  onClick={() => onUpdateEstado(pedido.id, 'PEDIDO')}
                  disabled={isUpdating}
                  className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                  Marcar como Pedido
                </button>
              )}
              {pedido.estado === 'PEDIDO' && (
                <button
                  onClick={() => setConfirmModalOpen(true)}
                  disabled={isUpdating}
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Package className="h-4 w-4" />
                  )}
                  Marcar Recepción
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function ConfirmRecepcionModal({
  open,
  onClose,
  onConfirm,
  direccionObra,
  isUpdating,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  direccionObra: string
  isUpdating: boolean
}) {
  if (!open) return null

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm duration-200">
      <div className="animate-in zoom-in-95 relative w-full max-w-lg rounded-3xl bg-white shadow-2xl duration-200">
        <button
          onClick={onClose}
          disabled={isUpdating}
          className="absolute top-4 right-4 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-500 shadow-inner ring-4 ring-green-50/50">
            <Package className="h-8 w-8" />
          </div>

          <div className="mb-6 space-y-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">
              Confirmar Recepción
            </h2>
            <p className="text-sm font-medium text-slate-500">
              ¿Confirmas la recepción del stock para la obra en{' '}
              <span className="font-semibold text-slate-700">
                {direccionObra}
              </span>
              ?
            </p>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              className="inline-flex w-full justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-300 ring-inset hover:bg-slate-50 sm:w-auto"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isUpdating}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 hover:focus:ring-green-600 disabled:opacity-50 sm:w-auto"
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Confirmar Recepción
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
