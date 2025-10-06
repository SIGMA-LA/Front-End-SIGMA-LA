'use client'

import {
  Calendar,
  XCircle,
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
        <span className="ml-4 text-blue-700">Cargando visita...</span>
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
              Detalles de la Visita
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
                visita.estado
              )} shadow`}
              style={{ minWidth: 110 }}
            >
              {visita.estado}
            </span>
            <span className="inline-flex items-center gap-2 rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
              {getTipoText(visita.motivo_visita)}
            </span>
          </div>

          {/* Cliente y contacto */}
          <div className="grid grid-cols-1 gap-6 rounded-lg border bg-gray-50 p-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Cliente
              </label>
              <p className="font-semibold text-gray-800">
                {visita?.obra?.cliente?.razon_social || 'Sin cliente'}
              </p>
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>
                  {visita?.obra?.cliente?.telefono
                    ? visita.obra.cliente.telefono
                    : 'Sin teléfono'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>
                  {visita?.obra?.cliente?.mail
                    ? visita.obra.cliente.mail
                    : 'Sin email'}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Dirección
              </label>
              <p className="font-semibold text-gray-800">
                {visita.obra?.direccion || 'Sin dirección'}
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
            {Array.isArray(visita.empleados_asignados) &&
            visita.empleados_asignados.length > 0 ? (
              <ul className="ml-4 list-disc space-y-1 text-sm text-gray-700">
                {visita.empleados_asignados.map((emp) => (
                  <li key={emp.cuil}>
                    {emp.nombre} {emp.apellido}
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
            <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
              <MapPin className="mr-2 h-4 w-4" />
              Cómo llegar
            </Button>
            {visita.estado === 'PROGRAMADA' && (
              <Button
                onClick={() => setShowCancelModal(true)}
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
              >
                Cancelar Visita
              </Button>
            )}
          </div>
        </div>
      </div>

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
              <Button
                onClick={handleCancelarVisita}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow transition hover:bg-red-700"
              >
                Confirmar
              </Button>
              <Button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 rounded-lg bg-gray-100 px-4 py-2 font-semibold text-gray-700 shadow transition hover:bg-gray-200"
              >
                Volver
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
