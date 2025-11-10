'use client'

import { useState, useTransition } from 'react'
import {
  Calendar,
  Clock,
  User,
  Eye,
  Pencil,
  XCircle,
  MapPin,
  Briefcase,
} from 'lucide-react'
import { Visita } from '@/types'
import VisitaDetail from './VisitaDetails'
import { cancelarVisitaAction } from '@/actions/visitas'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function getStatusColor(estado: string) {
  switch (estado) {
    case 'PROGRAMADA':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'EN CURSO':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'COMPLETADA':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'CANCELADA':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'REPROGRAMADA':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export function getTipoText(tipo: string) {
  const tipos: Record<string, string> = {
    'VISITA INICIAL': 'Visita Inicial',
    MEDICION: 'Medición',
    'RE-MEDICION': 'Re-Medición',
    REPARACION: 'Reparación',
    ASESORAMIENTO: 'Asesoramiento',
  }
  return tipos[tipo] || tipo
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return localDate.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatTime(dateString: string) {
  const date = new Date(dateString)
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return localDate.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
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
      alert('Por favor, ingresa un motivo de cancelación')
      return
    }

    startTransition(async () => {
      try {
        const result = await cancelarVisitaAction(
          visita.cod_visita,
          motivoCancelacion
        )

        if (result.success) {
          setShowCancelModal(false)
          setMotivoCancelacion('')
          router.refresh()
        } else {
          alert(result.error || 'Error al cancelar la visita')
        }
      } catch (error) {
        console.error('Error al cancelar:', error)
        alert('Error al cancelar la visita')
      }
    })
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-3">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">
              {visita.obra?.direccion ||
                visita.direccion_visita ||
                'Sin dirección'}
            </h3>
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-bold tracking-wide uppercase ${getStatusColor(
              visita.estado || 'PROGRAMADA'
            )}`}
          >
            {visita.estado || 'PROGRAMADA'}
          </span>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Fecha */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Fecha</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(visita.fecha_hora_visita)}
                </p>
              </div>
            </div>

            {/* Hora */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Hora</p>
                <p className="font-semibold text-gray-900">
                  {formatTime(visita.fecha_hora_visita)}
                </p>
              </div>
            </div>

            {/* Tipo */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Tipo</p>
                <p className="font-semibold text-gray-900">
                  {getTipoText(visita.motivo_visita)}
                </p>
              </div>
            </div>
          </div>

          {/* Empleados */}
          <div className="mb-4">
            <div className="mb-2 flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <p className="text-sm font-medium text-gray-700">
                Empleados asignados
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {visita.empleado_visita?.length > 0 ? (
                visita.empleado_visita.map((ev, idx) => (
                  <span
                    key={ev.cuil || idx}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      idx === 0
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {ev.empleado?.nombre} {ev.empleado?.apellido}
                    {idx === 0 && ' (Principal)'}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-400 italic">
                  Sin asignar
                </span>
              )}
            </div>
          </div>

          {/* Observaciones */}
          {visita.observaciones && (
            <div className="mb-4 rounded-lg bg-gray-50 p-3">
              <p className="text-xs font-medium text-gray-500">Observaciones</p>
              <p className="mt-1 text-sm text-gray-700">
                {visita.observaciones}
              </p>
            </div>
          )}

          {/* Botones */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowDetail(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Eye className="h-4 w-4" />
              Ver Detalles
            </button>

            {esCoordinacion && visita.estado === 'PROGRAMADA' && (
              <>
                <Link
                  href={`/coordinacion/visitas/${visita.cod_visita}/editar`}
                  className="flex items-center gap-2 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-700 transition-colors hover:bg-yellow-100"
                >
                  <Pencil className="h-4 w-4" />
                  Editar
                </Link>
                <button
                  onClick={() => setShowCancelModal(true)}
                  disabled={isPending}
                  className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" />
                  {isPending ? 'Cancelando...' : 'Cancelar'}
                </button>
              </>
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
