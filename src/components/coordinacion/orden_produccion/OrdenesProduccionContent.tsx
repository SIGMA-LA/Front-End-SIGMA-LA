'use client'

import { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, Package } from 'lucide-react'
import type { OrdenProduccion, Cliente } from '@/types'
import { aprobarOrdenProduccion } from '@/actions/ordenes'
import OrdenProduccionCard from './OrdenProduccionCard'
import OrdenProduccionDetailsModal from './OrdenProduccionDetailsModal'
import OPConfirmModal from './OPConfirmModal'

interface OrdenesProduccionContentProps {
  ordenes: OrdenProduccion[]
}

export default function OrdenesProduccionContent({
  ordenes,
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
  const [isApproving, setIsApproving] = useState(false)

  // Filtros
  const [filtroEstado, setFiltroEstado] = useState<string>(
    searchParams.get('estado') || 'PENDIENTE'
  )
  const [filtroCliente, setFiltroCliente] = useState<string>('')

  // Extraer clientes únicos
  const clientes = useMemo(() => {
    const clientesUnicos = new Map<string, Cliente>()
    ordenes.forEach((orden) => {
      if (orden.obra?.cliente) {
        clientesUnicos.set(orden.obra.cliente.cuil, orden.obra.cliente)
      }
    })
    return Array.from(clientesUnicos.values())
  }, [ordenes])

  // Filtrar órdenes por cliente
  const ordenesFiltradas = useMemo(() => {
    return filtroCliente
      ? ordenes.filter((orden) => orden.obra?.cliente?.cuil === filtroCliente)
      : ordenes
  }, [ordenes, filtroCliente])

  const handleEstadoChange = (nuevoEstado: string) => {
    setFiltroEstado(nuevoEstado)
    const params = new URLSearchParams(searchParams.toString())
    if (nuevoEstado) {
      params.set('estado', nuevoEstado)
    } else {
      params.delete('estado')
    }
    router.push(`?${params.toString()}`)
  }

  const handleConfirmAprobar = async () => {
    if (!ordenToApprove) return

    setIsApproving(true)
    try {
      const result = await aprobarOrdenProduccion(ordenToApprove.cod_op)

      if (result.success) {
        alert(result.message || 'Orden aprobada exitosamente')
        setIsConfirmModalOpen(false)
        setOrdenToApprove(null)
        router.refresh()
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

  const handleAprobar = (orden: OrdenProduccion) => {
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
              onChange={(e) => handleEstadoChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
    </>
  )
}
