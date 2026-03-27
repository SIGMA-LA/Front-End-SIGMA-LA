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
import { Visita } from '@/types'
import { getVisita } from '@/actions/visitas'
import { getStatusColor } from './VisitaCard'

const getTipoText = (tipo: string) => {
  const tipos: Record<string, string> = {
    'VISITA INICIAL': 'Visita Inicial',
    MEDICION: 'Medición',
    'RE-MEDICION': 'Re-Medición',
    REPARACION: 'Reparación',
    ASESORAMIENTO: 'Asesoramiento',
    'TOMA DE MEDIDAS': 'Toma de medidas',
    'REPLANTEO': 'Replanteo',
  }
  return tipos[tipo] || tipo
}
import { abrirGoogleMaps, navegarADireccion } from '@/lib/maps'

interface VisitaDetailProps {
  visita: Visita
  onClose: () => void
  onCancel?: () => void
}

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
      } catch (err: unknown) {
        setError(
          (err as { message?: string }).message ||
            'Error al obtener los detalles de la visita.'
        )
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-12 text-center shadow-2xl">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600 font-medium">Cargando detalles premium...</p>
        </div>
      </div>
    )
  }

  if (error || !visita) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
          <div className="mb-4 flex justify-center text-rose-500">
            <X className="h-12 w-12 rounded-full bg-rose-50 p-2" />
          </div>
          <p className="text-slate-700 font-bold">{error || 'No se encontró la visita.'}</p>
          <button
            onClick={onClose}
            className="mt-6 w-full rounded-xl bg-indigo-600 py-3 font-bold text-white transition-all hover:bg-indigo-700"
          >
            Cerrar Ventana
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
    : `${visita.nombre_cliente || ''} ${visita.apellido_cliente || ''}`.trim() || 'Sin cliente'

  const telefono =
    visita.obra?.cliente?.telefono || visita.telefono_cliente || 'Sin teléfono'
  const email = visita.obra?.cliente?.mail || visita.mail_cliente || 'Sin email'

  // El backend devuelve esto como array en Prisma, pero los tipos dicen objeto.
  // Usamos casting para mayor seguridad si es array.
  const usoVehiculo = Array.isArray(visita.uso_vehiculo_visita) 
    ? visita.uso_vehiculo_visita[0]
    : visita.uso_vehiculo_visita

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-100 bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md shadow-inner text-white">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Detalles de la Visita
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-100/80">Código:</span>
                <span className="text-xs font-mono font-bold text-white bg-white/10 px-1.5 py-0.5 rounded leading-none">#{visita.cod_visita}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2.5 text-indigo-100 transition-all hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body scrolleable */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Header Info: Estado y Tipo */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-bold tracking-wider uppercase shadow-sm ${getStatusColor(
                  visita.estado || 'PROGRAMADA'
                )}`}
              >
                <div className="h-2 w-2 rounded-full bg-current" />
                {visita.estado || 'PROGRAMADA'}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-bold tracking-wider text-slate-600 uppercase">
                <Briefcase className="h-3.5 w-3.5 text-indigo-500" />
                {getTipoText(visita.motivo_visita)}
              </span>
            </div>
            
            {visita.dias_viaticos && (
              <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 border border-indigo-100">
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-tighter">Días de viático:</span>
                <span className="text-sm font-black text-indigo-600 underline decoration-indigo-200 underline-offset-4">{visita.dias_viaticos}</span>
              </div>
            )}
          </div>

          {/* Grid de información */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Sección Izquierda: Logística */}
            <div className="space-y-6">
              {/* Fecha y Hora */}
              <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:shadow-md hover:border-indigo-200">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Cronograma</span>
                </div>
                <div className="space-y-3 pl-1">
                  <div>
                    <p className="text-lg font-bold text-slate-800 capitalize leading-none">
                      {formatDate(visita.fecha_hora_visita)}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-slate-500">
                      <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md text-sm font-semibold">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatTime(visita.fecha_hora_visita)}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-300 uppercase leading-none">Visita pactada</span>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 h-24 w-24 translate-x-12 -translate-y-12 rounded-full bg-indigo-50/50" />
              </div>

              {/* Dirección */}
              <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:shadow-md hover:border-indigo-200">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Ubicación</span>
                </div>
                <div className="pl-1">
                  <p className="text-base font-bold text-slate-800 leading-snug">
                    {direccion}
                  </p>
                  {visita.localidad && (
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 border border-slate-100">
                      <span className="text-sm font-medium text-slate-600">
                        {visita.localidad.nombre_localidad}, {visita.localidad.provincia?.nombre}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Vehículo */}
              {usoVehiculo && (
                <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:shadow-md hover:border-indigo-200">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Car className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Logística de transporte</span>
                  </div>
                  <div className="pl-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl font-black text-slate-800 tracking-tight">
                          {usoVehiculo.vehiculo?.patente || usoVehiculo.patente}
                        </p>
                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Patente asignada</p>
                      </div>
                      {usoVehiculo.vehiculo && (
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-700">
                            {usoVehiculo.vehiculo.marca} {usoVehiculo.vehiculo.modelo}
                          </p>
                          <p className="text-xs font-medium text-slate-500">
                            {usoVehiculo.vehiculo.tipo_vehiculo} ({usoVehiculo.vehiculo.anio})
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sección Derecha: Personal y Cliente */}
            <div className="space-y-6">
              {/* Cliente */}
              <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:shadow-md hover:border-indigo-200">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Titular</span>
                </div>
                <div className="pl-1">
                  <p className="text-xl font-black text-slate-800 tracking-tight leading-none mb-4">{cliente}</p>
                  <div className="grid grid-cols-1 gap-3 text-slate-700">
                    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                      <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-white text-indigo-500 shadow-sm">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Teléfono</p>
                        <p className="text-sm font-bold">{telefono}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                      <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-white text-indigo-500 shadow-sm">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Email</p>
                        <p className="text-sm font-bold truncate">{email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Asignado */}
              <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:shadow-md hover:border-indigo-200">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Equipo Técnico</span>
                </div>
                <div className="flex flex-col gap-2.5 pl-1">
                  {visita.empleado_visita?.length > 0 ? (
                    visita.empleado_visita.map((ev, idx) => (
                      <div
                        key={ev.cuil || idx}
                        className={`group/item flex items-center justify-between rounded-xl border p-3 transition-colors ${
                          idx === 0
                            ? 'border-indigo-100 bg-indigo-50/50 shadow-sm'
                            : 'border-slate-100 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-full text-white font-black text-xs shadow-sm ${
                            idx === 0 ? 'bg-indigo-600' : 'bg-slate-300'
                          }`}>
                            {ev.empleado ? ev.empleado.nombre[0].toUpperCase() + ev.empleado.apellido[0].toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {ev.empleado ? `${ev.empleado.nombre} ${ev.empleado.apellido}` : ev.cuil}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                              {idx === 0 ? 'Visitador Responsable' : 'Acompañante'}
                            </p>
                          </div>
                        </div>
                        {idx === 0 && (
                          <span className="rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-sm ring-2 ring-indigo-50">
                            Principal
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-slate-100 rounded-xl">
                      <UserIcon className="h-8 w-8 text-slate-200 mb-2" />
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sin personal asignado</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          {visita.observaciones && (
            <div className="mt-8 group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-md hover:border-indigo-200">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Notas de coordinación</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 italic">
                <p className="text-sm leading-relaxed text-slate-600">" {visita.observaciones} "</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer con acciones */}
        <div className="border-t border-slate-100 bg-slate-50/50 px-8 py-6 backdrop-blur-sm">
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => navegarADireccion(direccion)}
              className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0"
            >
              <MapPin className="h-4 w-4" />
              Navegar con GPS
            </button>
            <button
              onClick={() => abrirGoogleMaps(direccion)}
              className="flex flex-1 items-center justify-center gap-3 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-black uppercase tracking-widest text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300"
            >
              <MapPin className="h-4 w-4 text-rose-500" />
              Ver Mapa
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
