'use client'

import { useState } from 'react'
import { CheckCircle, X, Loader2 } from 'lucide-react'
import { CrearMaquinariaProps, Maquinaria } from '@/types'
import maquinariaService from '@/services/maquinaria.service'

export default function CrearMaquinaria({
  onCancel,
  onSubmit,
  isModal = false,
  isOpen = true,
}: CrearMaquinariaProps) {
  const [descripcion, setDescripcion] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ descripcion?: string }>({})

  const validateForm = () => {
    const newErrors: { descripcion?: string } = {}

    if (!descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria'
    } else if (descripcion.trim().length < 3) {
      newErrors.descripcion = 'La descripción debe tener al menos 3 caracteres'
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
      const maquinaData = {
        descripcion: descripcion.trim(),
      }

      const newMaquinaria =
        await maquinariaService.createMaquinaria(maquinaData)

      // Directamente llamar onSubmit sin modal de confirmación
      onSubmit(newMaquinaria)
    } catch (error) {
      console.error('Error al crear maquinaria:', error)
      setErrors({
        descripcion:
          'Error al crear la maquinaria. Por favor, intenta nuevamente.',
      })
    } finally {
      setLoading(false)
    }
  }

  if (isModal && !isOpen) return null

  const content = (
    <div
      className={
        isModal
          ? 'max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl'
          : 'p-4 sm:p-6 lg:p-8'
      }
    >
      <div className={isModal ? '' : 'mx-auto max-w-2xl'}>
        <div
          className={
            isModal
              ? ''
              : 'rounded-xl border border-gray-200 bg-white p-6 shadow-sm'
          }
        >
          {isModal && (
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Registrar Nueva Máquina
                </h1>
                <p className="text-sm text-gray-600">
                  El sistema generará automáticamente el código y estado
                </p>
              </div>
              <button
                onClick={onCancel}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          {!isModal && (
            <div className="mb-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Registrar Nueva Máquina
                    </h1>
                    <p className="text-sm text-gray-600">
                      El sistema generará automáticamente el código y estado
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Ej: Cortadora de perfiles de aluminio Modelo XYZ-2000, con capacidad para perfiles de hasta 150mm de ancho..."
                className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:ring-2 focus:outline-none ${
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

            {/* Información adicional */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="mb-2 font-medium text-blue-800">
                    Información importante:
                  </h4>
                  <ul className="list-inside list-disc space-y-1 text-sm text-blue-700">
                    <li>El código de máquina se genera automáticamente</li>
                    <li>La máquina se registrará con estado "Habilitada"</li>
                    <li>
                      Podrá ser asignada inmediatamente a entregas de obras
                    </li>
                    <li>
                      El estado puede modificarse posteriormente si requiere
                      mantenimiento
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!descripcion.trim() || loading}
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  'Registrar Máquina'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {isModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          {content}
        </div>
      ) : (
        content
      )}
    </>
  )
}
