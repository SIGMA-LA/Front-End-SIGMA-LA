'use client'

import { useEffect, useState } from 'react'
import PagoCard from './PagoCard'
import PagoModal from './PagoModal'
import { Pago } from '@/types'
import { getAllPagos } from '@/actions/pagos'
import { DollarSign } from 'lucide-react'

interface PagosListProps {}

export default function PagosList(props: PagosListProps) {
  const [pagos, setPagos] = useState<Pago[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagoAEditar, setPagoAEditar] = useState<Pago | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getAllPagos()
        setPagos(data)
      } catch (err: any) {
        setError(err.message || 'Error al cargar los pagos')
      } finally {
        setLoading(false)
      }
    }
    fetchPagos()
  }, [])

  const refreshPagos = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllPagos()
      setPagos(data)
    } catch (err: any) {
      setError(err.message || 'Error al cargar los pagos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-2 sm:p-4 lg:p-8">
      <div className="mx-auto w-full max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-7xl">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 sm:h-12 sm:w-12">
              <DollarSign className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h1 className="flex text-xl font-bold text-gray-900 sm:text-2xl">
                Pagos
              </h1>
              <p className="text-xs text-gray-600 sm:text-sm">
                Gestión de pagos registrados en obras
              </p>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="py-8 text-center text-gray-600">
            Cargando pagos...
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-600">{error}</div>
        ) : pagos.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No hay pagos registrados.
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {pagos.map((pago) => (
              <div key={pago.cod_pago}>
                <PagoCard
                  pago={pago}
                  onRefresh={refreshPagos}
                  onEdit={() => {
                    setPagoAEditar(pago)
                    setModalOpen(true)
                  }}
                  obra={pago.obra}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {modalOpen && pagoAEditar && (
        <PagoModal
          codObra={pagoAEditar.cod_obra}
          open={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setPagoAEditar(null)
          }}
          onPagoCreado={() => {}}
          pagoAEditar={pagoAEditar}
          onPagoEditado={() => {
            setModalOpen(false)
            setPagoAEditar(null)
            refreshPagos()
          }}
        />
      )}
    </div>
  )
}
