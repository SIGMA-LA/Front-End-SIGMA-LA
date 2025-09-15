'use client'

import { Calendar, Clock, User, Eye, Plus } from 'lucide-react'
import { mockVisitas } from '@/data/mockData'
import { VisitasListProps } from '@/types'

export default function VisitasList({ onCreateClick }: VisitasListProps) {
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'programada':
        return 'bg-yellow-500'
      case 'completada':
        return 'bg-green-500'
      case 'cancelada':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getTipoText = (tipo: string) => {
    switch (tipo) {
      case 'inspeccion':
        return 'Inspección'
      case 'medicion':
        return 'Medición'
      case 'seguimiento':
        return 'Seguimiento'
      case 'entrega':
        return 'Entrega'
      default:
        return tipo
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR')
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Visitas
          </h1>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Nueva Visita
          </button>
        </div>

        <div className="space-y-4">
          {mockVisitas.map((visita) => (
            <div key={visita.id} className="flex items-center space-x-4">
              {/* Status Indicator */}
              <div
                className={`h-6 w-6 rounded-full ${getStatusColor(visita.estado)}`}
              />

              {/* Visita Card */}
              <div className="flex-1 rounded-xl border border-blue-200 bg-blue-50 p-6 transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">
                      {visita.obra.direccion}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(visita.fecha)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{visita.hora}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{visita.visitadorAsignado}</span>
                      </div>
                      <div>
                        <span className="font-medium">
                          Tipo: {getTipoText(visita.tipo)}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-500">{visita.observaciones}</p>
                  </div>

                  {/* Action Button */}
                  <div className="ml-4">
                    <button className="flex items-center space-x-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600">
                      <Eye className="h-4 w-4" />
                      <span>
                        Ver
                        <br />
                        Detalles
                      </span>
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
