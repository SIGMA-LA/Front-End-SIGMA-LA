import { Calendar, User, Eye, Trash2, Pencil } from 'lucide-react'
import { Visita } from '@/types'

function getStatusColor(estado: string) {
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

function getTipoText(tipo: string) {
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

interface VisitaCardProps {
  visita: Visita
  rolActual?: string
  onEdit?: (visita: Visita) => void
  onDelete?: (visita: Visita) => void
}

export default function VisitaCard({
  visita,
  rolActual,
  onEdit,
  onDelete,
}: VisitaCardProps) {
  const esCoordinacion = rolActual?.trim().toUpperCase() === 'COORDINACION'

  return (
    <div className="flex items-center">
      <div className="flex flex-1 flex-col rounded-xl border border-blue-200 bg-blue-50 p-6 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              {visita.obra?.direccion || 'Visita sin obra asignada'}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(visita.fecha_hora_visita)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              {Array.isArray(visita.empleados_asignados) &&
              visita.empleados_asignados.length > 0 ? (
                <ul className="ml-2 list-disc pl-4">
                  {visita.empleados_asignados.map((empleado, idx) => (
                    <li
                      key={empleado.cuil || idx}
                      className="text-xs text-gray-700"
                    >
                      {empleado.nombre} {empleado.apellido}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-xs text-gray-400">Sin asignar</span>
              )}
            </div>
            <div>
              <span className="font-medium">
                Tipo: {getTipoText(visita.motivo_visita)}
              </span>
            </div>
          </div>
          <p className="mt-2 text-gray-500">{visita.observaciones}</p>
        </div>
        <div className="mt-4 flex w-full flex-col items-end gap-2 sm:mt-0 sm:ml-4 sm:w-auto">
          <span
            className={`mb-2 inline-flex items-center justify-center rounded-md px-3 py-1 text-xs font-bold tracking-wide uppercase ${getStatusColor(
              visita.estado
            )} shadow`}
            style={{ minWidth: 110 }}
          >
            {visita.estado}
          </span>
          <div className="flex gap-2">
            <button className="flex items-center space-x-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600">
              <Eye className="h-4 w-4" />
              <span>Ver Detalles</span>
            </button>
            {esCoordinacion && (
              <>
                <button
                  onClick={() => onEdit?.(visita)}
                  className="flex items-center space-x-2 rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-100"
                  title="Editar"
                >
                  <Pencil className="h-4 w-4" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => onDelete?.(visita)}
                  className="flex items-center space-x-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Eliminar</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
