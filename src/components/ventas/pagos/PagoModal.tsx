'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Building2,
  DollarSign,
  Calendar,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type {
  ObraConPresupuesto,
  PagoModalProps,
  PagoModalStep,
} from '@/types'
import {
  createPagoForObra,
  getObrasConPresupuestoAceptado,
} from '@/actions/pagos'
import ObraSelect, { ObraSearchResults } from './ObraSelect'
import { notify } from '@/lib/toast'

export default function PagoModal({
  open,
  onClose,
  onPagoCreado,
  obraPreseleccionada,
  direccionObra,
}: PagoModalProps) {
  const [currentStep, setCurrentStep] = useState<PagoModalStep>('obra')
  const [selectedObra, setSelectedObra] = useState<ObraConPresupuesto | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Estados para la búsqueda de obras
  const [searchTerm, setSearchTerm] = useState(direccionObra ?? '')
  const [searchResults, setSearchResults] = useState<ObraConPresupuesto[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const [monto, setMonto] = useState('')
  const [fechaPago, setFechaPago] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })

  const loadObras = useCallback(async () => {
    try {
      setSearchLoading(true)
      setSearchError(null)
      // Si no hay término de búsqueda, pasar undefined para obtener todas las obras
      const searchParam = searchTerm.trim() || undefined
      const data = await getObrasConPresupuestoAceptado(searchParam)
      setSearchResults(data)
    } catch (err: unknown) {
      setSearchError(
        err instanceof Error ? err.message : 'Error al buscar obras'
      )
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }, [searchTerm])

  // Effect para manejar obra preseleccionada
  useEffect(() => {
    if (open && obraPreseleccionada) {
      setSelectedObra(obraPreseleccionada)
      if (
        obraPreseleccionada.cantidad_pagos === 0 &&
        obraPreseleccionada.presupuesto?.valor
      ) {
        setMonto((obraPreseleccionada.presupuesto.valor * 0.7).toString())
      }
      setCurrentStep('pago') // Ir directamente al paso de pago
    }
  }, [open, obraPreseleccionada])

  // Effect para cargar obras inicialmente cuando se abre el modal
  useEffect(() => {
    if (open && currentStep === 'obra' && !obraPreseleccionada) {
      loadObras()
    }
  }, [open, currentStep, loadObras, obraPreseleccionada])

  // Effect para manejar la búsqueda de obras
  useEffect(() => {
    // Siempre cargar obras, con o sin filtro
    if (currentStep === 'obra') {
      loadObras()
    }
  }, [searchTerm, loadObras, currentStep])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }

  const getClienteName = (
    cliente:
      | { razon_social?: string; nombre?: string; apellido?: string }
      | null
      | undefined
  ) => {
    if (cliente?.razon_social) return cliente.razon_social
    if (cliente?.nombre && cliente?.apellido)
      return `${cliente.nombre} ${cliente.apellido}`
    return 'Cliente no identificado'
  }

  const handleClose = () => {
    // Si hay obra preseleccionada, no resetear el step
    setCurrentStep(obraPreseleccionada ? 'pago' : 'obra')
    setSelectedObra(obraPreseleccionada || null)
    setMonto('')
    setFechaPago(new Date().toISOString().split('T')[0])
    setError(null)
    setSearchTerm('')
    setSearchResults([])
    setSearchLoading(false)
    setSearchError(null)
    onClose()
  }

  const handleStepBack = () => {
    if (currentStep === 'pago') {
      setCurrentStep('obra')
    }
  }

  const handleStepForward = () => {
    if (currentStep === 'obra' && selectedObra) {
      setCurrentStep('pago')
    }
  }

  const handleObraSelect = (obra: ObraConPresupuesto | null) => {
    setSelectedObra(obra)
    if (obra) {
      if (obra.cantidad_pagos === 0 && obra.presupuesto?.valor) {
        setMonto((obra.presupuesto.valor * 0.7).toString())
      } else {
        setMonto('')
      }
      setTimeout(() => setCurrentStep('pago'), 100)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedObra) {
      setError('Debe seleccionar una obra')
      return
    }

    const montoNumerico = parseFloat(monto.replace(/\./g, '').replace(',', '.'))

    if (isNaN(montoNumerico) || montoNumerico <= 0) {
      setError('El monto debe ser un número mayor a 0')
      return
    }

    if (
      selectedObra.saldoPendiente &&
      montoNumerico > selectedObra.saldoPendiente + 0.01
    ) {
      setError(
        `El monto no puede exceder el saldo pendiente de $${selectedObra.saldoPendiente.toLocaleString()}`
      )
      return
    }

    try {
      setLoading(true)
      setError(null)

      const nuevoPago = await createPagoForObra(
        { monto: montoNumerico },
        selectedObra.cod_obra
      )

      notify.success('Pago registrado correctamente.')
      onPagoCreado(nuevoPago)
      handleClose()
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al crear el pago'
      const backendError = (
        err as unknown as { response?: { data?: { message?: string } } }
      )?.response?.data?.message
      const message = backendError || errorMessage
      setError(message)
      notify.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="bg-opacity-75 absolute inset-0 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative mx-4 max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            {currentStep === 'pago' && (
              <button
                onClick={handleStepBack}
                className="rounded-full p-1 hover:bg-gray-100"
                disabled={loading}
              >
                <ChevronLeft className="h-5 w-5 text-gray-500" />
              </button>
            )}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Crear Nuevo Pago
              </h2>
              <p className="text-sm text-gray-500">
                Paso {currentStep === 'obra' ? '1' : '2'} de 2:{' '}
                {currentStep === 'obra' ? 'Seleccionar obra' : 'Datos del pago'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-2 hover:bg-gray-100"
            disabled={loading}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="bg-gray-50 px-6 py-3">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 flex-1 rounded-full ${currentStep === 'obra' ? 'bg-blue-200' : 'bg-blue-600'}`}
            />
            <div
              className={`h-2 flex-1 rounded-full ${currentStep === 'pago' ? 'bg-blue-600' : 'bg-gray-200'}`}
            />
          </div>
        </div>

        <div className="max-h-[calc(90vh-200px)] overflow-y-auto p-6">
          {currentStep === 'obra' && (
            <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Panel de búsqueda */}
              <div className="space-y-4">
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-700">
                    <Building2 className="mr-1 inline h-4 w-4" />
                    Buscar y seleccionar obra
                  </label>
                  <ObraSelect
                    selectedObra={selectedObra}
                    onObraSelect={handleObraSelect}
                    required
                    placeholder="Buscar obra por dirección, cliente..."
                    showResults={false}
                    onSearchChange={handleSearchChange}
                    initialSearchTerm={searchTerm}
                  />
                </div>

                <div className="rounded-lg bg-blue-50 p-3 text-sm text-gray-500">
                  <p className="mb-1 font-medium text-blue-800">
                    💡 Instrucciones:
                  </p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Escribe para buscar obras por dirección o cliente</li>
                    <li>• Los resultados aparecerán en el panel derecho</li>
                    <li>• Solo obras con pagos pendientes</li>
                    <li>• Haz clic en una obra para seleccionarla</li>
                  </ul>
                </div>
              </div>

              {/* Panel de resultados y obra seleccionada */}
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
                        <h3 className="text-lg font-medium text-green-900">
                          Obra seleccionada
                        </h3>
                      </div>

                      <div className="space-y-3 rounded-lg border border-green-200 bg-green-50 p-4">
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            #{selectedObra.cod_obra}
                          </p>
                          <p className="text-gray-700">
                            {selectedObra.direccion}
                          </p>
                        </div>

                        <div className="border-t border-green-200 pt-3">
                          <p className="mb-2 text-sm text-gray-600">
                            <strong>Cliente:</strong>{' '}
                            {getClienteName(selectedObra.cliente)}
                          </p>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Presupuesto:</p>
                              <p className="font-medium text-gray-900">
                                $
                                {selectedObra.presupuesto?.valor?.toLocaleString() ||
                                  '0'}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Pagado:</p>
                              <p className="font-medium text-green-600">
                                $
                                {selectedObra.totalPagado?.toLocaleString() ||
                                  '0'}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3">
                            <p className="text-sm text-gray-500">
                              Saldo pendiente:
                            </p>
                            <p className="text-xl font-bold text-orange-600">
                              $
                              {selectedObra.saldoPendiente?.toLocaleString() ||
                                '0'}
                            </p>
                          </div>

                          <div className="mt-3">
                            <div className="mb-1 flex items-center gap-2">
                              <span className="text-sm text-gray-500">
                                Progreso de pagos:
                              </span>
                              <span className="text-sm font-medium">
                                {selectedObra.porcentajePagado?.toFixed(1) ||
                                  '0'}
                                %
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
                      onObraSelect={handleObraSelect}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 'pago' && selectedObra && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Resumen de la obra */}
              <div className="lg:col-span-1">
                <h3 className="mb-4 flex items-center font-medium text-gray-900">
                  <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                  Obra seleccionada
                </h3>
                <div className="space-y-3 rounded-lg border border-green-200 bg-green-50 p-4">
                  <div>
                    <p className="font-semibold text-gray-900">
                      #{selectedObra.cod_obra}
                    </p>
                    <p className="text-sm text-gray-700">
                      {selectedObra.direccion}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p className="mb-2 text-gray-600">
                      <strong>Cliente:</strong>{' '}
                      {getClienteName(selectedObra.cliente)}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Presupuesto:</span>
                        <span className="font-medium">
                          $
                          {selectedObra.presupuesto?.valor?.toLocaleString() ||
                            '0'}
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
                          $
                          {selectedObra.saldoPendiente?.toLocaleString() || '0'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulario de pago */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="mb-4 flex items-center font-medium text-gray-900">
                    <DollarSign className="mr-2 h-5 w-5 text-blue-500" />
                    Datos del pago
                  </h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Monto del pago
                      </label>
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
                          disabled={
                            loading || selectedObra.cantidad_pagos === 0
                          }
                        />
                      </div>
                      {selectedObra.cantidad_pagos === 0 && (
                        <p className="mt-1 text-sm font-medium text-blue-600">
                          El primer pago debe ser exactamente el 70% del
                          presupuesto.
                        </p>
                      )}
                      {selectedObra.saldoPendiente !== undefined &&
                        parseFloat(monto) > selectedObra.saldoPendiente && (
                          <p className="mt-1 text-sm text-red-600">
                            El monto no puede exceder el saldo pendiente
                          </p>
                        )}
                      {selectedObra.saldoPendiente !== undefined &&
                        selectedObra.cantidad_pagos > 0 && (
                          <div className="mt-2 flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setMonto(
                                  (
                                    selectedObra.saldoPendiente! * 0.7
                                  ).toString()
                                )
                              }
                              className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700 transition-colors hover:bg-blue-200"
                              disabled={loading}
                            >
                              70%
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setMonto(
                                  selectedObra.saldoPendiente!.toString()
                                )
                              }
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
                      onClick={handleStepBack}
                      disabled={loading}
                      className="flex-1"
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Volver
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading || !monto || !fechaPago}
                      className="flex-1"
                    >
                      {loading ? 'Creando...' : 'Crear Pago'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {currentStep === 'obra' && (
            <div className="mt-6 flex gap-3 border-t border-gray-200 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleStepForward}
                disabled={!selectedObra || loading}
                className="flex-1"
              >
                Continuar
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
