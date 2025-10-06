'use client'

import { useEffect, useState } from 'react'
import { getPagosObra } from '@/actions/pagos'
import PagoModal from './PagoModal'
import { Pago, Obra } from '@/types'
import PagoCard from './PagoCard'
import { User, Building2, Plus } from 'lucide-react'

interface PagosObraProps {
  obra: Obra
  onClose: () => void
}

export default function PagosObra({ obra, onClose }: PagosObraProps) {
  const [pagos, setPagos] = useState<Pago[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [pagoAEditar, setPagoAEditar] = useState<Pago | null>(null)

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getPagosObra(obra.cod_obra)
        setPagos(data)
      } catch (err: any) {
        setError(err.message || 'Error al cargar los pagos')
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
    } catch (err: any) {
      setError(err.message || 'Error al cargar los pagos')
    } finally {
      setLoading(false)
    }
  }
  const handleCrearPago = () => {
    setPagoAEditar(null)
    setModalOpen(true)
  }

  const handleEditarPago = (pago: Pago) => {
    setPagoAEditar(pago)
    setModalOpen(true)
  }

  const handlePagoCreado = (nuevoPago: Pago) => {
    setPagos((prev) => [nuevoPago, ...prev])
  }

  const handlePagoEditado = (pagoEditado: Pago) => {
    setPagos((prev) =>
      prev.map((p) => (p.cod_pago === pagoEditado.cod_pago ? pagoEditado : p))
    )
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
            Cliente: {obra.cliente?.razon_social || 'No asignado'}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCrearPago}
            className="flex items-center gap-1 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700"
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
                onEdit={() => handleEditarPago(pago)} // CAMBIO
              />
            ))}
          </div>
        )}
      </div>
      <PagoModal
        codObra={obra.cod_obra}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onPagoCreado={handlePagoCreado}
        pagoAEditar={pagoAEditar} // PASA EL PAGO A EDITAR
        onPagoEditado={handlePagoEditado} // PASA EL HANDLER DE EDICIÓN
      />
    </div>
  )
}
