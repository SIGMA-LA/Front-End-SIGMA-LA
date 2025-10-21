'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { getPagos } from '@/actions/pagos'
import { Pago, PagosFilter } from '@/types'
import PagosFilters from './pagos/PagosFilters'
import PagoModal from './pagos/PagoModal'

// Helper para mostrar el nombre del cliente
const getClienteName = (obra: any) => {
  const cliente = obra?.cliente
  if (cliente?.razon_social) {
    return cliente.razon_social
  }
  if (cliente?.nombre && cliente?.apellido) {
    return `${cliente.nombre} ${cliente.apellido}`
  }
  return 'Cliente no identificado'
}

interface PagosListProps {
  // props si las necesitas
}

export default function PagosList({}: PagosListProps) {
  // Estados principales
  const [pagos, setPagos] = useState<Pago[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados del modal
  const [modalOpen, setModalOpen] = useState(false)
  const [pagoAEditar, setPagoAEditar] = useState<Pago | null>(null)

  // Estados de filtros y estadísticas
  const [filters, setFilters] = useState<PagosFilter>({})
  const [totalPagos, setTotalPagos] = useState(0)
  const [totalMonto, setTotalMonto] = useState(0)

  // Cargar pagos inicialmente
  useEffect(() => {
    loadPagos()
  }, [])

  // Recargar pagos cuando cambien los filtros
  useEffect(() => {
    loadPagos()
  }, [filters])

  const loadPagos = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getPagos(filters)
      setPagos(data)

      // Calcular totales
      setTotalPagos(data.length)
      setTotalMonto(data.reduce((sum, pago) => sum + pago.monto, 0))
    } catch (err: any) {
      setError(err.message || 'Error al cargar los pagos')
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Pagos</h1>
          <p className="text-gray-600">
            Administra los pagos de clientes ({totalPagos} pagos • Total: $
            {totalMonto.toLocaleString()})
          </p>
        </div>
        <Button
          onClick={() => {
            setPagoAEditar(null)
            setModalOpen(true)
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Crear Pago
        </Button>
      </div>

      {/* Filtros */}
      <PagosFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Lista de pagos */}
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
                        onClick={() => {
                          setPagoAEditar(pago)
                          setModalOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Modal */}
      {modalOpen && (
        <PagoModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setPagoAEditar(null)
          }}
          onPagoCreado={(nuevoPago: Pago) => {
            loadPagos() // Recargar toda la lista para mantener filtros
            setModalOpen(false)
          }}
          pagoAEditar={pagoAEditar}
          onPagoEditado={(pagoEditado: Pago) => {
            loadPagos() // Recargar toda la lista para mantener filtros
            setModalOpen(false)
            setPagoAEditar(null)
          }}
        />
      )}
    </div>
  )
}
