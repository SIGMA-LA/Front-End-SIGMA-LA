import { Pago, Obra } from '@/types'
import { Calendar, Trash2, Pencil } from 'lucide-react'
import { deletePago } from '@/actions/pagos'
import { useState } from 'react'
import ConfirmDeleteModal from './ConfirmDeleteModal'

interface PagoCardProps {
  pago: Pago
  onRefresh: () => void
  onEdit: () => void
  obra?: Obra
}

export default function PagoCard({
  pago,
  onRefresh,
  onEdit,
  obra,
}: PagoCardProps) {
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deletePago(pago.cod_pago)
      setShowConfirm(false)
      onRefresh()
    } catch (err) {
      alert('Error al eliminar el pago')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 rounded-xl border border-blue-200 bg-blue-50 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          {/* Si hay obra, mostrar info de la obra alineada a la izquierda */}
          {obra && (
            <>
              <div className="mb-2">
                <div className="text-base font-semibold text-blue-700">
                  {obra.direccion}
                </div>
                <div className="text-sm text-gray-500">
                  Cliente: {obra.cliente?.razon_social || 'Sin cliente'}
                </div>
              </div>
              <hr className="my-3 border-blue-200" />
            </>
          )}
          <div className="mb-2 flex items-center gap-4">
            <span className="text-2xl font-bold text-gray-900">
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
        <div className="mt-4 flex gap-2 lg:mt-0">
          <button
            onClick={onEdit}
            className="rounded border-1 border-yellow-700 bg-yellow-100 p-2 text-yellow-700 transition hover:bg-yellow-200"
            title="Editar"
            disabled={loading}
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="rounded border-1 border-red-700 bg-red-100 p-2 text-red-700 transition hover:bg-red-200"
            title="Eliminar"
            disabled={loading}
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      <ConfirmDeleteModal
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        loading={loading}
        monto={pago.monto}
        fecha_pago={pago.fecha_pago}
      />
    </>
  )
}
