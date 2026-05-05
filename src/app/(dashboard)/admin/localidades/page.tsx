import Link from 'next/link'
import { Plus, MapPin, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getLocalidades } from '@/actions/localidad'

export default async function LocalidadesPage() {
  const localidades = await getLocalidades()

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Localidades
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Gestiona las localidades del sistema
            </p>
          </div>
          <Link href="/admin/localidades/crear">
            <Button className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nueva Localidad
            </Button>
          </Link>
        </div>

        {/* Content */}
        {localidades.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MapPin className="h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No hay localidades
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Comienza creando tu primera localidad.
              </p>
              <Link href="/admin/localidades/crear" className="mt-6">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Localidad
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <LocalidadesTable localidades={localidades} />
        )}
      </div>
    </div>
  )
}

// Client component for table with delete functionality
'use client'

import { useState, useTransition } from 'react'
import { deleteLocalidad } from '@/actions/localidad'
import ConfirmacionEliminarLocalidadModal from '@/components/admin/ConfirmacionEliminarLocalidadModal'
import type { Localidad } from '@/types'

function LocalidadesTable({ localidades: initialLocalidades }: { localidades: Localidad[] }) {
  const [localidades, setLocalidades] = useState(initialLocalidades)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [localidadToDelete, setLocalidadToDelete] = useState<Localidad | null>(null)
  const [isPending, startTransition] = useTransition()
  const [apiError, setApiError] = useState<string | null>(null)

  const handleDeleteClick = (localidad: Localidad) => {
    setLocalidadToDelete(localidad)
    setShowDeleteModal(true)
    setApiError(null)
  }

  const handleConfirmDelete = async () => {
    if (!localidadToDelete) return

    startTransition(async () => {
      const result = await deleteLocalidad(localidadToDelete.cod_localidad)
      if (result.success) {
        setLocalidades(prev => prev.filter(l => l.cod_localidad !== localidadToDelete.cod_localidad))
        setShowDeleteModal(false)
        setLocalidadToDelete(null)
      } else {
        setApiError(result.error || 'Error al eliminar la localidad')
      }
    })
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setLocalidadToDelete(null)
    setApiError(null)
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100 bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Nombre
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Provincia
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {localidades.map((localidad) => (
                <tr key={localidad.cod_localidad} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {localidad.nombre_localidad}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {localidad.provincia?.nombre || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteClick(localidad)}
                      className="text-red-600 hover:text-red-700 transition-colors p-2"
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmacionEliminarLocalidadModal
        isOpen={showDeleteModal}
        isPending={isPending}
        apiError={apiError}
        localidad={localidadToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  )
}