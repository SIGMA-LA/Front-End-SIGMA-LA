'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Wrench, Loader2, AlertCircle } from 'lucide-react'
import { ESTADOS_MAQUINARIA } from '@/constants'
import { createMaquinaria, updateMaquinaria } from '@/actions/maquinarias'
import type { Maquinaria } from '@/types'
import { notify } from '@/lib/toast'

interface MaquinariaFormProps {
  maquinariaToEdit?: Maquinaria
}

export default function MaquinariaForm({
  maquinariaToEdit,
}: MaquinariaFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const isEditing = !!maquinariaToEdit

  const [formData, setFormData] = useState({
    descripcion: maquinariaToEdit?.descripcion || '',
    estado: maquinariaToEdit?.estado || ESTADOS_MAQUINARIA[0],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.descripcion.trim()) {
      setError('La descripción es obligatoria')
      return
    }

    startTransition(async () => {
      try {
        if (isEditing) {
          await updateMaquinaria(maquinariaToEdit.cod_maquina, {
            descripcion: formData.descripcion.trim(),
            estado: formData.estado,
          })
        } else {
          await createMaquinaria({
            descripcion: formData.descripcion.trim(),
            estado: formData.estado,
          })
        }
        notify.success(
          isEditing
            ? 'Maquinaria actualizada correctamente.'
            : 'Maquinaria creada correctamente.'
        )
        router.push('/coordinacion/maquinarias')
        router.refresh()
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error desconocido'
        setError(message)
        notify.error(message)
      }
    })
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
            <Wrench className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Editar Maquinaria' : 'Nueva Maquinaria'}
            </h1>
            {isEditing && (
              <p className="text-sm text-gray-600">
                Código #{maquinariaToEdit.cod_maquina}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    descripcion: e.target.value,
                  }))
                }
                rows={4}
                placeholder="Ej: Excavadora hidráulica modelo X200..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Estado
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                    formData.estado === ESTADOS_MAQUINARIA[0]
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    value={ESTADOS_MAQUINARIA[0]}
                    checked={formData.estado === ESTADOS_MAQUINARIA[0]}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        estado: ESTADOS_MAQUINARIA[0],
                      }))
                    }
                    className="h-4 w-4 text-green-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Disponible</div>
                    <div className="text-sm text-gray-600">Lista para usar</div>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                    formData.estado === ESTADOS_MAQUINARIA[1]
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    value={ESTADOS_MAQUINARIA[1]}
                    checked={formData.estado === ESTADOS_MAQUINARIA[1]}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        estado: ESTADOS_MAQUINARIA[1],
                      }))
                    }
                    className="h-4 w-4 text-red-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      No Disponible
                    </div>
                    <div className="text-sm text-gray-600">
                      Fuera de servicio
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex gap-3 border-t pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isPending}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending || !formData.descripcion.trim()}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {isEditing ? 'Guardando...' : 'Creando...'}
                  </>
                ) : (
                  <>{isEditing ? 'Guardar Cambios' : 'Crear Maquinaria'}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
