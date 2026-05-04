'use client'

import { useState } from 'react'
import { MapPin, User as UserIcon, Clock, Briefcase, Car, FileText } from 'lucide-react'
import { Visita } from '@/types'

interface SectionProps {
  visita: Visita
}

export function DestinoSeccion({ visita }: SectionProps) {
  const direccion = visita.obra?.direccion || visita.direccion_visita || 'Sin dirección'
  const nombreCliente = visita.obra?.cliente
    ? visita.obra.cliente.tipo_cliente === 'EMPRESA'
      ? visita.obra.cliente.razon_social
      : `${visita.obra.cliente.nombre ?? ''} ${visita.obra.cliente.apellido ?? ''}`.trim()
    : `${visita.nombre_cliente ?? ''} ${visita.apellido_cliente ?? ''}`.trim() ||
      'No identificado'

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-bold tracking-wider text-gray-900 uppercase">
        Destino Geográfico
      </h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-gray-100 p-2">
            <MapPin className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Dirección</p>
            <p className="font-semibold text-gray-900">{direccion}</p>
            {visita.localidad && (
              <p className="text-xs text-gray-500">
                {visita.localidad.nombre_localidad}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-gray-100 p-2">
            <UserIcon className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Cliente Titular</p>
            <p className="font-semibold text-gray-900">{nombreCliente}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CronogramaSeccion({
  visita,
  formatDateTime,
}: SectionProps & { formatDateTime: (d?: string | Date) => string }) {
  const usoVehiculo = Array.isArray(visita.uso_vehiculo_visita)
    ? visita.uso_vehiculo_visita[0]
    : visita.uso_vehiculo_visita

  const fechaSalida = usoVehiculo?.fecha_hora_ini_uso
  const fechaRegreso = usoVehiculo?.fecha_hora_fin_est

  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-5 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-indigo-900 uppercase">
        <Clock className="h-4 w-4" /> Cronograma Logístico
      </h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <p className="mb-1 text-xs font-medium text-indigo-600/80">
            Visita en el Lugar (Pactada)
          </p>
          <div className="rounded-lg border border-indigo-100 bg-white px-3 py-2 text-sm font-medium text-indigo-900">
            {formatDateTime(visita.fecha_hora_visita)}
          </div>
        </div>
        <div>
          <p className="mb-1 text-xs font-medium text-gray-500">
            Salida de Planta Estimada
          </p>
          <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800">
            {formatDateTime(fechaSalida || visita.fecha_hora_visita)}
          </div>
        </div>
        <div>
          <p className="mb-1 text-xs font-medium text-gray-500">
            Regreso a Planta Estimado
          </p>
          <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800">
            {formatDateTime(fechaRegreso)}
          </div>
        </div>
      </div>
    </div>
  )
}

export function EquipoSeccion({ visita }: SectionProps) {
  const encargado = visita.empleado_visita?.[0]
  const acompañantes = visita.empleado_visita?.slice(1)

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-bold tracking-wider text-gray-900 uppercase">
        Equipo Técnico
      </h3>
      <div className="space-y-4">
        {encargado ? (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 p-2 text-xs font-bold text-blue-600">
              {encargado.empleado?.nombre?.[0] || ''}
              {encargado.empleado?.apellido?.[0] || ''}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Visitador Responsable</p>
              <p className="font-semibold text-gray-900">
                {encargado.empleado?.nombre} {encargado.empleado?.apellido}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No hay personal designado.</p>
        )}

        {acompañantes && acompañantes.length > 0 && (
          <div className="flex items-start gap-3 border-t border-gray-100 pt-2">
            <div className="mt-1 rounded-lg bg-green-50 p-2">
              <Briefcase className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">
                Acompañantes ({acompañantes.length})
              </p>
              <div className="mt-1 flex flex-wrap gap-2">
                {acompañantes.map((a, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                  >
                    {a.empleado?.nombre} {a.empleado?.apellido}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function TransporteSeccion({ visita }: SectionProps) {
  const usoVehiculo = Array.isArray(visita.uso_vehiculo_visita)
    ? visita.uso_vehiculo_visita[0]
    : visita.uso_vehiculo_visita

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-bold tracking-wider text-gray-900 uppercase">
        Transporte
      </h3>
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-gray-100 p-2">
          <Car className="h-5 w-5 text-gray-600" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500">Vehículo Asignado</p>
          {usoVehiculo ? (
            <div>
              <p className="font-bold text-gray-900">
                {usoVehiculo.vehiculo?.patente || usoVehiculo.patente}
              </p>
              <p className="text-xs text-gray-500">
                {usoVehiculo.vehiculo?.marca} {usoVehiculo.vehiculo?.modelo}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">Sin vehículo asignado</p>
          )}
        </div>
      </div>
    </div>
  )
}

export function ViaticosSeccion({ visita, viaticoPorDia }: SectionProps & { viaticoPorDia?: number }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount)
  }

  if (visita.dias_viatico === undefined || visita.dias_viatico <= 0) return null

  return (
    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm">
      <h3 className="mb-2 text-sm font-bold tracking-wider text-yellow-900 uppercase">
        Costo de Viáticos
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-yellow-100 pb-2">
          <p className="text-xs text-yellow-700">Días proyectados:</p>
          <p className="text-lg font-black text-yellow-900">{visita.dias_viatico}</p>
        </div>
        {viaticoPorDia !== undefined && viaticoPorDia > 0 && (
          <>
            <div className="flex items-center justify-between border-b border-yellow-100 pb-2">
              <p className="text-xs text-yellow-700">Personal asignado:</p>
              <p className="text-sm font-bold text-yellow-900">
                {visita.empleado_visita?.length || 0} personas
              </p>
            </div>
            <div className="flex items-center justify-between border-b border-yellow-100 pb-2">
              <p className="text-xs text-yellow-700">Valor base (histórico):</p>
              <p className="text-sm font-bold text-yellow-900">
                {formatCurrency(viaticoPorDia)}
              </p>
            </div>
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs font-bold text-yellow-800 uppercase">Total Estimado:</p>
              <p className="text-xl font-black text-yellow-700">
                {formatCurrency(visita.dias_viatico * (visita.empleado_visita?.length || 0) * viaticoPorDia)}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function NotasSeccion({ visita }: SectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasLongNotes = (visita.observaciones?.length || 0) > 150

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold tracking-wider text-gray-900 uppercase">
        <FileText className="h-4 w-4 text-blue-500" /> Notas de Coordinación
      </h3>
      <div className="rounded-lg border border-blue-50/50 bg-blue-50/30 p-4">
        <div className={`relative ${!isExpanded && hasLongNotes ? 'max-h-24 overflow-hidden' : ''}`}>
          <p className="rounded-md border border-blue-100 bg-white p-3 text-sm leading-relaxed text-gray-800 shadow-sm whitespace-pre-wrap">
            {visita.observaciones || 'Sin observaciones adicionales proporcionadas.'}
          </p>
          {!isExpanded && hasLongNotes && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/80 to-transparent" />
          )}
        </div>
        {hasLongNotes && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            {isExpanded ? 'Ver menos' : 'Ver más'}
          </button>
        )}
      </div>
    </div>
  )
}
