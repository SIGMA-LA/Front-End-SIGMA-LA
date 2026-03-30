'use client'

import { useEffect, useState, useMemo } from 'react'
import { getPagosObra } from '@/actions/pagos'
import PagoModal from './pagos/PagoModal'
import { Pago, Obra, Cliente } from '@/types'
import PagoCard from './PagoCard'
import { User, Building2, Plus } from 'lucide-react'

// Helper para mostrar el nombre del cliente correctamente
const getClienteName = (cliente: Cliente) => {
  if (cliente?.razon_social) {
    return cliente.razon_social
  }
  if (cliente?.nombre && cliente?.apellido) {
    return `${cliente.nombre} ${cliente.apellido}`
  }
  return 'Cliente no identificado'
}

interface PagosObraProps {
  obra: Obra
  onClose: () => void
}

export default function PagosObra({ obra, onClose }: PagosObraProps) {
  const [pagos, setPagos] = useState<Pago[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const presupuestoAceptado = useMemo(
    () =>
      obra.presupuesto?.find(
        (p) => p.fecha_aceptacion && p.fecha_aceptacion !== ''
      ),
    [obra.presupuesto]
  )

  const totalPagado = useMemo(
    () => pagos.reduce((sum, pago) => sum + pago.monto, 0),
    [pagos]
  )

  const puedeCrearPago = useMemo(() => {
    if (!presupuestoAceptado) return false
    if (totalPagado >= presupuestoAceptado.valor - 0.01) return false
    if (pagos.length === 0) return true
    return obra.estado === 'ENTREGADA'
  }, [pagos.length, obra.estado, presupuestoAceptado, totalPagado])

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getPagosObra(obra.cod_obra)
        setPagos(data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error al cargar los pagos')
      } finally {
        setLoading(false)
      }
    }
    fetchPagos()
  }, [obra.cod_obra])

  const refreshPagos = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getPagosObra(obra.cod_obra)
      setPagos(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar los pagos')
    } finally {
      setLoading(false)
    }
  }
  const handleCrearPago = () => {
    setModalOpen(true)
  }

  const handlePagoCreado = () => {
    refreshPagos() // Recargar todos los pagos después de crear uno nuevo
  }

  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-gray-200 bg-white p-0 shadow-lg lg:mt-16">
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-2xl border-b border-gray-100 bg-blue-50 px-6 py-5">
        <div>
          <h2 className="mb-1 text-2xl font-bold text-gray-900">Pagos</h2>
          <div className="flex items-center gap-2 text-base text-gray-700">
            <Building2 className="h-5 w-5 text-blue-400" />
            <span className="font-semibold">{obra.direccion}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            <User className="h-4 w-4 text-gray-400" />
            Cliente: {getClienteName(obra.cliente)}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCrearPago}
            className="flex items-center gap-1 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            disabled={!puedeCrearPago}
            title={
              !puedeCrearPago
                ? 'No se puede registrar un pago en este momento. Verifique el estado de la obra o si ya se pagó el total.'
                : 'Crear un nuevo pago'
            }
          >
            <Plus className="h-4 w-4" /> Crear pago
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-blue-100 px-4 py-2 font-semibold text-blue-700 transition hover:bg-blue-200"
          >
            ← Volver
          </button>
        </div>
      </div>
      {/* Body */}
      <div className="p-6">
        {loading ? (
          <div className="py-8 text-center text-gray-600">
            Cargando pagos...
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-600">{error}</div>
        ) : pagos.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No hay pagos registrados para esta obra.
          </div>
        ) : (
          <div className="space-y-6">
            {pagos.map((pago) => (
              <PagoCard
                key={pago.cod_pago}
                pago={pago}
                onRefresh={refreshPagos}
              />
            ))}
          </div>
        )}
      </div>
      <PagoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onPagoCreado={handlePagoCreado}
      />
    </div>
  )
}
