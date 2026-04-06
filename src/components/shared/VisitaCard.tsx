'use client'

import { useState, useTransition } from 'react'
import {
  Calendar,
  Clock,
  User,
  Eye,
  Pencil,
  XCircle,
  Briefcase,
} from 'lucide-react'
import { Visita } from '@/types'
import VisitaDetail from './VisitaDetails'
import { cancelarVisita } from '@/actions/visitas'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { notify } from '@/lib/toast'

export function getStatusColor(estado: string) {
  switch (estado) {
    case 'PENDIENTE':
    case 'PROGRAMADA':
    case 'EN CURSO':
      return 'text-orange-600 bg-orange-50'
    case 'COMPLETADA':
    case 'FINALIZADA':
      return 'text-green-600 bg-green-50'
    case 'CANCELADA':
      return 'text-red-600 bg-red-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

export function getStatusText(estado: string) {
  const estados: { [key: string]: string } = {
    PENDIENTE: 'PENDIENTE',
    PROGRAMADA: 'PENDIENTE',
    'EN CURSO': 'EN CURSO',
    COMPLETADA: 'COMPLETADA',
    FINALIZADA: 'COMPLETADA',
    CANCELADA: 'CANCELADA',
  }
  return estados[estado] || estado
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
  })
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Argentina/Buenos_Aires',
  })
}

interface VisitaCardProps {
  visita: Visita
  rolActual?: string
}

export default function VisitaCard({ visita, rolActual }: VisitaCardProps) {
  const esCoordinacion = rolActual?.trim().toUpperCase() === 'COORDINACION'
  const [showDetail, setShowDetail] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [motivoCancelacion, setMotivoCancelacion] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleCancelarVisita = () => {
    if (!motivoCancelacion.trim()) {
      notify.warning('Por favor, ingresa un motivo de cancelación')
      return
    }

    startTransition(async () => {
      try {
        const result = await cancelarVisita(
          visita.cod_visita,
          motivoCancelacion
        )

        if (result.success) {
          setShowCancelModal(false)
          setMotivoCancelacion('')
          router.refresh()
        } else {
          notify.error(result.error || 'Error al cancelar la visita')
        }
      } catch (error) {
        console.error('Error al cancelar:', error)
        notify.error('Error al cancelar la visita')
      }
    })
  }

  const getVisitadorPrincipal = () => {
    const principal = visita.empleado_visita?.[0]
    return principal
      ? `${principal.empleado?.nombre || ''} ${principal.empleado?.apellido || ''}`.trim() ||
          principal.cuil
      : 'No asignado'
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        {/* Header - Matching Entregas */}
        <div className="border-b bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-3">
          <h3 className="text-lg font-semibold text-gray-800">
            {visita.obra?.direccion ||
              visita.direccion_visita ||
              'Sin dirección'}
          </h3>
        </div>

        {/* Content - Matching Entregas */}
        <div className="p-6">
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Fecha */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Fecha</p>
                <p className="font-medium text-gray-900">
                  {formatDate(visita.fecha_hora_visita)}
                </p>
              </div>
            </div>

            {/* Hora */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Hora</p>
                <p className="font-medium text-gray-900">
                  {formatTime(visita.fecha_hora_visita)}
                </p>
              </div>
            </div>

            {/* Visitador */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Visitador</p>
                <p className="max-w-[120px] truncate font-medium text-gray-900">
                  {getVisitadorPrincipal()}
                </p>
              </div>
            </div>

            {/* Estado */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                <Briefcase className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Estado</p>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                    visita.estado || 'PENDIENTE'
                  )}`}
                >
                  {getStatusText(visita.estado || 'PENDIENTE')}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-4">
            <button
              onClick={() => setShowDetail(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition-all hover:bg-blue-100"
            >
              <Eye className="h-4 w-4" />
              Ver Detalles
            </button>

            {esCoordinacion &&
              (visita.estado === 'PENDIENTE' ||
                visita.estado === 'PROGRAMADA') && (
                <div className="flex gap-2">
                  <Link
                    href={`/coordinacion/visitas/${visita.cod_visita}/editar`}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg active:scale-95"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Link>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    disabled={isPending}
                    className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition-all hover:border-red-300 hover:bg-red-50 active:scale-95"
                  >
                    <XCircle className="h-4 w-4" />
                    {isPending ? 'Cancelando...' : 'Cancelar'}
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Modal de detalles */}
      {showDetail && (
        <VisitaDetail visita={visita} onClose={() => setShowDetail(false)} />
      )}

      {/* Modal de confirmación de cancelación */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex flex-col items-center text-center">
              <div className="mb-3 rounded-full bg-red-100 p-3">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="mb-2 text-xl font-bold text-gray-900">
                Cancelar visita
              </h2>
              <p className="text-sm text-gray-600">
                ¿Estás seguro de que deseas cancelar esta visita? Esta acción no
                se puede deshacer.
              </p>
            </div>

            {/* Campo de motivo */}
            <div className="mb-4">
              <label
                htmlFor="motivo"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Motivo de cancelación *
              </label>
              <textarea
                id="motivo"
                value={motivoCancelacion}
                onChange={(e) => setMotivoCancelacion(e.target.value)}
                disabled={isPending}
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                rows={3}
                placeholder="Ingresa el motivo de la cancelación..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false)
                  setMotivoCancelacion('')
                }}
                disabled={isPending}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Volver
              </button>
              <button
                onClick={handleCancelarVisita}
                disabled={isPending || !motivoCancelacion.trim()}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? 'Cancelando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
