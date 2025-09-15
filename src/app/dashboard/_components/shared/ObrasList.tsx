import { Building2, Plus, Calendar } from 'lucide-react'
import { ObrasListProps } from '@/types'
import { mockObras } from '@/data/mockData'

export default function ObrasList({
  onCreateClick,
  onScheduleVisit,
  onScheduleEntrega,
}: ObrasListProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Obras
          </h1>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Nueva Obra
          </button>
        </div>

        <div className="grid gap-4 sm:gap-6">
          {mockObras.map((obra) => (
            <div
              key={obra.id}
              className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {obra.direccion}
                  </h3>
                  <p className="text-gray-600">
                    Cliente: {`${obra.cliente.nombre} ${obra.cliente.apellido}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    Inicio: {obra.fechaInicio}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      obra.estado === 'en_progreso'
                        ? 'bg-yellow-100 text-yellow-800'
                        : obra.estado === 'finalizada'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {obra.estado}
                  </span>
                  <div className="flex gap-2">
                    {onScheduleVisit && (
                      <button
                        onClick={() => onScheduleVisit(obra)}
                        className="flex items-center gap-1 font-medium text-green-600 hover:text-green-800"
                      >
                        <Calendar className="h-4 w-4" />
                        Agendar Visita
                      </button>
                    )}
                    {onScheduleEntrega && (
                      <button
                        onClick={() => onScheduleEntrega(obra)}
                        className="flex items-center gap-1 font-medium text-red-600 hover:text-red-800"
                      >
                        <Calendar className="h-4 w-4" />
                        Agendar Entrega
                      </button>
                    )}
                    <button className="font-medium text-blue-600 hover:text-blue-800">
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
