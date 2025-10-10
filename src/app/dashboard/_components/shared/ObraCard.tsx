import { useState, useMemo } from 'react'
import { Obra, Provincia } from '@/types'
import EstadoObraBadge from './EstadoObraBadge'
import { Calendar, Edit, Trash2, DollarSign } from 'lucide-react'
import EliminarObraModal from '../ventas/EliminarObraModal'

interface ObraCardProps {
  obra: Obra
  usuarioRol: string | undefined
  provincias: Provincia[]
  onScheduleVisit?: (obra: Obra) => void
  onScheduleEntrega?: (obra: Obra) => void
  onPagosClick?: (obra: Obra) => void
  onEditClick?: (obra: Obra) => void
  onDeleteClick?: (obraId: number) => void
}

export default function ObraCard({
  obra,
  usuarioRol,
  provincias,
  onScheduleVisit,
  onScheduleEntrega,
  onPagosClick,
  onEditClick,
  onDeleteClick,
}: ObraCardProps) {
  const [modalOpen, setModalOpen] = useState(false)

  const provincia = useMemo(() => {
    if (obra.localidad && provincias.length > 0) {
      return provincias.find(
        (p) => p.cod_provincia === obra.localidad.cod_provincia
      )
    }
    return null
  }, [obra.localidad, provincias])

  const handleDelete = () => {
    setModalOpen(true)
  }

  const handleConfirmDelete = () => {
    setModalOpen(false)
    if (onDeleteClick) onDeleteClick(obra.cod_obra)
  }

  const isCancelada = obra.estado === 'CANCELADA'

  return (
    <>
      <EliminarObraModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        direccion={obra.direccion}
      />
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {obra.direccion}, {obra.localidad?.nombre_localidad || 'N/A'},{' '}
              {provincia?.nombre || 'N/A'}
            </h3>
            <p className="text-gray-600">
              Cliente:{' '}
              {obra.cliente?.tipo_cliente === 'EMPRESA'
                ? obra.cliente.razon_social
                : `${obra.cliente?.nombre ?? ''} ${obra.cliente?.apellido ?? ''}` ||
                  'N/A'}
            </p>
            <p className="text-sm text-gray-500">
              Inicio:{' '}
              {new Date(obra.fecha_ini).toLocaleDateString('es-AR', {
                timeZone: 'UTC',
              })}
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <EstadoObraBadge estado={obra.estado} />
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {/* SOLO mostrar si NO es VENTAS */}
              {usuarioRol !== 'VENTAS' && onScheduleVisit && (
                <button
                  onClick={() => onScheduleVisit(obra)}
                  className="flex items-center gap-1 font-medium text-green-600 hover:text-green-800"
                >
                  <Calendar className="h-4 w-4" /> Agendar Visita
                </button>
              )}
              {usuarioRol !== 'VENTAS' && onScheduleEntrega && (
                <button
                  onClick={() => onScheduleEntrega(obra)}
                  className="flex items-center gap-1 font-medium text-red-600 hover:text-red-800"
                >
                  <Calendar className="h-4 w-4" /> Agendar Entrega
                </button>
              )}
              {/* SOLO mostrar si ES VENTAS */}
              {usuarioRol === 'VENTAS' && (
                <>
                  {onPagosClick && (
                    <button
                      onClick={() => onPagosClick(obra)}
                      className="flex items-center gap-1 font-medium text-green-600 hover:text-green-800"
                    >
                      <DollarSign className="h-4 w-4" /> Pagos
                    </button>
                  )}
                  {onEditClick && (
                    <button
                      onClick={() => onEditClick(obra)}
                      className="flex items-center gap-1 font-medium text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" /> Editar
                    </button>
                  )}
                  {onDeleteClick && !isCancelada && (
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-1 font-medium text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" /> Eliminar
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
