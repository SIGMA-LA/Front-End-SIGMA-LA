import { useState, useEffect } from 'react'
import {
  X,
  User,
  Mail,
  Phone,
  Building2,
  Loader2,
  AlertCircle,
  Edit2,
  Trash2,
  ArrowLeft,
} from 'lucide-react'
import clienteService from '@/services/cliente.service'
import type { Cliente } from '@/types'
import EditarCliente from '../ventas/EditarCliente'
import { useAuth } from '@/context/AuthContext'

interface VerDetallesClienteProps {
  cuil: string
  onClose: () => void
  onEdit?: (cliente: Cliente) => void
  onDelete?: (cuil: string) => void
}

export default function VerDetallesCliente({
  cuil,
  onClose,
  onEdit,
  onDelete,
}: VerDetallesClienteProps) {
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const { usuario } = useAuth()
  const canEdit = usuario?.rol_actual === 'VENTAS' && onEdit
  const canDelete = usuario?.rol_actual === 'VENTAS' && onDelete

  useEffect(() => {
    loadCliente()
  }, [cuil])

  const loadCliente = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await clienteService.getClienteByCuil(cuil)
      setCliente(data)
    } catch (err: any) {
      console.error('Error al cargar cliente:', err)
      setError(
        err.response?.data?.message ||
          'Error al cargar los detalles del cliente'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!cliente) return

    try {
      setDeleting(true)
      await clienteService.deleteCliente(cliente.cuil)
      if (onDelete) {
        onDelete(cliente.cuil)
      }
      onClose()
    } catch (err: any) {
      console.error('Error al eliminar cliente:', err)
      alert(err.response?.data?.message || 'Error al eliminar el cliente')
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleEditSuccess = (clienteActualizado: Cliente) => {
    setCliente(clienteActualizado)
    if (onEdit) {
      onEdit(clienteActualizado)
    }
  }

  const handleEditClick = () => {
    if (cliente) {
      setShowEditModal(true)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-xl">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="mt-4 text-gray-600">
              Cargando detalles del cliente...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !cliente) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-gray-900">Error</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">
                  Error al cargar detalles
                </h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button
                  onClick={loadCliente}
                  className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Detalles del Cliente
              </h2>
              <p className="text-sm text-gray-600">Información completa</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            {canEdit && (
              <button
                onClick={handleEditClick}
                className="flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2 font-medium text-blue-600 hover:bg-blue-50"
              >
                <Edit2 className="h-4 w-4" />
                Editar
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 rounded-lg border border-red-600 px-4 py-2 font-medium text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Información Principal */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Building2 className="h-5 w-5 text-blue-600" />
              Información General
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  {cliente.tipo_cliente === 'EMPRESA'
                    ? 'Razón Social'
                    : 'Nombre y Apellido'}
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {cliente.tipo_cliente === 'EMPRESA'
                    ? cliente.razon_social
                    : `${cliente.nombre} ${cliente.apellido}`}
                </p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  CUIL
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {cliente.cuil}
                </p>
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Contacto
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <p className="text-base break-all text-gray-900">
                    {cliente.mail}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Teléfono
                  </label>
                  <p className="text-base text-gray-900">{cliente.telefono}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Obras del Cliente - Placeholder */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Obras Asociadas
            </h3>
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-12">
              <div className="text-center">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-3 text-sm font-medium text-gray-900">
                  Funcionalidad en desarrollo
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  Las obras del cliente se mostrarán aquí próximamente
                </p>
              </div>
            </div>
          </div>

          {/* Botones móviles */}
          <div className="flex gap-2 lg:hidden">
            {onEdit && (
              <button
                onClick={handleEditClick}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-600 px-4 py-2 font-medium text-blue-600 hover:bg-blue-50"
              >
                <Edit2 className="h-4 w-4" />
                Editar
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-600 px-4 py-2 font-medium text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar
              </button>
            )}
          </div>
        </div>

        {/* Modal de confirmación de eliminación */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    ¿Eliminar cliente?
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Esta acción no se puede deshacer. El cliente{' '}
                    <span className="font-semibold">
                      {cliente.razon_social}
                    </span>{' '}
                    será eliminado permanentemente.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de edición */}
      {showEditModal && cliente && (
        <EditarCliente
          cliente={cliente}
          onCancel={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  )
}
