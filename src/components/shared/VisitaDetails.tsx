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
          <p className="mt-4 text-gray-600 font-medium tracking-tight">Cargando detalles de visita...</p>
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
          <p className="text-gray-700 font-bold">{error || 'No se encontró la visita.'}</p>
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

  const direccion = visita.obra?.direccion || visita.direccion_visita || 'Sin dirección'
  const nombreCliente = visita.obra?.cliente
    ? (visita.obra.cliente.tipo_cliente === 'EMPRESA'
        ? visita.obra.cliente.razon_social
        : `${visita.obra.cliente.nombre ?? ''} ${visita.obra.cliente.apellido ?? ''}`.trim())
    : `${visita.nombre_cliente ?? ''} ${visita.apellido_cliente ?? ''}`.trim() || 'No identificado'

  const usoVehiculo = Array.isArray(visita.uso_vehiculo_visita) 
    ? visita.uso_vehiculo_visita[0]
    : visita.uso_vehiculo_visita

  const fechaSalida = usoVehiculo?.fecha_hora_ini_uso
  const fechaRegreso = usoVehiculo?.fecha_hora_fin_est

  const encargado = visita.empleado_visita?.[0]
  const acompañantes = visita.empleado_visita?.slice(1)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-xl bg-white shadow-2xl overflow-hidden">
        
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
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  visita.estado === 'COMPLETADA' ? 'bg-green-100 text-green-800' :
                  visita.estado === 'CANCELADA' ? 'bg-red-100 text-red-800' :
                  'bg-orange-100 text-orange-800 border border-orange-200'
                }`}>
                  {visita.estado === 'PROGRAMADA' ? 'PENDIENTE' : (visita.estado || 'PENDIENTE').toUpperCase()}
                </span>
                <span>•</span>
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {getTipoText(visita.motivo_visita)}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Cuerpo Scrollable */}
        <div className="space-y-6 overflow-y-auto p-6 bg-gray-50/50">
          
          {/* Tarjeta 1: Obra y Cliente */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-gray-900 uppercase tracking-wider">Destino Geográfico</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-gray-100 p-2">
                  <MapPin className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Dirección</p>
                  <p className="font-semibold text-gray-900">{direccion}</p>
                  {visita.localidad && (
                    <p className="text-xs text-gray-500">{visita.localidad.nombre_localidad}</p>
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

          {/* Tarjeta 2: Tiempos y Fechas */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="h-4 w-4" /> Cronograma Logístico
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs font-medium text-indigo-600/80 mb-1">Visita en el Lugar (Pactada)</p>
                <div className="font-medium text-indigo-900 bg-white border border-indigo-100 rounded-lg px-3 py-2 text-sm">
                  {formatDateTime(visita.fecha_hora_visita)}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Salida de Planta Estimada</p>
                <div className="font-medium text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50/50">
                  {formatDateTime(fechaSalida || visita.fecha_hora_visita)}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Regreso a Planta Estimado</p>
                <div className="font-medium text-gray-800 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50/50">
                  {formatDateTime(fechaRegreso)}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Columna Izquierda: Personal Asignado */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-gray-900 uppercase tracking-wider">Equipo Técnico</h3>
              <div className="space-y-4">
                {encargado ? (
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-100 p-2 text-blue-600 font-bold text-xs w-8 h-8 flex items-center justify-center">
                      {encargado.empleado?.nombre[0]}{encargado.empleado?.apellido[0]}
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
                   <div className="flex items-start gap-3 pt-2 border-t border-gray-100">
                    <div className="rounded-lg bg-green-50 p-2 mt-1">
                      <Briefcase className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Acompañantes ({acompañantes.length})</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {acompañantes.map((a, i) => (
                          <span key={i} className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                            {a.empleado?.nombre} {a.empleado?.apellido}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Columna Derecha: Vehículo y Viáticos */}
            <div className="flex flex-col gap-6">
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex-1">
                <h3 className="mb-4 text-sm font-bold text-gray-900 uppercase tracking-wider">Transporte</h3>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <Car className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Vehículo Asignado</p>
                    {usoVehiculo ? (
                      <div>
                        <p className="font-bold text-gray-900">{usoVehiculo.vehiculo?.patente || usoVehiculo.patente}</p>
                        <p className="text-xs text-gray-500">{usoVehiculo.vehiculo?.marca} {usoVehiculo.vehiculo?.modelo}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Sin vehículo asignado</p>
                    )}
                  </div>
                </div>
              </div>

              {visita.dias_viaticos && visita.dias_viaticos > 0 && (
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm">
                  <h3 className="mb-2 text-sm font-bold text-yellow-900 uppercase tracking-wider">Viáticos</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-yellow-700">Días proyectados:</p>
                    <p className="text-xl font-black text-yellow-900">{visita.dias_viaticos}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fila Inferior: Notas de Carga/Coordinación */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" /> Notas de Coordinación
            </h3>
            <div className="bg-blue-50/30 p-4 rounded-lg border border-blue-50/50">
              <p className="text-gray-800 text-sm leading-relaxed bg-white rounded-md p-3 border border-blue-100 shadow-sm">
                {visita.observaciones || 'Sin observaciones adicionales proporcionadas.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

