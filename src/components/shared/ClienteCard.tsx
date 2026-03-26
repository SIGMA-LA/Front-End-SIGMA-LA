'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { User, Building2, Eye, Edit, Trash2, IdCard } from 'lucide-react'
import type { Cliente, Empleado } from '@/types'
import VerDetallesCliente from './VerDetallesCliente'
import { deleteCliente } from '@/actions/clientes'
import ConfirmDeleteModal from '../ventas/ConfirmDeleteModal'

interface ClienteCardProps {
  cliente: Cliente
  showActions?: boolean
  usuario: Empleado | null
}

export default function ClienteCard({
  cliente,
  showActions = true,
  usuario,
}: ClienteCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showDetail, setShowDetail] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const esEmpresa = cliente.tipo_cliente === 'EMPRESA'
  const nombreCompleto = esEmpresa
    ? cliente.razon_social
    : `${cliente.nombre ?? ''} ${cliente.apellido ?? ''}`.trim()
  const tipoLabel = esEmpresa ? 'Empresa' : 'Particular'
  const tipoBadgeClasses = esEmpresa
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : 'border-amber-200 bg-amber-50 text-amber-700'

  // Solo mostrar botones de editar/eliminar si es VENTAS
  const puedeEditarEliminar = usuario?.rol_actual === 'VENTAS'

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteCliente(cliente.cuil)
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
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-200 hover:shadow-md sm:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-blue-100 p-2.5 text-blue-700">
                {esEmpresa ? (
                  <Building2 className="h-5 w-5" />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-base font-semibold text-gray-900 sm:text-lg">
                    {nombreCompleto}
                  </h3>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${tipoBadgeClasses}`}
                  >
                    {tipoLabel}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                  <IdCard className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">CUIL:</span>
                  <span className="truncate font-semibold text-gray-900">
                    {cliente.cuil}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {showActions && (
            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              <button
                onClick={() => setShowDetail(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <Eye className="h-4 w-4" />
                Ver detalles
              </button>
              {puedeEditarEliminar && (
                <>
                  <button
                    onClick={() =>
                      router.push(`/ventas/clientes/${cliente.cuil}/editar`)
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-yellow-300 bg-yellow-50 px-3.5 py-2 text-sm font-medium text-yellow-700 transition-colors hover:bg-yellow-100"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    disabled={isPending}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-3.5 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
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
