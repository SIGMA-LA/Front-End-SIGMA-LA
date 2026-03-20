'use client'

import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  User as UserIcon,
  X,
  Clock,
  Briefcase,
  FileText,
  Car,
  Building2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Visita } from '@/types'

interface VisitaDetailProps {
  visita: Visita
  onClose: () => void
  onCancel?: () => void
}
import { getVisita } from '@/actions/visitas'
import { getStatusColor, getTipoText } from './VisitaCard'
import { abrirGoogleMaps, navegarADireccion } from '@/lib/maps'

export default function VisitaDetail({
  visita: visitaProp,
  onClose,
}: VisitaDetailProps) {
  const [visita, setVisita] = useState<Visita | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchVisita() {
      setLoading(true)
      setError(null)
      try {
        const data = await getVisita(visitaProp.cod_visita)
        setVisita(data)
      } catch (err: any) {
        setError(err?.message || 'Error al obtener los detalles de la visita.')
      } finally {
        setLoading(false)
      }
    }
    fetchVisita()
  }, [visitaProp.cod_visita])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
    return localDate.toLocaleDateString('es-AR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
    return localDate.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-3xl rounded-xl bg-white p-12 text-center shadow-2xl">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando detalles...</p>
        </div>
      </div>
    )
  }

  if (error || !visita) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-3xl rounded-xl bg-white p-12 text-center shadow-2xl">
          <p className="text-red-600">{error || 'No se encontró la visita.'}</p>
          <button
            onClick={onClose}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    )
  }

  const direccion =
    visita.obra?.direccion || visita.direccion_visita || 'Sin dirección'
  const cliente = visita.obra?.cliente
    ? visita.obra.cliente.razon_social ||
      `${visita.obra.cliente.nombre || ''} ${visita.obra.cliente.apellido || ''}`.trim()
    : visita.nombre_cliente && visita.apellido_cliente
      ? `${visita.nombre_cliente} ${visita.apellido_cliente}`
      : 'Sin cliente'

  const telefono =
    visita.obra?.cliente?.telefono || visita.telefono_cliente || 'Sin teléfono'
  const email = visita.obra?.cliente?.mail || visita.mail_cliente || 'Sin email'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white/20 p-2">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Detalles de la Visita
              </h2>
              <p className="text-sm text-blue-100">#{visita.cod_visita}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body scrolleable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Estado y Tipo */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex rounded-full border px-4 py-2 text-sm font-bold tracking-wide uppercase ${getStatusColor(
                visita.estado || 'PROGRAMADA'
              )}`}
            >
              {visita.estado || 'PROGRAMADA'}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700">
              <Briefcase className="h-4 w-4" />
              {getTipoText(visita.motivo_visita)}
            </span>
          </div>

          {/* Grid de información */}
          <div className="mb-6 grid gap-6 md:grid-cols-2">
            {/* Fecha y Hora */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar className="h-5 w-5 text-blue-600" />
                Fecha y Hora
              </div>
              <p className="mb-1 text-lg font-bold text-gray-900">
                {formatDate(visita.fecha_hora_visita)}
              </p>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{formatTime(visita.fecha_hora_visita)}</span>
              </div>
            </div>

            {/* Cliente */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <UserIcon className="h-5 w-5 text-blue-600" />
                Cliente
              </div>
              <p className="mb-2 text-lg font-bold text-gray-900">{cliente}</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{telefono}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{email}</span>
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <MapPin className="h-5 w-5 text-blue-600" />
                Dirección
              </div>
              <p className="text-base font-semibold text-gray-900">
                {direccion}
              </p>
              {visita.localidad && (
                <p className="mt-1 text-sm text-gray-600">
                  {visita.localidad.nombre_localidad},{' '}
                  {visita.localidad.provincia?.nombre}
                </p>
              )}
            </div>

            {/* Vehículo */}
            {visita.uso_vehiculo_visita && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Car className="h-5 w-5 text-blue-600" />
                  Vehículo Asignado
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {visita.uso_vehiculo_visita.patente}
                </p>
              </div>
            )}
          </div>

          {/* Empleados */}
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <UserIcon className="h-5 w-5 text-blue-600" />
              Empleados Asignados
            </div>
            <div className="flex flex-wrap gap-2">
              {visita.empleado_visita?.length > 0 ? (
                visita.empleado_visita.map((ev, idx) => (
                  <div
                    key={ev.cuil}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
                      idx === 0
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 bg-white text-gray-700'
                    }`}
                  >
                    <UserIcon className="h-4 w-4" />
                    <span>
                      {ev.empleado?.nombre} {ev.empleado?.apellido}
                    </span>
                    {idx === 0 && (
                      <span className="ml-1 rounded bg-blue-500 px-2 py-0.5 text-xs">
                        Principal
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-sm text-gray-400 italic">
                  Sin empleados asignados
                </span>
              )}
            </div>
          </div>

          {/* Observaciones */}
          {visita.observaciones && (
            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FileText className="h-5 w-5 text-blue-600" />
                Observaciones
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm text-gray-700">{visita.observaciones}</p>
              </div>
            </div>
          )}

          {/* Días de viático */}
          {visita.dias_viaticos && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-900">
                Días de viático:{' '}
                <span className="font-bold">{visita.dias_viaticos}</span>
              </p>
            </div>
          )}
        </div>

        {/* Footer con acciones */}
        <div className="border-t bg-gray-50 px-6 py-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => navegarADireccion(direccion)}
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Cómo llegar
            </Button>
            <Button
              onClick={() => abrirGoogleMaps(direccion)}
              className="flex-1 bg-green-600 text-white hover:bg-green-700"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Ver en el mapa
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
