import { Obra, Provincia } from '@/types'
import EstadoObraBadge from './EstadoObraBadge'
import { Calendar, Edit, Trash2, DollarSign } from 'lucide-react'
import { useEffect, useState } from 'react'
import { obtenerProvinciaById } from '@/actions/localidad'

interface ObraCardProps {
  obra: Obra
  usuarioRol: string | undefined
  onScheduleVisit?: (obra: Obra) => void
  onScheduleEntrega?: (obra: Obra) => void
  onPagosClick?: (obra: Obra) => void
  onEditClick?: (obra: Obra) => void
  onDeleteClick?: (obraId: number) => void
}

export default function ObraCard({
  obra,
  usuarioRol,
  onScheduleVisit,
  onScheduleEntrega,
  onPagosClick,
  onEditClick,
  onDeleteClick,
}: ObraCardProps) {
  const [provincia, setProvincia] = useState<Provincia | null>(null)

  useEffect(() => {
    if (obra.localidad) {
      obtenerProvinciaById(obra.localidad.cod_provincia)
        .then((prov) => setProvincia(prov))
        .catch(() => setProvincia(null))
    }
  }, [obra])

  // Función para determinar si la obra puede tener pagos
  const puedeCrearPagos = () => {
    // Estados que definitivamente NO pueden tener pagos
    const estadosNoPermitidos = ['CANCELADA', 'PAGADA TOTALMENTE', 'ENTREGADA']
    if (estadosNoPermitidos.includes(obra.estado)) {
      return false
    }

    // Si tenemos datos de presupuesto, usar la lógica completa
    if (obra.presupuesto && obra.presupuesto.length > 0) {
      const presupuestoAceptado =
        obra.presupuesto.find((p) => p.fecha_aceptacion) || obra.presupuesto[0]

      if (!presupuestoAceptado || presupuestoAceptado.valor <= 0) {
        return false
      }

      const totalPagado =
        obra.pagos?.reduce((sum, pago) => sum + pago.monto, 0) || 0
      const saldoPendiente = presupuestoAceptado.valor - totalPagado

      return saldoPendiente > 0
    }

    // Si NO tenemos datos de presupuesto (datos incompletos del API),
    // permitir pagos basándose solo en el estado
    const estadosPermitidosParaPagos = [
      'EN ESPERA DE PAGO',
      'PAGADA PARCIALMENTE',
      'EN ESPERA DE STOCK',
      'EN PRODUCCION',
      'PRODUCCION FINALIZADA',
    ]

    return estadosPermitidosParaPagos.includes(obra.estado)
  }

  const esValidoParaPagos = puedeCrearPagos()

  return (
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
                    onClick={() => esValidoParaPagos && onPagosClick(obra)}
                    disabled={!esValidoParaPagos}
                    className={`flex items-center gap-1 font-medium transition-colors ${
                      esValidoParaPagos
                        ? 'cursor-pointer text-green-600 hover:text-green-800'
                        : 'cursor-not-allowed text-gray-400'
                    }`}
                    title={
                      !esValidoParaPagos
                        ? 'No se pueden crear pagos: falta presupuesto aceptado o ya está totalmente pagado'
                        : 'Crear pago para esta obra'
                    }
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
                {onDeleteClick && (
                  <button
                    onClick={() => onDeleteClick(obra.cod_obra)}
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
  )
}
