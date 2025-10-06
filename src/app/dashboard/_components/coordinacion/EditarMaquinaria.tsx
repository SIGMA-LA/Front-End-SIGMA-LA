'use client'

import { useState } from 'react'
import { Edit, X, Loader2, Save } from 'lucide-react'
import { EditarMaquinariaProps, Maquinaria } from '@/types'
import maquinariaService from '@/services/maquinaria.service'

export default function EditarMaquinaria({
  maquinaria,
  isOpen,
  onClose,
  onSave,
}: EditarMaquinariaProps) {
  const [descripcion, setDescripcion] = useState(maquinaria.descripcion)
  const [estado, setEstado] = useState(maquinaria.estado)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{
    descripcion?: string
    estado?: string
    general?: string
  }>({})

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors: { descripcion?: string; estado?: string } = {}

    if (!descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria'
    } else if (descripcion.trim().length < 3) {
      newErrors.descripcion = 'La descripción debe tener al menos 3 caracteres'
    }

    if (!estado) {
      newErrors.estado = 'Debe seleccionar un estado'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      setErrors({})

      const updateData = {
        descripcion: descripcion.trim(),
        estado: estado,
      }

      const updatedMaquinaria = await maquinariaService.updateMaquinaria(
        maquinaria.cod_maquina,
        updateData
      )

      onSave(updatedMaquinaria)
    } catch (error) {
      console.error('Error al actualizar maquinaria:', error)
      setErrors({
        general:
          'Error al actualizar la maquinaria. Por favor, intenta nuevamente.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setDescripcion(maquinaria.descripcion)
    setEstado(maquinaria.estado)
    setErrors({})
    onClose()
  }

  const estadoOptions: {
    value: Maquinaria['estado']
    label: string
    description: string
  }[] = [
    {
      value: 'DISPONIBLE',
      label: 'Disponible',
      description: 'Lista para ser asignada a entregas',
    },
    {
      value: 'EN_USO',
      label: 'En Uso',
      description: 'Actualmente asignada a una obra',
    },
    {
      value: 'MANTENIMIENTO',
      label: 'En Mantenimiento',
      description: 'No disponible temporalmente por mantenimiento',
    },
    {
      value: 'REPARACION',
      label: 'En Reparación',
      description: 'Requiere reparación antes de usar',
    },
    {
      value: 'FUERA_DE_SERVICIO',
      label: 'Fuera de Servicio',
      description: 'No operativa indefinidamente',
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Edit className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Editar Maquinaria
              </h2>
              <p className="text-sm text-gray-600">
                Código: #{maquinaria.cod_maquina}
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
        <form onSubmit={handleSubmit} className="p-4">
          {errors.general && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Descripción */}
            <div>
              <label
                htmlFor="descripcion"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Descripción de la Máquina{' '}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="descripcion"
                rows={4}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                disabled={loading}
                placeholder="Descripción detallada de la maquinaria..."
                className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:ring-2 focus:outline-none disabled:bg-gray-50 disabled:opacity-50 ${
                  errors.descripcion
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.descripcion && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.descripcion}
                </p>
              )}
            </div>

            {/* Estado */}
            <div>
              <label
                htmlFor="estado"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Estado <span className="text-red-500">*</span>
              </label>
              <div className="space-y-1">
                {estadoOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-start gap-2 rounded-lg border p-2 transition-colors ${
                      estado === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <input
                      type="radio"
                      name="estado"
                      value={option.value}
                      checked={estado === option.value}
                      onChange={(e) =>
                        setEstado(e.target.value as Maquinaria['estado'])
                      }
                      disabled={loading}
                      className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-600">
                        {option.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Información importante */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h4 className="mb-2 font-medium text-blue-800">Importante:</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-blue-700">
                <li>Los cambios se aplicarán inmediatamente</li>
                <li>
                  Si cambias el estado a "En Uso", asegúrate de que esté
                  realmente asignada
                </li>
                <li>
                  El estado "Fuera de Servicio" impide su asignación a nuevas
                  obras
                </li>
              </ul>
            </div>
          </div>

          {/* Footer con acciones */}
          <div className="flex flex-col gap-2 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !descripcion.trim()}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
