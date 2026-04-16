'use client'

import { Building2, CheckCircle2 } from 'lucide-react'
import type { ObraConPresupuesto } from '@/types'
import ObraSelect, { ObraSearchResults } from './ObraSelect'

interface PagoObraStepProps {
  selectedObra: ObraConPresupuesto | null
  searchTerm: string
  onSearchChange: (v: string) => void
  searchResults: ObraConPresupuesto[]
  searchLoading: boolean
  searchError: string | null
  onObraSelect: (obra: ObraConPresupuesto | null) => void
}

export default function PagoObraStep({
  selectedObra,
  searchTerm,
  onSearchChange,
  searchResults,
  searchLoading,
  searchError,
  onObraSelect,
}: PagoObraStepProps) {
  const getClienteName = (
    cliente: { razon_social?: string; nombre?: string; apellido?: string } | null | undefined
  ) => {
    if (cliente?.razon_social) return cliente.razon_social
    if (cliente?.nombre && cliente?.apellido) return `${cliente.nombre} ${cliente.apellido}`
    return 'Cliente no identificado'
  }

  return (
    <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Search Panel */}
      <div className="space-y-4">
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">
            <Building2 className="mr-1 inline h-4 w-4" />
            Buscar y seleccionar obra
          </label>
          <ObraSelect
            selectedObra={selectedObra}
            onObraSelect={onObraSelect}
            required
            placeholder="Buscar obra por dirección, cliente..."
            showResults={false}
            onSearchChange={onSearchChange}
            initialSearchTerm={searchTerm}
          />
        </div>

        <div className="rounded-lg bg-blue-50 p-3 text-sm text-gray-500">
          <p className="mb-1 font-medium text-blue-800">💡 Instrucciones:</p>
          <ul className="space-y-1 text-blue-700">
            <li>• Escribe para buscar obras por dirección o cliente</li>
            <li>• Los resultados aparecerán en el panel derecho</li>
            <li>• Solo obras con pagos pendientes</li>
            <li>• Haz clic en una obra para seleccionarla</li>
          </ul>
        </div>
      </div>

      {/* Results / Selected Obra Panel */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          {selectedObra ? (
            <>
              <CheckCircle2 className="mr-1 inline h-4 w-4 text-green-600" />
              Obra seleccionada
            </>
          ) : (
            <>
              <Building2 className="mr-1 inline h-4 w-4" />
              Resultados de búsqueda
            </>
          )}
        </label>

        <div className="max-h-[500px] min-h-[300px] overflow-y-auto rounded-lg border border-gray-200 p-4">
          {selectedObra ? (
            <div className="w-full">
              <div className="mb-4 text-center">
                <CheckCircle2 className="mx-auto mb-2 h-12 w-12 text-green-500" />
                <h3 className="text-lg font-medium text-green-900">Obra seleccionada</h3>
              </div>

              <div className="space-y-3 rounded-lg border border-green-200 bg-green-50 p-4">
                <div>
                  <p className="text-lg font-semibold text-gray-900">#{selectedObra.cod_obra}</p>
                  <p className="text-gray-700">{selectedObra.direccion}</p>
                </div>

                <div className="border-t border-green-200 pt-3">
                  <p className="mb-2 text-sm text-gray-600">
                    <strong>Cliente:</strong> {getClienteName(selectedObra.cliente)}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Presupuesto:</p>
                      <p className="font-medium text-gray-900">
                        ${selectedObra.presupuesto?.valor?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Pagado:</p>
                      <p className="font-medium text-green-600">
                        ${selectedObra.totalPagado?.toLocaleString() || '0'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm text-gray-500">Saldo pendiente:</p>
                    <p className="text-xl font-bold text-orange-600">
                      ${selectedObra.saldoPendiente?.toLocaleString() || '0'}
                    </p>
                  </div>

                  <div className="mt-3">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm text-gray-500">Progreso de pagos:</span>
                      <span className="text-sm font-medium">
                        {selectedObra.porcentajePagado?.toFixed(1) || '0'}%
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-gray-200">
                      <div
                        className="h-3 rounded-full bg-green-500 transition-all"
                        style={{
                          width: `${Math.min(selectedObra.porcentajePagado || 0, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <ObraSearchResults
              obras={searchResults}
              loading={searchLoading}
              error={searchError}
              searchTerm={searchTerm}
              onObraSelect={onObraSelect}
            />
          )}
        </div>
      </div>
    </div>
  )
}
