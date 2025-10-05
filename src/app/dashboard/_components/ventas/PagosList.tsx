'use client'

import { useEffect, useState } from 'react'
import PagoCard from './PagoCard'
import { Pago } from '@/types'
import { getAllPagos } from '@/actions/pagos'
import { DollarSign } from 'lucide-react'

interface PagosListProps {}

export default function PagosList(props: PagosListProps) {
  const [pagos, setPagos] = useState<Pago[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="flex text-2xl font-bold text-gray-900 sm:text-3xl">
                Pagos
              </h1>
              <p className="text-sm text-gray-600">
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
          <div className="space-y-6">
            {pagos.map((pago) => (
              <div key={pago.cod_pago}>
                <PagoCard
                  pago={pago}
                  onRefresh={refreshPagos}
                  onEdit={() => {}}
                  obra={pago.obra}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
