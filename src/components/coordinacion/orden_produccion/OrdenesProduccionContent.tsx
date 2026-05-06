'use client'

import { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, Package } from 'lucide-react'
import { ESTADOS_ORDEN_PRODUCCION } from '@/constants'
import type { OrdenProduccion, Cliente } from '@/types'
import { approveOrdenProduccion } from '@/actions/ordenes'
import { notify } from '@/lib/toast'
import OrdenProduccionCard from './OrdenProduccionCard'
import OrdenProduccionDetailsModal from './OrdenProduccionDetailsModal'
import OPConfirmModal from './OPConfirmModal'
import RechazarOPModal from './RechazarOPModal'

interface OrdenesProduccionContentProps {
  ordenes: OrdenProduccion[]
  clientes: Cliente[]
}

export default function OrdenesProduccionContent({
  ordenes,
  clientes,
}: OrdenesProduccionContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedOrden, setSelectedOrden] = useState<OrdenProduccion | null>(
    null
  )
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [ordenToApprove, setOrdenToApprove] = useState<OrdenProduccion | null>(
    null
  )
  const [ordenToReject, setOrdenToReject] = useState<OrdenProduccion | null>(
    null
  )
  const [isApproving, setIsApproving] = useState(false)
  const [isRechazarModalOpen, setIsRechazarModalOpen] = useState(false)

  // Filtros desde URL
  const filtroEstado = searchParams.get('estado') || ''
  const filtroCliente = searchParams.get('cliente') || ''

  const handleFilterChange = (key: 'estado' | 'cliente', value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    // Reset page when filters change
    params.delete('page')
    router.push(`?${params.toString()}`)
  }


  const handleConfirmAprobar = async () => {
    if (!ordenToApprove) return

    setIsApproving(true)
    try {
      const result = await approveOrdenProduccion(ordenToApprove.cod_op)

      if (result.success) {
        notify.success('Orden aprobada exitosamente')
        setIsConfirmModalOpen(false)
        setOrdenToApprove(null)
        router.refresh()
      } else {
        notify.error(
          'Error: ' + (result.error || 'No se pudo aprobar la orden')
        )
      }
    } catch (err) {
      notify.error(
        'Error al aprobar la orden: ' +
          (err instanceof Error ? err.message : 'Error desconocido')
      )
    } finally {
      setIsApproving(false)
    }
  }

  const handleAprobar = (orden: OrdenProduccion) => {
    setOrdenToApprove(orden)
    setIsConfirmModalOpen(true)
  }

  const handleRechazar = (orden: OrdenProduccion) => {
    setOrdenToReject(orden)
    setIsRechazarModalOpen(true)
  }

  const handleVerDetalles = (orden: OrdenProduccion) => {
    setSelectedOrden(orden)
    setIsDetailsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false)
    setSelectedOrden(null)
  }

  return (
    <>
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
              onChange={(e) => handleFilterChange('estado', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Todos los estados</option>
              {ESTADOS_ORDEN_PRODUCCION.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
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
              onChange={(e) => handleFilterChange('cliente', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

      {/* Lista de Órdenes */}
      {ordenes.length === 0 ? (
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
          {ordenes.map((orden) => (
            <OrdenProduccionCard
              key={orden.cod_op}
              orden={orden}
              onVerDetalles={handleVerDetalles}
              onAprobar={handleAprobar}
              onRechazar={handleRechazar}
            />
          ))}
        </div>
      )}

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

      {/* Modal de Rechazo */}
      {ordenToReject && (
        <RechazarOPModal
          isOpen={isRechazarModalOpen}
          onClose={() => {
            setIsRechazarModalOpen(false)
            setOrdenToReject(null)
            router.refresh()
          }}
          cod_op={ordenToReject.cod_op}
        />
      )}
    </>
  )
}
