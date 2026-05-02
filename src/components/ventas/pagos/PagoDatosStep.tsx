'use client'

import { CheckCircle2, DollarSign, Calendar, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { ObraConPresupuesto } from '@/types'

interface PagoDatosStepProps {
  selectedObra: ObraConPresupuesto
  monto: string
  setMonto: (v: string) => void
  fechaPago: string
  setFechaPago: (v: string) => void
  onStepBack: () => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
  error: string | null
}

export default function PagoDatosStep({
  selectedObra,
  monto,
  setMonto,
  fechaPago,
  setFechaPago,
  onStepBack,
  onSubmit,
  loading,
  error,
}: PagoDatosStepProps) {
  const getClienteName = (
    cliente: { razon_social?: string; nombre?: string; apellido?: string } | null | undefined
  ) => {
    if (cliente?.razon_social) return cliente.razon_social
    if (cliente?.nombre && cliente?.apellido) return `${cliente.nombre} ${cliente.apellido}`
    return 'Cliente no identificado'
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Resumen de la obra */}
      <div className="lg:col-span-1">
        <h3 className="mb-4 flex items-center font-medium text-gray-900">
          <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
          Obra seleccionada
        </h3>
        <div className="space-y-3 rounded-lg border border-green-200 bg-green-50 p-4">
          <div>
            <p className="font-semibold text-gray-900">#{selectedObra.cod_obra}</p>
            <p className="text-sm text-gray-700">{selectedObra.direccion}</p>
          </div>
          <div className="text-sm">
            <p className="mb-2 text-gray-600">
              <strong>Cliente:</strong> {getClienteName(selectedObra.cliente)}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Presupuesto:</span>
                <span className="font-medium">
                  ${selectedObra.presupuesto?.valor?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Pagado:</span>
                <span className="font-medium text-green-600">
                  ${selectedObra.totalPagado?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-500">Pendiente:</span>
                <span className="font-bold text-orange-600">
                  ${selectedObra.saldoPendiente?.toLocaleString() || '0'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de pago */}
      <div className="lg:col-span-2">
        <form onSubmit={onSubmit} className="space-y-6">
          <h3 className="mb-4 flex items-center font-medium text-gray-900">
            <DollarSign className="mr-2 h-5 w-5 text-blue-500" />
            Datos del pago
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Monto del pago</label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-3 pr-3 pl-8 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:opacity-50"
                  placeholder="0.00"
                  required
                  disabled={loading || selectedObra.cantidad_pagos === 0}
                />
              </div>
              {selectedObra.cantidad_pagos === 0 && (
                <p className="mt-1 text-sm font-medium text-blue-600">
                  El primer pago debe ser exactamente el 70% del presupuesto.
                </p>
              )}
              {selectedObra.saldoPendiente !== undefined && parseFloat(monto) > selectedObra.saldoPendiente && (
                <p className="mt-1 text-sm text-red-600">El monto no puede exceder el saldo pendiente</p>
              )}
              {selectedObra.saldoPendiente !== undefined && selectedObra.cantidad_pagos > 0 && (
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMonto((selectedObra.saldoPendiente! * 0.7).toFixed(2))}
                    className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700 transition-colors hover:bg-blue-200"
                    disabled={loading}
                  >
                    70%
                  </button>
                  <button
                    type="button"
                    onClick={() => setMonto(selectedObra.saldoPendiente!.toString())}
                    className="rounded bg-green-100 px-2 py-1 text-xs text-green-700 transition-colors hover:bg-green-200"
                    disabled={loading}
                  >
                    Total
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                <Calendar className="mr-1 inline h-4 w-4" />
                Fecha del pago
              </label>
              <input
                type="date"
                value={fechaPago}
                onChange={(e) => setFechaPago(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onStepBack}
              disabled={loading}
              className="flex-1"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Volver
            </Button>
            <Button type="submit" disabled={loading || !monto || !fechaPago} className="flex-1">
              {loading ? 'Creando...' : 'Crear Pago'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
