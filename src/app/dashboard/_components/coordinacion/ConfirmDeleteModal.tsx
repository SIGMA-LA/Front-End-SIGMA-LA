'use client'

import { useState } from 'react'
import { Trash2, X, Loader2, AlertTriangle, CheckCircle } from 'lucide-react'
import { ConfirmDeleteModalProps } from '@/types'
import maquinariaService from '@/services/maquinaria.service'

export default function ConfirmDeleteModal({
  isOpen,
  maquinaria,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen || !maquinaria) return null

  const handleConfirm = async () => {
    try {
      setLoading(true)
      setError(null)
      await maquinariaService.deleteMaquinaria(maquinaria.cod_maquina)

      // Mostrar alert rápido y cerrar
      alert('Maquinaria eliminada correctamente!')
      onConfirm()
    } catch (err) {
      console.error('Error al eliminar maquinaria:', err)
      setError(
        'Error al eliminar la maquinaria. Por favor, intenta nuevamente.'
      )
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setError(null)
    onCancel()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Eliminar Maquinaria
              </h2>
              <p className="text-sm text-gray-600">
                Esta acción no se puede deshacer
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Advertencia */}
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
              <div>
                <h3 className="mb-1 font-medium text-red-800">¡Atención!</h3>
                <p className="text-sm text-red-700">
                  Estás a punto de eliminar permanentemente esta maquinaria del
                  sistema.
                </p>
              </div>
            </div>
          </div>

          {/* Información de la maquinaria */}
          <div className="mb-6 space-y-3 rounded-lg bg-gray-50 p-4">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Código:</span>
              <span className="font-mono text-gray-900">
                #{maquinaria.cod_maquina}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Descripción:</span>
              <span className="ml-2 flex-1 text-right text-gray-900">
                {maquinaria.descripcion.length > 50
                  ? `${maquinaria.descripcion.substring(0, 50)}...`
                  : maquinaria.descripcion}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Estado actual:</span>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  maquinaria.estado === 'DISPONIBLE'
                    ? 'bg-green-100 text-green-800'
                    : maquinaria.estado === 'EN_USO'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                }`}
              >
                {maquinaria.estado === 'DISPONIBLE'
                  ? 'Disponible'
                  : maquinaria.estado === 'EN_USO'
                    ? 'En Uso'
                    : maquinaria.estado === 'MANTENIMIENTO'
                      ? 'Mantenimiento'
                      : maquinaria.estado === 'REPARACION'
                        ? 'Reparación'
                        : 'Fuera de Servicio'}
              </span>
            </div>
          </div>

          {/* Consecuencias */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-2 font-medium text-gray-800">
              Consecuencias de eliminar:
            </h4>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
              <li>La maquinaria se eliminará permanentemente del sistema</li>
              <li>No podrá ser asignada a futuras entregas</li>
              <li>Los registros históricos donde aparezca se mantendrán</li>
              <li>Esta acción no se puede deshacer</li>
            </ul>
          </div>

          {maquinaria.estado === 'EN_USO' && (
            <div className="mb-6 rounded-lg border border-orange-200 bg-orange-50 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-600" />
                <div>
                  <h4 className="mb-1 font-medium text-orange-800">
                    Maquinaria en uso
                  </h4>
                  <p className="text-sm text-orange-700">
                    Esta maquinaria está actualmente en uso. Eliminarla puede
                    afectar entregas o obras activas. Considera cambiar su
                    estado antes de eliminarla.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2 border-t border-gray-200 p-4 sm:flex-row sm:justify-end">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Eliminar Definitivamente
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
