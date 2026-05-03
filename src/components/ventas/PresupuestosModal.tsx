'use client'

import { X, FileText } from 'lucide-react'
import type { Presupuesto } from '@/types'

interface PresupuestosModalProps {
  isOpen: boolean
  onClose: () => void
  presupuestos: Presupuesto[]
}

/**
 * Modal window to view all budgets (presupuestos) for a work.
 */
export default function PresupuestosModal({
  isOpen,
  onClose,
  presupuestos,
}: PresupuestosModalProps) {
  if (!isOpen) return null

  const handleClose = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4 lg:p-6">
      <div
        className="bg-opacity-50 absolute inset-0 bg-transparent backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-5 lg:p-7">
          <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl">
            Presupuestos
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <X className="h-6 w-6 lg:h-7 lg:w-7" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 lg:p-7">
          {presupuestos && presupuestos.length > 0 ? (
            <div className="space-y-4">
              {presupuestos.map((presupuesto) => (
                <div
                  key={presupuesto.nro_presupuesto}
                  className="flex items-start justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Presupuesto Nº {presupuesto.nro_presupuesto}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        Emitido:{' '}
                        {new Date(presupuesto.fecha_emision).toLocaleDateString(
                          'es-AR'
                        )}
                      </p>
                      {presupuesto.fecha_aceptacion && (
                        <p className="text-sm text-green-600">
                          Aceptado:{' '}
                          {new Date(
                            presupuesto.fecha_aceptacion
                          ).toLocaleDateString('es-AR')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      ${presupuesto.valor.toLocaleString('es-AR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
              <div className="rounded-full bg-gray-100 p-4 text-gray-300">
                <FileText className="h-10 w-10" />
              </div>
              <p className="font-medium text-gray-500">
                No hay presupuestos disponibles para esta obra
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
