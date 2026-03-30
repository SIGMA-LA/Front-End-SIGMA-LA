'use client'

import { X } from 'lucide-react'
import type { EntregaEmpleado } from '@/types'

interface FinalizarEntregaModalProps {
  isOpen: boolean
  observaciones: string
  onObservacionesChange: (value: string) => void
  onConfirm: () => void
  onCancel: () => void
  onCancelDelivery: () => void
  entregaSeleccionada: EntregaEmpleado | null
  loading?: boolean
}

export default function FinalizarEntregaModal({
  isOpen,
  observaciones,
  onObservacionesChange,
  onConfirm,
  onCancel,
  onCancelDelivery,
  entregaSeleccionada,
  loading = false,
}: FinalizarEntregaModalProps) {
  if (!isOpen || !entregaSeleccionada) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="bg-opacity-50 absolute inset-0 bg-transparent backdrop-blur-sm"
        onClick={!loading ? onCancel : undefined}
      />
      <div className="relative w-full max-w-lg rounded-lg bg-white shadow-xl lg:max-w-2xl">
        <div className="flex items-center justify-between border-b p-5 lg:p-7">
          <h2 className="text-lg font-semibold text-gray-900 lg:text-2xl">
            Registrar Resultado de la Entrega
          </h2>
          <button
            onClick={!loading ? onCancel : undefined}
            disabled={loading}
            className="p-1 text-gray-400 transition-colors hover:text-gray-600 disabled:cursor-not-allowed"
          >
            <X className="h-6 w-6 lg:h-7 lg:w-7" />
          </button>
        </div>
        <div className="space-y-6 p-5 lg:p-8">
          <div className="space-y-3 rounded-lg bg-gray-50 p-4 text-sm text-gray-600 lg:text-base">
            <p>
              <strong className="text-gray-800">Entrega:</strong> #
              {entregaSeleccionada.entrega.cod_entrega}
            </p>
            <p>
              <strong className="text-gray-800">Cliente:</strong>{' '}
              {entregaSeleccionada.obra.cliente?.razon_social}
            </p>
          </div>
          <div className="space-y-3">
            <label
              htmlFor="observaciones"
              className="block text-sm font-medium text-gray-700 lg:text-base"
            >
              Observaciones / Motivo de cancelación (opcional)
            </label>
            <textarea
              id="observaciones"
              placeholder="Añade observaciones sobre la entrega o el motivo si no se pudo realizar..."
              value={observaciones}
              onChange={(e) => onObservacionesChange(e.target.value)}
              rows={5}
              disabled={loading}
              className="w-full resize-none rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 lg:px-5 lg:py-4 lg:text-base"
            />
          </div>
        </div>
        <div className="flex flex-col space-y-3 rounded-b-lg border-t bg-gray-50 p-5 sm:flex-row-reverse sm:space-y-0 sm:space-x-4 sm:space-x-reverse lg:p-7">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-md border border-transparent bg-green-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 lg:px-6 lg:py-4 lg:text-base"
          >
            {loading ? 'Procesando...' : 'Entrega Realizada'}
          </button>
          <button
            onClick={onCancelDelivery}
            disabled={loading}
            className="flex-1 rounded-md border border-red-300 bg-red-50 px-5 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 focus:ring-2 focus:ring-red-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 lg:px-6 lg:py-4 lg:text-base"
          >
            {loading ? 'Procesando...' : 'No se Pudo Realizar'}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:hidden"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
