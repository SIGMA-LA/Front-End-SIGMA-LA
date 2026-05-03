'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Edit, Trash2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import type { Empleado } from '@/types'
import EmpleadoDetailsModal from './EmpleadoDetailsModal'
import { deleteEmpleado } from '@/actions/empleado'
import { getRolDisplayName } from '@/lib/empleado-utils'
import Link from 'next/link'
import { notify } from '@/lib/toast'

interface EmpleadoCardProps {
  empleado: Empleado
}

export default function EmpleadoCard({ empleado }: EmpleadoCardProps) {
  const router = useRouter()
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
    setDeleteError(null)
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    setDeleteError(null)

    try {
      const result = await deleteEmpleado(empleado.cuil)

      if (!result.success) {
        throw new Error(result.error || 'Error al eliminar empleado')
      }

      setShowDeleteModal(false)
      notify.success('Empleado dado de baja exitosamente')
      router.refresh()
    } catch (error) {
      console.error('Error al borrar empleado:', error)
      setDeleteError(
        error instanceof Error
          ? error.message
          : 'Hubo un error al eliminar el empleado.'
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-sm font-bold text-blue-700">
                {empleado.nombre[0]}
                {empleado.apellido[0]}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {empleado.nombre} {empleado.apellido}
                </h4>
                <p className="text-xs text-gray-500">
                  {getRolDisplayName(empleado.rol_actual)}
                </p>
              </div>
            </div>
            <div className="flex">
              <Button
                onClick={() => setShowDetailsModal(true)}
                variant="ghost"
                size="icon"
                title="Ver detalles"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Link href={`/admin/empleados/${empleado.cuil}/editar`}>
                <Button variant="ghost" size="icon" title="Editar">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                onClick={handleDeleteClick}
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-700"
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showDetailsModal && (
        <EmpleadoDetailsModal
          empleado={empleado}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {/* Modal de Eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div
            className="animate-in fade-in zoom-in w-full max-w-md duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
              {/* Header */}
              <div className="bg-gradient-to-br from-red-500 to-red-600 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Eliminar Empleado
                    </h3>
                    <p className="mt-0.5 text-sm text-red-100">
                      Esta acción no se puede deshacer
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Información del empleado */}
                <div className="mb-4 rounded-lg border-2 border-red-100 bg-red-50 p-4">
                  <p className="text-sm font-medium text-gray-900">
                    Está a punto de eliminar al empleado:
                  </p>
                  <p className="mt-2 text-base font-bold text-gray-900">
                    {empleado.nombre} {empleado.apellido}
                  </p>
                  <p className="mt-1 font-mono text-sm text-gray-600">
                    CUIL: {empleado.cuil}
                  </p>
                </div>

                {/* Advertencia */}
                <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                  <div className="text-sm text-amber-900">
                    <p className="font-semibold">
                      Esta acción desactivará la cuenta del empleado.
                    </p>
                    <p className="mt-1">
                      El empleado no podrá acceder al sistema y será removido de
                      todas las asignaciones activas.
                    </p>
                  </div>
                </div>

                {/* Error */}
                {deleteError && (
                  <div className="mt-4 flex items-start gap-3 rounded-lg bg-red-50 p-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                    <div>
                      <h4 className="text-sm font-semibold text-red-900">
                        Error al eliminar
                      </h4>
                      <p className="mt-1 text-sm text-red-700">{deleteError}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
                <Button
                  onClick={() => setShowDeleteModal(false)}
                  variant="outline"
                  className="flex-1 border-gray-300 font-medium hover:bg-gray-100"
                  disabled={isDeleting}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 font-semibold shadow-md hover:from-red-700 hover:to-red-800"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Eliminando...
                    </span>
                  ) : (
                    'Eliminar Empleado'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
