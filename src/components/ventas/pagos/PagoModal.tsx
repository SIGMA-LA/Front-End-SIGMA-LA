'use client'

import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { PagoModalProps } from '@/types'
import usePagoForm from '@/hooks/usePagoForm'
import PagoObraStep from './PagoObraStep'
import PagoDatosStep from './PagoDatosStep'

/**
 * Multi-step modal for creating a new payment (pago) related to a work (obra).
 * Step 1: Select Work (PagoObraStep)
 * Step 2: Enter Payment Details (PagoDatosStep)
 */
export default function PagoModal({
  open,
  onClose,
  onPagoCreado,
  obraPreseleccionada,
  direccionObra,
}: PagoModalProps) {
  const {
    currentStep,
    setCurrentStep,
    selectedObra,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    searchResults,
    searchLoading,
    searchError,
    monto,
    setMonto,
    fechaPago,
    setFechaPago,
    handleClose,
    handleObraSelect,
    handleSubmit,
  } = usePagoForm({ open, onClose, onPagoCreado, obraPreseleccionada, direccionObra })

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="relative mx-4 max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <div className="flex items-center gap-3">
            {currentStep === 'pago' && !obraPreseleccionada && (
              <button
                onClick={() => setCurrentStep('obra')}
                className="rounded-full p-1.5 transition-colors hover:bg-gray-100"
                disabled={loading}
              >
                <ChevronLeft className="h-5 w-5 text-gray-500" />
              </button>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900">Crear Nuevo Pago</h2>
              <p className="text-sm font-medium text-slate-500">
                Paso {currentStep === 'obra' ? '1' : '2'} de 2:{' '}
                {currentStep === 'obra' ? 'Seleccionar obra' : 'Datos del pago'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
            disabled={loading}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-50 px-6 py-3">
          <div className="flex items-center gap-3">
            <div className={`h-2 flex-1 rounded-full transition-all ${currentStep === 'obra' ? 'bg-indigo-200' : 'bg-indigo-600'}`} />
            <div className={`h-2 flex-1 rounded-full transition-all ${currentStep === 'pago' ? 'bg-indigo-600' : 'bg-gray-200'}`} />
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-200px)] overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
          {currentStep === 'obra' ? (
            <PagoObraStep
              selectedObra={selectedObra}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchResults={searchResults}
              searchLoading={searchLoading}
              searchError={searchError}
              onObraSelect={handleObraSelect}
            />
          ) : (
            selectedObra && (
              <PagoDatosStep
                selectedObra={selectedObra}
                monto={monto}
                setMonto={setMonto}
                fechaPago={fechaPago}
                setFechaPago={setFechaPago}
                onStepBack={() => setCurrentStep('obra')}
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
              />
            )
          )}

          {currentStep === 'obra' && (
            <div className="mt-8 flex gap-3 border-t border-gray-100 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 rounded-xl py-6"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={() => setCurrentStep('pago')}
                disabled={!selectedObra || loading}
                className="flex-1 rounded-xl bg-indigo-600 py-6 text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                Continuar
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
