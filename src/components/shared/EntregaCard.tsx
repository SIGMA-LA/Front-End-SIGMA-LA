'use client'

import { useState } from 'react'
import { Calendar, Clock, User, PackageOpen, Eye } from 'lucide-react'
import type { Entrega } from '@/types'
import EntregaDetailsModal from './EntregaDetailsModal'

interface EntregaCardProps {
  entrega: Entrega
}

export default function EntregaCard({ entrega }: EntregaCardProps) {
  const [showModal, setShowModal] = useState(false)

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'text-yellow-600 bg-yellow-50'
      case 'EN CURSO':
        return 'text-blue-600 bg-blue-50'
      case 'ENTREGADO':
        return 'text-green-600 bg-green-50'
      case 'CANCELADO':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (estado: string) => {
    const estados: { [key: string]: string } = {
      PENDIENTE: 'Pendiente',
      'EN CURSO': 'En Curso',
      ENTREGADO: 'Entregada',
      CANCELADO: 'Cancelada',
    }
    return estados[estado] || estado
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Argentina/Buenos_Aires',
    })
  }

  const getEncargado = () => {
    const encargado = entrega.empleados_asignados?.find(
      (e) => e.rol_entrega === 'ENCARGADO'
    )
    return encargado
      ? `${encargado.empleado.nombre} ${encargado.empleado.apellido}`
      : 'No asignado'
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <div className="border-b bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-3">
          <h3 className="text-lg font-semibold text-gray-800">
            {entrega.obra?.direccion || 'Dirección no disponible'}
          </h3>
        </div>

        <div className="p-6">
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Fecha</p>
                <p className="font-medium text-gray-900">
                  {formatDate(entrega.fecha_hora_entrega)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Hora</p>
                <p className="font-medium text-gray-900">
                  {formatTime(entrega.fecha_hora_entrega)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Encargado</p>
                <p className="font-medium text-gray-900">{getEncargado()}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                <PackageOpen className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Estado</p>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(entrega.estado)}`}
                >
                  {getStatusText(entrega.estado)}
                </span>
              </div>
            </div>
          </div>

          {entrega.detalle && (
            <div className="mb-3 rounded-lg bg-gray-50 p-3">
              <p className="text-sm font-medium text-gray-700">
                Detalle: {entrega.detalle}
              </p>
            </div>
          )}

          {entrega.observaciones && (
            <p className="mb-3 text-sm text-gray-600">
              Obs: {entrega.observaciones}
            </p>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Eye className="h-4 w-4" />
              Ver Detalles
            </button>
          </div>
        </div>
      </div>

      <EntregaDetailsModal
        isOpen={showModal}
        entrega={entrega}
        onClose={() => setShowModal(false)}
      />
    </>
  )
}
