import { useState } from 'react'
import { Calendar, Clock, User, Eye, Pencil, XCircle } from 'lucide-react'
import { Visita } from '@/types'
import VisitaDetail from './VisitaDetails'
import { cancelarVisita } from '@/actions/visitas'

export function getStatusColor(estado: string) {
  switch (estado) {
    case 'PROGRAMADA':
      return 'bg-yellow-200 text-yellow-800 border border-yellow-300'
    case 'COMPLETADA':
      return 'bg-green-100 text-green-800 border border-green-200'
    case 'CANCELADA':
      return 'bg-red-100 text-red-700 border border-red-200'
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-200'
  }
}

export function getTipoText(tipo: string) {
  switch (tipo) {
    case 'VISITA INICIAL':
      return 'Visita Inicial'
    case 'MEDICION':
      return 'Medición'
    case 'RE-MEDICION':
      return 'Re-Medición'
    case 'REPARACION':
      return 'Reparación'
    case 'ASESORAMIENTO':
      return 'Asesoramiento'
    default:
      return tipo
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-AR')
}

function formatTime(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface VisitaCardProps {
  visita: Visita
  rolActual?: string
  onEdit?: (visita: Visita) => void
  onDelete?: (visita: Visita) => void
  refrescarVisitas: () => void
}

export default function VisitaCard({
  visita,
  rolActual,
  onEdit,
  onDelete,
  refrescarVisitas,
}: VisitaCardProps) {
  const esCoordinacion = rolActual?.trim().toUpperCase() === 'COORDINACION'
  const [showDetail, setShowDetail] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  const handleCancelarVisita = async () => {
    setCancelLoading(true)
    try {
      await cancelarVisita(visita.cod_visita)
      refrescarVisitas()
      setShowCancelModal(false)
    } finally {
      setCancelLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center">
        <div className="flex flex-1 flex-col rounded-xl border border-blue-200 bg-blue-50 p-6 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-semibold text-gray-800">
              {visita.obra?.direccion || visita.direccion_visita}
            </h3>
            <div className="mb-2 grid grid-cols-4 items-start gap-x-2 gap-y-1">
              <div className="flex items-center gap-1">
                <Calendar className="hidden h-4 w-4 text-blue-600 sm:inline" />
                <span className="text-sm text-gray-700">
                  {formatDate(visita.fecha_hora_visita)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="hidden h-4 w-4 text-blue-600 sm:inline" />
                <span className="text-sm text-gray-700">
                  {formatTime(visita.fecha_hora_visita)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                  {getTipoText(visita.motivo_visita)}
                </span>
              </div>
              <div className="flex items-start gap-1">
                <User className="mt-[2px] hidden h-4 w-4 text-blue-600 sm:inline" />
                <div className="flex flex-col">
                  {Array.isArray(visita.empleado_visita) &&
                  visita.empleado_visita.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {visita.empleado_visita.map((ev, idx) =>
                        ev ? (
                          <li
                            key={ev.cuil || idx}
                            className="text-xs leading-tight text-gray-700"
                            style={idx === 0 ? { marginTop: '-2px' } : {}}
                          >
                            {ev.empleado?.nombre} {ev.empleado?.apellido}
                          </li>
                        ) : (
                          <li
                            key={idx}
                            className="text-xs leading-tight text-gray-400 italic"
                            style={idx === 0 ? { marginTop: '-2px' } : {}}
                          >
                            Empleado no disponible
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <span className="text-xs text-gray-400">Sin asignar</span>
                  )}
                </div>
              </div>
            </div>
            <label className="text-sm font-medium text-gray-700">
              Observaciones:{' '}
            </label>
            <p className="pr-4 text-sm font-medium text-gray-500">
              {visita.observaciones || '(vacío)'}
            </p>
          </div>
          <div className="mt-4 flex w-full flex-col items-end gap-2 sm:mt-0 sm:ml-4 sm:w-auto">
            <span
              className={`mb-2 inline-flex items-center justify-center rounded-md px-3 py-1 text-xs font-bold tracking-wide uppercase ${getStatusColor(
                visita.estado ? visita.estado : 'PROGRAMADA'
              )} shadow`}
              style={{ minWidth: 110 }}
            >
              {visita.estado ? visita.estado : 'PROGRAMADA'}
            </span>
            <div className="block" style={{ width: 300, minHeight: 44 }}>
              <div className="flex w-full justify-end gap-2">
                <button
                  className="flex h-11 w-32 items-center justify-center space-x-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                  onClick={() => setShowDetail(true)}
                >
                  <Eye className="hidden h-5 w-5 sm:inline" />
                  <span>Ver Detalles</span>
                </button>
                {esCoordinacion && visita.estado === 'PROGRAMADA' && (
                  <>
                    <button
                      onClick={() => onEdit?.(visita)}
                      className="flex h-11 w-32 items-center justify-center space-x-2 rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-100"
                      title="Editar"
                    >
                      <Pencil className="hidden h-4 w-4 sm:inline" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => setShowCancelModal(true)}
                      disabled={cancelLoading}
                      className="flex h-11 w-32 items-center justify-center space-x-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                      title="Cancelar"
                    >
                      <XCircle className="hidden h-4 w-4 sm:inline" />
                      <span>
                        {cancelLoading ? 'Cancelando...' : 'Cancelar'}
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-2xl">
            <button
              className="absolute top-2 right-2 z-10 rounded-full bg-white p-2 shadow hover:bg-gray-100"
              onClick={() => setShowDetail(false)}
              aria-label="Cerrar"
            >
              <span className="text-xl font-bold">&times;</span>
            </button>
            <VisitaDetail
              visita={visita}
              onClose={() => {
                setShowDetail(false)
              }}
              onCancel={refrescarVisitas}
            />
          </div>
        </div>
      )}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex w-full max-w-sm flex-col items-center rounded-xl border border-gray-200 bg-white p-8 shadow-2xl">
            <div className="mb-4 flex flex-col items-center">
              <XCircle className="mb-2 h-12 w-12 text-red-500" />
              <h2 className="mb-1 text-lg font-bold text-gray-900">
                Cancelar visita
              </h2>
              <p className="text-center text-sm text-gray-600">
                ¿Seguro que deseas cancelar la visita?
              </p>
            </div>
            <div className="mt-4 flex w-full gap-4">
              <button
                onClick={handleCancelarVisita}
                disabled={cancelLoading}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow transition hover:bg-red-700 disabled:opacity-50"
              >
                {cancelLoading ? 'Cancelando...' : 'Confirmar'}
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 rounded-lg bg-gray-100 px-4 py-2 font-semibold text-gray-700 shadow transition hover:bg-gray-200"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
