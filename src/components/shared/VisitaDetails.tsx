'use client'

import { Calendar, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Visita } from '@/types'
import { getVisita } from '@/actions/visitas'
import { getViaticoByDate } from '@/actions/parametros'
import {
  DestinoSeccion,
  CronogramaSeccion,
  EquipoSeccion,
  TransporteSeccion,
  NotasSeccion,
} from './visita-details/SeccionesVisitaDetalle'

const getTipoText = (tipo: string) => {
  const tipos: Record<string, string> = {
    'VISITA INICIAL': 'Visita Inicial',
    MEDICION: 'Medición',
    'RE-MEDICION': 'Re-Medición',
    REPARACION: 'Reparación',
    ASESORAMIENTO: 'Asesoramiento',
    'TOMA DE MEDIDAS': 'Toma de medidas',
    REPLANTEO: 'Replanteo',
  }
  return tipos[tipo] || tipo
}

interface VisitaDetailProps {
  visita: Visita
  onClose: () => void
}

/**
 * Enhanced modal for viewing visit details.
 * Modularized into sections for better maintenance.
 */
export default function VisitaDetails({
  visita: visitaProp,
  onClose,
}: VisitaDetailProps) {
  const [visita, setVisita] = useState<Visita | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viaticoPorDia, setViaticoPorDia] = useState(0)

  useEffect(() => {
    async function fetchVisita() {
      setLoading(true)
      setError(null)
      try {
        const data = await getVisita(visitaProp.cod_visita)
        const historicalViatico = await getViaticoByDate(new Date(data.fecha_hora_visita).toISOString())
        setVisita(data)
        setViaticoPorDia(historicalViatico.viatico_dia_persona)
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : 'Error al obtener los detalles de la visita.'
        )
      } finally {
        setLoading(false)
      }
    }
    fetchVisita()
  }, [visitaProp.cod_visita])

  const formatDateTime = (dateString?: string | Date) => {
    if (!dateString) return 'No especificado'
    return new Intl.DateTimeFormat('es-AR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString))
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-2xl bg-white p-12 text-center shadow-2xl">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 font-medium tracking-tight text-gray-600">
            Cargando detalles de visita...
          </p>
        </div>
      </div>
    )
  }

  if (error || !visita) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
          <div className="mb-4 flex justify-center text-red-500">
            <X className="h-12 w-12 rounded-full bg-red-50 p-2" />
          </div>
          <p className="font-bold text-gray-700">
            {error || 'No se encontró la visita.'}
          </p>
          <button
            onClick={onClose}
            className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-bold text-white transition-all hover:bg-blue-700"
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl xl:max-w-7xl">
        {/* Encabezado */}
        <div className="flex flex-shrink-0 items-center justify-between border-b bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Detalles de Visita #{visita.cod_visita}
              </h2>
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    visita.estado === 'COMPLETADA'
                      ? 'bg-green-100 text-green-800'
                      : visita.estado === 'CANCELADA'
                        ? 'bg-red-100 text-red-800'
                        : 'border border-orange-200 bg-orange-100 text-orange-800'
                  }`}
                >
                  {visita.estado === 'PROGRAMADA'
                    ? 'PENDIENTE'
                    : (visita.estado || 'PENDIENTE').toUpperCase()}
                </span>
                <span>•</span>
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
                  {getTipoText(visita.motivo_visita)}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Cuerpo Scrollable */}
        <div className="overflow-y-auto bg-gray-50/50 p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <DestinoSeccion visita={visita} />
              <NotasSeccion visita={visita} />
            </div>

            <div className="space-y-6">
              <CronogramaSeccion
                visita={visita}
                formatDateTime={formatDateTime}
              />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-1">
                <EquipoSeccion visita={visita} />
                <TransporteSeccion visita={visita} viaticoPorDia={viaticoPorDia} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
