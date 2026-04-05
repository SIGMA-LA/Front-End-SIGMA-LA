import { Pago, Obra } from '@/types'
import { Calendar, Trash2 } from 'lucide-react'
import { deletePago } from '@/actions/pagos'
import { useState } from 'react'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import { notify } from '@/lib/toast'

interface PagoCardProps {
  pago: Pago
  onRefresh?: () => void
  obra?: Obra
  rolActual?: string
}

export default function PagoCard({
  pago,
  onRefresh,
  obra,
  rolActual,
}: PagoCardProps) {
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const puedeEliminar = rolActual?.toUpperCase() === 'VENTAS'

  const handleDelete = async () => {
    setLoading(true)
    try {
      const res = await deletePago(pago.cod_pago)
      if (!res.success) {
        notify.error(res.error || 'Error al eliminar el pago')
        return
      }
      setShowConfirm(false)
      onRefresh?.()
    } catch {
      notify.error('Error al eliminar el pago')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          {obra && (
            <>
              <div className="mb-2">
                <div className="truncate text-base font-semibold text-blue-700">
                  {obra.direccion}
                </div>
                <div className="truncate text-sm text-gray-500">
                  {obra.cliente.razon_social
                    ? obra.cliente.razon_social
                    : obra.cliente.nombre
                      ? `${obra.cliente.nombre} ${obra.cliente.apellido}`
                      : 'No asignado'}
                </div>
              </div>
              <hr className="my-2 border-blue-200 sm:my-3" />
            </>
          )}
          <div className="mb-2 flex items-center gap-4">
            <span className="text-xl font-bold text-gray-900 sm:text-2xl">
              ${pago.monto?.toLocaleString('es-AR')}
            </span>
          </div>
          <div className="mb-1 flex items-center gap-2 text-base text-gray-600">
            <Calendar className="h-5 w-5 text-blue-400" />
            <span>
              {pago.fecha_pago.slice(0, 10).split('-').reverse().join('/')}
            </span>
          </div>
        </div>
        {puedeEliminar && (
          <div className="mt-3 flex gap-2 lg:mt-0">
            <button
              onClick={() => setShowConfirm(true)}
              className="rounded border-1 border-red-700 bg-red-100 p-2 text-red-700 transition hover:bg-red-200"
              title="Eliminar"
              disabled={loading}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
      {puedeEliminar && (
        <ConfirmDeleteModal
          open={showConfirm}
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleDelete}
          loading={loading}
          monto={pago.monto}
          fecha_pago={pago.fecha_pago}
        />
      )}
    </>
  )
}
