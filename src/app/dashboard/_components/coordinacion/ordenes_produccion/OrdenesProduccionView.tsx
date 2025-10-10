'use client'

import { useState, useEffect } from 'react'
import { Package, Filter } from 'lucide-react'
import type { OrdenProduccion, Cliente } from '@/types'
import {
  obtenerOrdenesProduccion,
  aprobarOrdenProduccion,
} from '@/actions/ordenes'
import OrdenProduccionCard from './OrdenProduccionCard'
import OrdenProduccionDetailsModal from './OrdenProduccionDetailsModal'
import OPConfirmModal from './OPConfirmModal'

export default function OrdenesProduccionView() {
  const [ordenes, setOrdenes] = useState<OrdenProduccion[]>([])
  const [todasLasOrdenes, setTodasLasOrdenes] = useState<OrdenProduccion[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrden, setSelectedOrden] = useState<OrdenProduccion | null>(
    null
  )
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  // Estados de Modal de Confirmación
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [ordenToApprove, setOrdenToApprove] = useState<OrdenProduccion | null>(
    null
  )
  const [isApproving, setIsApproving] = useState(false)

  // Filtros
  const [filtroEstado, setFiltroEstado] = useState<string>('PENDIENTE')
  const [filtroCliente, setFiltroCliente] = useState<string>('')

  const fetchOrdenes = async () => {
    try {
      setLoading(true)
      setError(null)

      const estadoFiltro = filtroEstado as
        | 'PENDIENTE'
        | 'APROBADA'
        | 'EN PRODUCCION'
        | 'FINALIZADA'
        | undefined
      const result = await obtenerOrdenesProduccion(
        filtroEstado ? estadoFiltro : undefined
      )

      if (result.success) {
        const ordenesData = result.data || []
        setOrdenes(ordenesData)

        // Extraer clientes únicos de las órdenes
        const clientesUnicos = new Map<string, Cliente>()
        ordenesData.forEach((orden: OrdenProduccion) => {
          if (orden.obra?.cliente) {
            clientesUnicos.set(orden.obra.cliente.cuil, orden.obra.cliente)
          }
        })
        setClientes(Array.from(clientesUnicos.values()))
      } else {
        setError(result.error || 'Error al cargar las órdenes')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  // Cargar todas las órdenes inicialmente para obtener todos los clientes
  const fetchTodasLasOrdenes = async () => {
    try {
      const result = await obtenerOrdenesProduccion()
      if (result.success) {
        const ordenesData = result.data || []
        setTodasLasOrdenes(ordenesData)

        // Extraer clientes únicos
        const clientesUnicos = new Map<string, Cliente>()
        ordenesData.forEach((orden: OrdenProduccion) => {
          if (orden.obra?.cliente) {
            clientesUnicos.set(orden.obra.cliente.cuil, orden.obra.cliente)
          }
        })
        setClientes(Array.from(clientesUnicos.values()))
      }
    } catch (err) {
      console.error('Error al cargar todas las órdenes:', err)
    }
  }

  useEffect(() => {
    fetchTodasLasOrdenes()
  }, [])

  useEffect(() => {
    fetchOrdenes()
  }, [filtroEstado])

  const handleConfirmAprobar = async () => {
    if (!ordenToApprove) return

    setIsApproving(true)
    try {
      const result = await aprobarOrdenProduccion(ordenToApprove.cod_op)

      if (result.success) {
        alert(result.message || 'Orden aprobada exitosamente')
        setIsConfirmModalOpen(false)
        setOrdenToApprove(null)
        await fetchOrdenes()
      } else {
        alert('Error: ' + (result.error || 'No se pudo aprobar la orden'))
      }
    } catch (err) {
      alert(
        'Error al aprobar la orden: ' +
          (err instanceof Error ? err.message : 'Error desconocido')
      )
    } finally {
      setIsApproving(false)
    }
  }

  const handleAprobar = async (orden: OrdenProduccion) => {
    setOrdenToApprove(orden)
    setIsConfirmModalOpen(true)
  }

  const handleVerDetalles = (orden: OrdenProduccion) => {
    setSelectedOrden(orden)
    setIsDetailsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false)
    setSelectedOrden(null)
  }

  // Filtrar órdenes por cliente en el frontend
  const ordenesFiltradas = filtroCliente
    ? ordenes.filter((orden) => orden.obra?.cliente?.cuil === filtroCliente)
    : ordenes

  if (loading && ordenes.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">
                Cargando órdenes de producción...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Órdenes de Producción
              </h1>
              <p className="text-sm text-gray-600">
                Gestión y aprobación de órdenes de producción
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Filtros</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Filtro por Estado */}
            <div>
              <label
                htmlFor="filtro-estado"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Estado
              </label>
              <select
                id="filtro-estado"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los estados</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="APROBADA">Aprobada</option>
                <option value="EN PRODUCCION">En Producción</option>
                <option value="FINALIZADA">Finalizada</option>
              </select>
            </div>

            {/* Filtro por Cliente */}
            <div>
              <label
                htmlFor="filtro-cliente"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Cliente
              </label>
              <select
                id="filtro-cliente"
                value={filtroCliente}
                onChange={(e) => setFiltroCliente(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los clientes</option>
                {clientes.map((cliente) => (
                  <option key={cliente.cuil} value={cliente.cuil}>
                    {cliente.tipo_cliente === 'EMPRESA'
                      ? cliente.razon_social
                      : `${cliente.nombre || ''} ${cliente.apellido || ''}`.trim()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-red-700">Error: {error}</p>
            <button
              onClick={fetchOrdenes}
              className="mt-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Lista de Órdenes */}
        {ordenesFiltradas.length === 0 ? (
          <div className="py-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">
              {filtroEstado || filtroCliente
                ? 'No hay órdenes que coincidan con los filtros seleccionados'
                : 'No hay órdenes de producción registradas'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {ordenesFiltradas.map((orden) => (
              <OrdenProduccionCard
                key={orden.cod_op}
                orden={orden}
                onVerDetalles={handleVerDetalles}
                onAprobar={handleAprobar}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalles */}
      <OrdenProduccionDetailsModal
        isOpen={isDetailsModalOpen}
        orden={selectedOrden}
        onClose={handleCloseModal}
      />

      {/* Modal de Confirmación */}
      <OPConfirmModal
        isOpen={isConfirmModalOpen}
        orden={ordenToApprove}
        onConfirm={handleConfirmAprobar}
        onCancel={() => {
          setIsConfirmModalOpen(false)
          setOrdenToApprove(null)
        }}
        loading={isApproving}
      />
    </div>
  )
}