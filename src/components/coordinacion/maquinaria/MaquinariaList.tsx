'use client'

import { useState, useEffect } from 'react'
import { Wrench, Plus, Loader2, AlertTriangle } from 'lucide-react'
import { Maquinaria } from '@/types'
import { getMaquinarias, deleteMaquinaria } from '@/actions/maquinarias'
import MaquinariaCard from './MaquinariaCard'
import CrearMaquinariaModal from './CrearMaquinariaModal'
import VerDetallesMaquinariaModal from './VerDetallesMaquinariaModal'
import EditarMaquinariaModal from './EditarMaquinariaModal'
import ConfirmDeleteMaquinariaModal from './ConfirmDeleteMaquinariaModal'

export default function MaquinariaList() {
  const [maquinarias, setMaquinarias] = useState<Maquinaria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados para modales
  const [selectedMaquinaria, setSelectedMaquinaria] =
    useState<Maquinaria | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchMaquinarias()
  }, [])

  const fetchMaquinarias = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getMaquinarias()
      setMaquinarias(data)
    } catch (err) {
      console.error('Error al cargar maquinarias:', err)
      setError(
        'Error al cargar las maquinarias. Por favor, intenta nuevamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (maquinaria: Maquinaria) => {
    setSelectedMaquinaria(maquinaria)
    setShowDetailsModal(true)
  }

  const handleEdit = (maquinaria: Maquinaria) => {
    setSelectedMaquinaria(maquinaria)
    setShowEditModal(true)
  }

  const handleDelete = (maquinaria: Maquinaria) => {
    setSelectedMaquinaria(maquinaria)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedMaquinaria) return

    try {
      setIsDeleting(true)
      await deleteMaquinaria(selectedMaquinaria.cod_maquina)
      setShowDeleteModal(false)
      handleSuccess()
    } catch (error) {
      console.error('Error al eliminar maquinaria:', error)
      alert('Error al eliminar la maquinaria. Por favor, intenta nuevamente.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCloseModals = () => {
    setSelectedMaquinaria(null)
    setShowCreateModal(false)
    setShowDetailsModal(false)
    setShowEditModal(false)
    setShowDeleteModal(false)
  }

  const handleSuccess = () => {
    fetchMaquinarias()
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Wrench className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Gestión de Maquinarias
                </h1>
                <p className="text-sm text-gray-600">
                  Administra y controla el inventario de maquinarias
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
              <p className="mt-2 text-sm text-gray-600">
                Cargando maquinarias...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Wrench className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Gestión de Maquinarias
                </h1>
                <p className="text-sm text-gray-600">
                  Administra y controla el inventario de maquinarias
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              Nueva Máquina
            </button>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-600" />
            <h3 className="mb-2 text-lg font-medium text-red-800">
              Error al cargar maquinarias
            </h3>
            <p className="mb-4 text-red-700">{error}</p>
            <button
              onClick={fetchMaquinarias}
              className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Wrench className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestión de Maquinarias
              </h1>
              <p className="text-sm text-gray-600">
                Administra y controla el inventario de maquinarias
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Nueva Máquina
          </button>
        </div>

        {maquinarias.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <Wrench className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No hay maquinarias registradas
            </h3>
            <p className="mb-4 text-gray-600">
              Comienza agregando la primera maquinaria a tu inventario
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Agregar Primera Máquina
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {maquinarias.map((maquinaria) => (
              <MaquinariaCard
                key={maquinaria.cod_maquina}
                maquinaria={maquinaria}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <CrearMaquinariaModal
          isOpen={showCreateModal}
          onClose={handleCloseModals}
          onSuccess={handleSuccess}
        />

        <VerDetallesMaquinariaModal
          isOpen={showDetailsModal}
          maquinaria={selectedMaquinaria}
          onClose={handleCloseModals}
        />

        <EditarMaquinariaModal
          isOpen={showEditModal}
          maquinaria={selectedMaquinaria}
          onClose={handleCloseModals}
          onSuccess={handleSuccess}
        />

        <ConfirmDeleteMaquinariaModal
          isOpen={showDeleteModal}
          onClose={handleCloseModals}
          onConfirm={handleConfirmDelete}
          maquinariaNombre={selectedMaquinaria?.descripcion || ''}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  )
}
