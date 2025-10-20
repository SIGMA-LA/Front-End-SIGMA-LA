'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { getPagos, hayObrasPendientes, deletePago } from '@/actions/pagos'
import { Pago, PagosFilter } from '@/types'
import PagoModal from '@/components/ventas/pagos/PagoModal'
import PagosFilters from './PagosFilters'

const getClienteName = (
  obra:
    | {
        cliente?: { razon_social?: string; nombre?: string; apellido?: string }
      }
    | null
    | undefined
) => {
  const cliente = obra?.cliente
  if (cliente?.razon_social) return cliente.razon_social
  if (cliente?.nombre && cliente?.apellido)
    return `${cliente.nombre} ${cliente.apellido}`
  return 'Cliente no identificado'
}

export default function PagosList() {
  const [pagos, setPagos] = useState<Pago[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)

  const [filters, setFilters] = useState<PagosFilter>({})
  const [totalPagos, setTotalPagos] = useState(0)
  const [totalMonto, setTotalMonto] = useState(0)
  const [hayPendientes, setHayPendientes] = useState(true)
  const [loadingPendientes, setLoadingPendientes] = useState(true)

  useEffect(() => {
    loadPagos()
    checkObrasPendientes()
  }, [])

  useEffect(() => {
    loadPagos()
  }, [filters])

  const checkObrasPendientes = async () => {
    try {
      setLoadingPendientes(true)
      const pendientes = await hayObrasPendientes()
      setHayPendientes(pendientes)
    } catch (err: unknown) {
      console.error('Error al verificar obras pendientes:', err)
      // En caso de error, permitir crear pagos
      setHayPendientes(true)
    } finally {
      setLoadingPendientes(false)
    }
  }

  const loadPagos = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getPagos(filters)
      setPagos(data)

      setTotalPagos(data.length)
      setTotalMonto(data.reduce((sum, pago) => sum + pago.monto, 0))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar los pagos')
      setPagos([])
      setTotalPagos(0)
      setTotalMonto(0)
    } finally {
      setLoading(false)
    }
  }

  const handleFiltersChange = (newFilters: PagosFilter) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({})
  }

  const handleDeletePago = async (codPago: number) => {
    if (
      !confirm(
        '¿Estás seguro de que deseas eliminar este pago? Esta acción no se puede deshacer.'
      )
    ) {
      return
    }

    try {
      await deletePago(codPago)
      loadPagos() // Recargar la lista después de eliminar
      checkObrasPendientes() // Verificar si aún hay obras pendientes
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el pago')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Pagos</h1>
          <p className="text-gray-600">
            Administra los pagos de clientes ({totalPagos} pagos • Total: $
            {totalMonto.toLocaleString()})
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Button
            onClick={() => {
              setModalOpen(true)
            }}
            className="flex items-center gap-2"
            disabled={loadingPendientes || !hayPendientes}
          >
            <Plus className="h-4 w-4" />
            Crear Pago
          </Button>
          {!loadingPendientes && !hayPendientes && (
            <p className="text-xs text-gray-500">
              No hay obras con pagos pendientes
            </p>
          )}
        </div>
      </div>

      <PagosFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      <Card>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <div className="mb-2 text-red-600">{error}</div>
              <Button onClick={loadPagos} variant="outline">
                Reintentar
              </Button>
            </div>
          ) : pagos.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              {Object.keys(filters).length > 0
                ? 'No se encontraron pagos con los filtros aplicados'
                : 'No hay pagos registrados'}
            </div>
          ) : (
            <div className="space-y-4">
              {pagos.map((pago) => (
                <div
                  key={pago.cod_pago}
                  className="rounded-lg border p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">#{pago.cod_pago}</span>
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                          Pagado
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>
                          <strong>Cliente:</strong> {getClienteName(pago.obra)}
                        </p>
                        <p>
                          <strong>Obra:</strong>{' '}
                          {pago.obra?.direccion || `Obra #${pago.cod_obra}`}
                        </p>
                        <p>
                          <strong>Fecha:</strong>{' '}
                          {new Date(pago.fecha_pago).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Monto:</strong> ${pago.monto.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePago(pago.cod_pago)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {modalOpen && (
        <PagoModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false)
          }}
          onPagoCreado={() => {
            loadPagos()
            checkObrasPendientes() // Actualizar estado de obras pendientes
            setModalOpen(false)
          }}
        />
      )}
    </div>
  )
}
