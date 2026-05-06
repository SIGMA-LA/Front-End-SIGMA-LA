'use client'

import { useState, useTransition, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, MapPin, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { deleteLocalidad, getLocalidades } from '@/actions/localidad'
import ConfirmacionEliminarLocalidadModal from '@/components/admin/ConfirmacionEliminarLocalidadModal'
import type { Localidad } from '@/types'

interface LocalidadesPageClientProps {
  localidades: Localidad[]
}

export default function LocalidadesPageClient({ localidades: initialLocalidades }: LocalidadesPageClientProps) {
  const router = useRouter()
  const [localidades, setLocalidades] = useState(initialLocalidades)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [localidadToDelete, setLocalidadToDelete] = useState<Localidad | null>(null)
  const [isPending, startTransition] = useTransition()
  const [apiError, setApiError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term)
      setIsSearching(true)

      startTransition(async () => {
        try {
          const results = await getLocalidades(term)
          setLocalidades(results)
        } catch (error) {
          console.error('Error searching localidades:', error)
        } finally {
          setIsSearching(false)
        }
      })
    },
    [startTransition]
  )

  const handleClearSearch = () => {
    setSearchTerm('')
    setLocalidades(initialLocalidades)
  }

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
        router.refresh()
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

          {/* Search Bar */}
          <div className="mb-6 rounded-2xl border border-gray-100 bg-white px-6 py-4 shadow-xl shadow-gray-200/50">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar localidad por nombre..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-1 h-10 rounded-xl border-gray-200 bg-white text-base transition-all hover:bg-gray-50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          {localidades.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MapPin className="h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {searchTerm ? 'Sin resultados' : 'No hay localidades'}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {searchTerm
                    ? `No se encontraron localidades que coincidan con "${searchTerm}"`
                    : 'Comienza creando tu primera localidad.'}
                </p>
                {searchTerm ? (
                  <button
                    onClick={handleClearSearch}
                    className="mt-6 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Limpiar búsqueda
                  </button>
                ) : (
                  <Link href="/admin/localidades/crear" className="mt-6">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Crear Localidad
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
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
          )}
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