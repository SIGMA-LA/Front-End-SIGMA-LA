'use client'

import { useState } from 'react'
import { Settings, X, Loader2, CheckCircle, AlertTriangle } from 'lucide-react'
import { CambiarEstadoModalProps, Maquinaria } from '@/types'
import maquinariaService from '@/services/maquinaria.service'

export default function CambiarEstadoModal({
  isOpen,
  maquinaria,
  onConfirm,
  onCancel,
}: CambiarEstadoModalProps) {
  const [selectedEstado, setSelectedEstado] = useState<
    Maquinaria['estado'] | ''
  >('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen || !maquinaria) return null

  const estadoOptions: {
    value: Maquinaria['estado']
    label: string
    description: string
    icon: React.ReactNode
    color: string
  }[] = [
    {
      value: 'DISPONIBLE',
      label: 'Disponible',
      description: 'Lista para ser asignada a entregas',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      color: 'border-green-200 bg-green-50 hover:bg-green-100',
    },
    {
      value: 'MANTENIMIENTO',
      label: 'En Mantenimiento',
      description: 'No disponible temporalmente por mantenimiento',
      icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
      color: 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100',
    },
    {
      value: 'REPARACION',
      label: 'En Reparación',
      description: 'Requiere reparación antes de usar',
      icon: <AlertTriangle className="h-5 w-5 text-orange-600" />,
      color: 'border-orange-200 bg-orange-50 hover:bg-orange-100',
    },
    {
      value: 'FUERA_DE_SERVICIO',
      label: 'Fuera de Servicio',
      description: 'No operativa indefinidamente',
      icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
      color: 'border-red-200 bg-red-50 hover:bg-red-100',
    },
  ]

  // Solo mostrar estados diferentes al actual (excepto EN_USO que se maneja automáticamente)
  const availableStates = estadoOptions.filter(
    (option) => option.value !== maquinaria.estado && option.value !== 'EN_USO'
  )

  const handleConfirm = async () => {
    if (!selectedEstado) return

    try {
      setLoading(true)
      setError(null)
      await maquinariaService.updateEstadoMaquinaria(
        maquinaria.cod_maquina,
        selectedEstado
      )
      onConfirm(selectedEstado)
    } catch (err) {
      console.error('Error al cambiar estado:', err)
      setError('Error al cambiar el estado. Por favor, intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setSelectedEstado('')
    setError(null)
    onCancel()
  }

  const getCurrentEstadoText = (estado: Maquinaria['estado']) => {
    switch (estado) {
      case 'DISPONIBLE':
        return 'Disponible'
      case 'EN_USO':
        return 'En Uso'
      case 'MANTENIMIENTO':
        return 'En Mantenimiento'
      case 'REPARACION':
        return 'En Reparación'
      case 'FUERA_DE_SERVICIO':
        return 'Fuera de Servicio'
      default:
        return estado
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Cambiar Estado
              </h2>
              <p className="text-sm text-gray-600">
                {maquinaria.descripcion.substring(0, 50)}...
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

          {/* Estado actual */}
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-medium text-gray-700">
              Estado actual:
            </h3>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <span className="font-medium text-gray-900">
                {getCurrentEstadoText(maquinaria.estado)}
              </span>
            </div>
          </div>

          {/* Selección de nuevo estado */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-gray-700">
              Selecciona el nuevo estado:
            </h3>
            <div className="space-y-1">
              {availableStates.map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-start gap-2 rounded-lg border p-2 transition-colors ${
                    selectedEstado === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : option.color
                  } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <input
                    type="radio"
                    name="nuevoEstado"
                    value={option.value}
                    checked={selectedEstado === option.value}
                    onChange={(e) =>
                      setSelectedEstado(e.target.value as Maquinaria['estado'])
                    }
                    disabled={loading}
                    className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {option.icon}
                      <span className="text-sm font-medium text-gray-900">
                        {option.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                      {option.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Información adicional */}
          {maquinaria.estado === 'EN_USO' && (
            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h4 className="mb-1 font-medium text-blue-800">
                Nota importante:
              </h4>
              <p className="text-sm text-blue-700">
                Esta maquinaria está actualmente en uso. Cambiar su estado puede
                afectar las entregas o obras activas donde está asignada.
              </p>
            </div>
          )}

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-1 font-medium text-gray-800">Recordatorio:</h4>
            <p className="text-sm text-gray-600">
              El cambio de estado será inmediato y puede afectar la
              disponibilidad de la maquinaria para nuevas asignaciones.
            </p>
          </div>
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
            disabled={!selectedEstado || loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Cambiando...
              </>
            ) : (
              'Confirmar Cambio'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
