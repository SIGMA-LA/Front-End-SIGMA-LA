'use client'

import { useState, useEffect } from 'react'
import { Wrench, Plus, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react'
import { MaquinariaListProps, Maquinaria } from '@/types'
import maquinariaService from '@/services/maquinaria.service'
import DetalleMaquinaria from './DetalleMaquinaria'
import EditarMaquinaria from './EditarMaquinaria'
import CambiarEstadoModal from './CambiarEstadoModal'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import CrearMaquinaria from './CrearMaquinaria'

export default function MaquinariaList({ onCreateClick }: MaquinariaListProps) {
  const [maquinarias, setMaquinarias] = useState<Maquinaria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados para modales
  const [selectedMaquinaria, setSelectedMaquinaria] =
    useState<Maquinaria | null>(null)
  const [showDetalleModal, setShowDetalleModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showChangeStatusModal, setShowChangeStatusModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchMaquinarias()
  }, [])

  const fetchMaquinarias = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await maquinariaService.getAllMaquinarias()
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

  // Funciones para manejar modales
  const handleVerDetalles = (maquinaria: Maquinaria) => {
    setSelectedMaquinaria(maquinaria)
    setShowDetalleModal(true)
  }

  const handleEditar = (maquinaria: Maquinaria) => {
    setSelectedMaquinaria(maquinaria)
    setShowEditModal(true)
    setShowDetalleModal(false)
  }

  const handleEliminar = (maquinaria: Maquinaria) => {
    setSelectedMaquinaria(maquinaria)
    setShowDeleteModal(true)
    setShowDetalleModal(false)
  }

  const handleCambiarEstado = (maquinaria: Maquinaria) => {
    setSelectedMaquinaria(maquinaria)
    setShowChangeStatusModal(true)
    setShowDetalleModal(false)
  }

  const handleSaveMaquinaria = async (updatedMaquinaria: Maquinaria) => {
    try {
      const result = await maquinariaService.updateMaquinaria(
        updatedMaquinaria.cod_maquina,
        {
          descripcion: updatedMaquinaria.descripcion,
          estado: updatedMaquinaria.estado,
        }
      )

      setMaquinarias((prev) =>
        prev.map((m) => (m.cod_maquina === result.cod_maquina ? result : m))
      )

      setShowEditModal(false)
      setSelectedMaquinaria(null)
    } catch (error) {
      console.error('Error al actualizar maquinaria:', error)
      // Podrías mostrar un toast de error aquí
    }
  }

  const handleDeleteMaquinaria = async () => {
    if (selectedMaquinaria) {
      try {
        await maquinariaService.deleteMaquinaria(selectedMaquinaria.cod_maquina)

        setMaquinarias((prev) =>
          prev.filter((m) => m.cod_maquina !== selectedMaquinaria.cod_maquina)
        )

        setShowDeleteModal(false)
        setSelectedMaquinaria(null)
      } catch (error) {
        console.error('Error al eliminar maquinaria:', error)
        // Podrías mostrar un toast de error aquí
      }
    }
  }

  const handleChangeStatus = async (newStatus: Maquinaria['estado']) => {
    if (selectedMaquinaria) {
      try {
        const updatedMaquinaria =
          await maquinariaService.updateEstadoMaquinaria(
            selectedMaquinaria.cod_maquina,
            newStatus
          )

        setMaquinarias((prev) =>
          prev.map((m) =>
            m.cod_maquina === selectedMaquinaria.cod_maquina
              ? updatedMaquinaria
              : m
          )
        )

        setSelectedMaquinaria(updatedMaquinaria)
        setShowChangeStatusModal(false)
      } catch (error) {
        console.error('Error al cambiar estado:', error)
      }
    }
  }

  const handleCreateMaquinaria = (newMaquinaria: Maquinaria) => {
    setMaquinarias((prev) => [...prev, newMaquinaria])
    setShowCreateModal(false)
  }

  const closeAllModals = () => {
    setShowDetalleModal(false)
    setShowEditModal(false)
    setShowDeleteModal(false)
    setShowChangeStatusModal(false)
    setShowCreateModal(false)
    setSelectedMaquinaria(null)
  }

  const getEstadoIcon = (estado: Maquinaria['estado']) => {
    switch (estado) {
      case 'DISPONIBLE':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'MANTENIMIENTO':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'REPARACION':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case 'FUERA_DE_SERVICIO':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'EN_USO':
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getEstadoColor = (estado: Maquinaria['estado']) => {
    switch (estado) {
      case 'DISPONIBLE':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'MANTENIMIENTO':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'REPARACION':
        return 'bg-orange-50 border-orange-200 text-orange-800'
      case 'FUERA_DE_SERVICIO':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'EN_USO':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getEstadoText = (estado: Maquinaria['estado']) => {
    switch (estado) {
      case 'DISPONIBLE':
        return 'Disponible'
      case 'MANTENIMIENTO':
        return 'Mantenimiento'
      case 'REPARACION':
        return 'Reparación'
      case 'FUERA_DE_SERVICIO':
        return 'Fuera de Servicio'
      case 'EN_USO':
        return 'En Uso'
      default:
        return estado
    }
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
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Maquinaria
                </h1>
                <p className="text-sm text-gray-600">
                  Gestión de equipos y maquinaria de obra
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="text-lg text-gray-600">
                Cargando maquinarias...
              </span>
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
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Maquinaria
                </h1>
                <p className="text-sm text-gray-600">
                  Gestión de equipos y maquinaria de obra
                </p>
              </div>
            </div>
            <button
              onClick={onCreateClick}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              Nueva Máquina
            </button>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-600" />
            <h3 className="mb-2 text-lg font-medium text-red-900">
              Error al cargar maquinarias
            </h3>
            <p className="mb-4 text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
            >
              Intentar nuevamente
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
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Maquinaria
              </h1>
              <p className="text-sm text-gray-600">
                Gestión de equipos y maquinaria de obra
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
              No hay máquinas registradas
            </h3>
            <p className="mb-4 text-gray-600">
              Comienza agregando la primera máquina al sistema
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-700"
            >
              <Plus className="h-5 w-5" />
              Nueva Máquina
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {maquinarias.map((maquinaria) => (
              <div
                key={maquinaria.cod_maquina}
                className={`rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md ${getEstadoColor(maquinaria.estado)}`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500">
                      #{maquinaria.cod_maquina}
                    </span>
                    {getEstadoIcon(maquinaria.estado)}
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${getEstadoColor(maquinaria.estado)}`}
                  >
                    {getEstadoText(maquinaria.estado)}
                  </span>
                </div>

                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  {maquinaria.descripcion}
                </h3>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleVerDetalles(maquinaria)}
                    className="hover:bg-opacity-10 flex-1 rounded-lg border border-current px-3 py-2 text-sm font-medium transition-colors hover:bg-current"
                  >
                    Ver Detalles
                  </button>
                  <button
                    onClick={() => handleEditar(maquinaria)}
                    className="hover:bg-opacity-10 flex-1 rounded-lg border border-current px-3 py-2 text-sm font-medium transition-colors hover:bg-current"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modales */}
        <CrearMaquinaria
          isModal={true}
          isOpen={showCreateModal}
          onCancel={closeAllModals}
          onSubmit={handleCreateMaquinaria}
        />

        {selectedMaquinaria && (
          <>
            <DetalleMaquinaria
              maquinaria={selectedMaquinaria}
              isOpen={showDetalleModal}
              onClose={closeAllModals}
              onEdit={handleEditar}
              onDelete={handleEliminar}
              onChangeStatus={handleCambiarEstado}
            />

            <EditarMaquinaria
              maquinaria={selectedMaquinaria}
              isOpen={showEditModal}
              onClose={closeAllModals}
              onSave={handleSaveMaquinaria}
            />

            <CambiarEstadoModal
              isOpen={showChangeStatusModal}
              maquinaria={selectedMaquinaria}
              onConfirm={handleChangeStatus}
              onCancel={closeAllModals}
            />

            <ConfirmDeleteModal
              isOpen={showDeleteModal}
              maquinaria={selectedMaquinaria}
              onConfirm={handleDeleteMaquinaria}
              onCancel={closeAllModals}
            />
          </>
        )}
      </div>
    </div>
  )
}
