'use client'

import { Play, X, AlertCircle } from 'lucide-react'
import type { OrdenProduccion } from '@/types'

interface IniciarProduccionModalProps {
  isOpen: boolean
  orden: OrdenProduccion | null
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export default function IniciarProduccionModal({
  isOpen,
  orden,
  onConfirm,
  onCancel,
  loading = false,
}: IniciarProduccionModalProps) {
  if (!isOpen || !orden) return null

  const handleConfirm = () => {
    if (!loading) {
      onConfirm()
    }
  }

  const handleCancel = () => {
    if (!loading) {
      onCancel()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <Play className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Iniciar Producción
            </h3>
          </div>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">
                ¿Está seguro que desea iniciar la producción de esta orden?
              </p>
              <p className="mt-1 text-sm text-green-700">
                Esta acción cambiará el estado de la orden a "EN PRODUCCIÓN" y
                actualizará el estado de la obra asociada.
              </p>
            </div>
          </div>

          {/* Información de la orden */}
          <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div>
              <p className="text-xs font-medium text-gray-500">
                Orden de Producción
              </p>
              <p className="text-lg font-semibold text-gray-900">
                #{orden.cod_op}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">Cliente</p>
              <p className="text-sm text-gray-900">
                {orden.obra?.cliente?.tipo_cliente === 'EMPRESA'
                  ? orden.obra.cliente.razon_social
                  : `${orden.obra?.cliente?.nombre || ''} ${orden.obra?.cliente?.apellido || ''}`.trim() ||
                    'N/A'}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">Obra</p>
              <p className="text-sm text-gray-900">
                #{orden.cod_obra} - {orden.obra?.direccion || 'Sin dirección'}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">Estado Actual</p>
              <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                {orden.estado}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-gray-200 bg-gray-50 p-4">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Iniciando...
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                Iniciar Producción
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}