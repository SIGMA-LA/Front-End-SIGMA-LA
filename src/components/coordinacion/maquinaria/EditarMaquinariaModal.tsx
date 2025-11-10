'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, Edit, Save } from 'lucide-react'
import { EditarMaquinariaModalProps } from '@/types'
import { updateMaquinaria } from '@/actions/maquinarias'

export default function EditarMaquinariaModal({
  isOpen,
  maquinaria,
  onClose,
  onSuccess,
}: EditarMaquinariaModalProps) {
  const [descripcion, setDescripcion] = useState('')
  const [estado, setEstado] = useState<'DISPONIBLE' | 'NO DISPONIBLE'>(
    'DISPONIBLE'
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Sincronizar con los datos de la maquinaria cuando cambie
  useEffect(() => {
    if (maquinaria) {
      setDescripcion(maquinaria.descripcion)
      setEstado(maquinaria.estado)
      setError('')
    }
  }, [maquinaria])

  if (!isOpen || !maquinaria) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!descripcion.trim()) {
      setError('La descripción es obligatoria')
      return
    }

    // Verificar si hay cambios
    if (
      descripcion.trim() === maquinaria.descripcion &&
      estado === maquinaria.estado
    ) {
      setError('No se han realizado cambios')
      return
    }

    try {
      setLoading(true)
      setError('')

      await updateMaquinaria(maquinaria.cod_maquina, {
        descripcion: descripcion.trim(),
        estado,
      })

      onSuccess()
      onClose()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al actualizar la maquinaria'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setDescripcion(maquinaria?.descripcion || '')
      setEstado(maquinaria?.estado || 'DISPONIBLE')
      setError('')
      onClose()
    }
  }

  const hasChanges =
    maquinaria &&
    (descripcion.trim() !== maquinaria.descripcion ||
      estado !== maquinaria.estado)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Edit className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Editar Maquinaria
              </h2>
              <p className="text-sm text-gray-600">
                Código #{maquinaria.cod_maquina}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Descripción */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                disabled={loading}
                rows={3}
                placeholder="Descripción de la maquinaria..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Estado
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors ${
                    estado === 'DISPONIBLE'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <input
                    type="radio"
                    value="DISPONIBLE"
                    checked={estado === 'DISPONIBLE'}
                    onChange={(e) => setEstado(e.target.value as 'DISPONIBLE')}
                    disabled={loading}
                    className="h-4 w-4 text-green-600"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Disponible
                    </div>
                    <div className="text-xs text-gray-600">Lista para usar</div>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors ${
                    estado === 'NO DISPONIBLE'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <input
                    type="radio"
                    value="NO DISPONIBLE"
                    checked={estado === 'NO DISPONIBLE'}
                    onChange={(e) =>
                      setEstado(e.target.value as 'NO DISPONIBLE')
                    }
                    disabled={loading}
                    className="h-4 w-4 text-red-600"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      No Disponible
                    </div>
                    <div className="text-xs text-gray-600">
                      Fuera de servicio
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Información sobre cambios */}
            {hasChanges && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <p className="text-sm text-blue-700">
                  ⚠️ Hay cambios pendientes por guardar
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!descripcion.trim() || loading || !hasChanges}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
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
