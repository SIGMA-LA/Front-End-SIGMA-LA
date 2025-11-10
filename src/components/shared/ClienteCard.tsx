'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Phone, User, Building2, Eye, Edit, Trash2 } from 'lucide-react'
import type { Cliente } from '@/types'
import VerDetallesCliente from './VerDetallesCliente'
import { eliminarCliente } from '@/actions/clientes'
import ConfirmDeleteModal from '../ventas/ConfirmDeleteModal'
import { useAuth } from '@/context/AuthContext'

interface ClienteCardProps {
  cliente: Cliente
  showActions?: boolean
}

export default function ClienteCard({
  cliente,
  showActions = true,
}: ClienteCardProps) {
  const router = useRouter()
  const { usuario } = useAuth()
  const [isPending, startTransition] = useTransition()
  const [showDetail, setShowDetail] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const esEmpresa = cliente.tipo_cliente === 'EMPRESA'
  const nombreCompleto = esEmpresa
    ? cliente.razon_social
    : `${cliente.nombre ?? ''} ${cliente.apellido ?? ''}`.trim()

  // Solo mostrar botones de editar/eliminar si es VENTAS
  const puedeEditarEliminar = usuario?.rol_actual === 'VENTAS'

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await eliminarCliente(cliente.cuil)
        if (result.success) {
          setShowDeleteModal(false)
          router.refresh()
        } else {
          alert(result.error || 'Error al eliminar cliente')
        }
      } catch (error) {
        console.error('Error al eliminar:', error)
        alert('Error al eliminar el cliente')
      }
    })
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
        {/* Header */}
        <div className="flex items-center gap-3 border-b bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-3">
          {esEmpresa ? (
            <Building2 className="h-5 w-5 text-blue-600" />
          ) : (
            <User className="h-5 w-5 text-blue-600" />
          )}
          <h3 className="font-semibold text-gray-900">{nombreCompleto}</h3>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="mb-4 space-y-3">
            {/* CUIL */}
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">CUIL</p>
                <p className="font-semibold text-gray-900">{cliente.cuil}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-500">Email</p>
                <p className="truncate font-medium text-gray-900">
                  {cliente.mail}
                </p>
              </div>
            </div>

            {/* Teléfono */}
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Phone className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Teléfono</p>
                <p className="font-semibold text-gray-900">
                  {cliente.telefono}
                </p>
              </div>
            </div>
          </div>

          {/* Botones */}
          {showActions && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowDetail(true)}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <Eye className="h-4 w-4" />
                Ver Detalles
              </button>
              {puedeEditarEliminar && (
                <>
                  <button
                    onClick={() =>
                      router.push(`/ventas/clientes/${cliente.cuil}/editar`)
                    }
                    className="flex items-center gap-2 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-700 transition-colors hover:bg-yellow-100"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    disabled={isPending}
                    className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isPending ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalles */}
      {showDetail && (
        <VerDetallesCliente
          cuil={cliente.cuil}
          onClose={() => setShowDetail(false)}
        />
      )}

      {/* Modal de confirmación */}
      {showDeleteModal && (
        <ConfirmDeleteModal
          open={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          loading={isPending}
          title="Eliminar Cliente"
          message={`¿Está seguro que desea eliminar al cliente "${nombreCompleto}"?`}
        />
      )}
    </>
  )
}
