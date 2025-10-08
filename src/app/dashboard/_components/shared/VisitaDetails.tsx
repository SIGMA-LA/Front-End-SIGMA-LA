'use client'

import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  User as UserIcon,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Visita, VisitaDetailProps } from '@/types'
import { obtenerVisitaPorId, cancelarVisita } from '@/actions/visitas'
import { getStatusColor, getTipoText } from './VisitaCard'
import { abrirGoogleMaps, navegarADireccion } from '@/lib/maps'

export default function VisitaDetail({
  visita: visitaProp,
  onClose,
  onCancel,
}: VisitaDetailProps) {
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [visita, setVisita] = useState<Visita | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchVisita() {
      setLoading(true)
      setError(null)
      try {
        const data = await obtenerVisitaPorId(visitaProp.cod_visita)
        setVisita(data)
      } catch (err: any) {
        setError(err?.message || 'Error al obtener los detalles de la visita.')
      } finally {
        setLoading(false)
      }
    }
    fetchVisita()
  }, [visitaProp.cod_visita])

  const handleCancelarVisita = () => {
    if (!visita) return
    cancelarVisita(visita.cod_visita)
    setShowCancelModal(false)
    if (typeof onCancel === 'function') onCancel()
    onClose()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  if (error || !visita) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-red-600">
          {error || 'No se encontró la visita.'}
        </span>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b p-6">
          <div className="flex items-center gap-3">
            <UserIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              {visita?.nombre_cliente
                ? 'Detalles de la Visita - Sin Obra'
                : 'Detalles de la Visita'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 overflow-y-auto p-6">
          {/* Estado y tipo */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span
              className={`inline-flex items-center gap-2 rounded-md px-3 py-1 text-xs font-bold tracking-wide uppercase ${getStatusColor(
                visita.estado ? visita.estado : 'PROGRAMADA'
              )} shadow`}
              style={{ minWidth: 110 }}
            >
              {visita.estado ? visita.estado : 'PROGRAMADA'}
            </span>
            <span className="inline-flex items-center gap-2 rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
              {getTipoText(visita.motivo_visita)}
            </span>
          </div>

          {/* Cliente y contacto */}
          <div className="grid grid-cols-1 gap-6 rounded-lg border bg-gray-50 p-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-bold text-gray-500">Cliente</label>
              <p className="font-semibold text-gray-800">
                {visita.obra?.cliente?.razon_social
                  ? visita.obra.cliente.razon_social
                  : visita.obra?.cliente?.nombre &&
                      visita.obra?.cliente?.apellido
                    ? `${visita.obra.cliente.apellido} ${visita.obra.cliente.nombre}`
                    : visita.nombre_cliente && visita.apellido_cliente
                      ? `${visita.apellido_cliente} ${visita.nombre_cliente}`
                      : 'Sin cliente'}
              </p>
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>
                  {visita?.telefono_cliente}
                  {visita?.obra?.cliente?.telefono
                    ? visita.obra.cliente.telefono
                    : visita.telefono_cliente || 'Sin teléfono'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>
                  {visita?.obra?.cliente?.mail
                    ? visita.obra.cliente.mail
                    : visita.mail_cliente || 'Sin email'}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-500">
                Dirección y Fecha
              </label>
              <p className="font-semibold text-gray-800">
                {visita.obra?.direccion
                  ? visita.obra.direccion
                  : visita.direccion_visita || 'Sin dirección'}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">
                  {new Date(visita.fecha_hora_visita).toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">Observaciones</h3>
            <div className="rounded-lg border bg-gray-50 p-4 text-sm text-gray-700">
              {visita.observaciones || 'Sin observaciones'}
            </div>
          </div>

          {/* Empleados asignados */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">Empleados asignados</h3>
            {Array.isArray(visita.empleado_visita) &&
            visita.empleado_visita.length > 0 ? (
              <ul className="ml-4 list-disc space-y-1 text-sm text-gray-700">
                {visita.empleado_visita.map((ev) => (
                  <li key={ev.cuil}>
                    {ev.empleado.nombre} {ev.empleado.apellido}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="ml-2 text-sm text-gray-400">
                Sin empleados asignados
              </span>
            )}
          </div>

          {/* Acciones */}

          <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row sm:space-x-4">
            <Button
              onClick={() =>
                navegarADireccion(
                  visita.obra?.direccion || visita.direccion_visita || ''
                )
              }
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Cómo llegar
            </Button>
            <Button
              onClick={() =>
                abrirGoogleMaps(
                  visita.obra?.direccion || visita.direccion_visita || ''
                )
              }
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
