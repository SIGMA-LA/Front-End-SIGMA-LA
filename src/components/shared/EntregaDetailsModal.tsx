'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  X,
  Truck,
  CalendarClock,
  Shield,
  Users,
  Wrench,
  Package,
  MapPin,
  User,
  Info,
  CalendarRange,
} from 'lucide-react'
import type { Entrega, Vehiculo, Maquinaria, OrdenProduccion } from '@/types'
import { getActualViatico } from '@/actions/parametros'
import { getEntrega } from '@/actions/entregas'
import { DocumentViewer } from '@/components/shared/DocumentViewer'

interface EntregaDetailsModalProps {
  isOpen: boolean
  entrega: Entrega | null
  onClose: () => void
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount)
}

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

export default function EntregaDetailsModal({
  isOpen,
  entrega,
  onClose,
}: EntregaDetailsModalProps) {
  const [estaEntrega, setEstaEntrega] = useState<Entrega | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viaticoPorDia, setViaticoPorDia] = useState(0)
  const [activeOpIndex, setActiveOpIndex] = useState(0)
  const [viewerUrl, setViewerUrl] = useState('')
  const [viewerTitle, setViewerTitle] = useState('')
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  useEffect(() => {
    if (isOpen && entrega) {
      async function fetchData() {
        setLoading(true)
        setError(null)
        try {
          const [entregaData, params] = await Promise.all([
            getEntrega(entrega!.cod_entrega),
            getActualViatico(),
          ])
          setEstaEntrega(entregaData)
          setViaticoPorDia(params.viatico_dia_persona)
        } catch (err: unknown) {
          setError('Error al cargar los detalles de la entrega')
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    } else if (!isOpen) {
      setEstaEntrega(null)
    }
  }, [isOpen, entrega?.cod_entrega])

  // Reset active OP tab on entrega change
  useEffect(() => {
    setActiveOpIndex(0)
    setIsViewerOpen(false)
  }, [estaEntrega?.cod_entrega])

  const totalViaticos = useMemo(() => {
    if (!estaEntrega || !estaEntrega.dias_viaticos || viaticoPorDia <= 0) {
      return 0
    }
    const cantidadPersonas = estaEntrega.entrega_empleado?.length || 0
    return estaEntrega.dias_viaticos * cantidadPersonas * viaticoPorDia
  }, [estaEntrega, viaticoPorDia])

  if (!isOpen) return null

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-2xl bg-white p-12 text-center shadow-2xl">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 font-medium tracking-tight text-gray-600">
            Cargando detalles de entrega...
          </p>
        </div>
      </div>
    )
  }

  if (error || !estaEntrega) {
    if (!estaEntrega && !loading) return null
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
          <div className="mb-4 flex justify-center text-red-500">
            <X className="h-12 w-12 rounded-full bg-red-50 p-2" />
          </div>
          <p className="font-bold text-gray-700">
            {error || 'No se encontró la entrega.'}
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

  const encargado = estaEntrega.entrega_empleado?.find(
    (e) => e.rol_entrega === 'ENCARGADO'
  )
  const acompanantes = estaEntrega.entrega_empleado?.filter(
    (e) => e.rol_entrega !== 'ENCARGADO'
  )

  const nombreCliente =
    estaEntrega.obra.cliente?.tipo_cliente === 'EMPRESA'
      ? estaEntrega.obra.cliente.razon_social
      : `${estaEntrega.obra.cliente?.nombre ?? ''} ${estaEntrega.obra.cliente?.apellido ?? ''}`.trim() ||
        'N/A'

  // Fechas avanzadas en base al primer vehiculo mapeado (si existe)
  const vehiculoData = estaEntrega.vehiculos?.[0] as
    | { fecha_hora_ini_uso?: string; fecha_hora_ini_est?: string }
    | undefined
  const fechaSalida = vehiculoData?.fecha_hora_ini_uso
  const fechaRegreso = vehiculoData?.fecha_hora_ini_est

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
          {/* Encabezado */}
          <div className="flex flex-shrink-0 items-center justify-between border-b bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    Detalles de Entrega #{estaEntrega.cod_entrega}
                  </h2>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[0.65rem] font-bold tracking-wider uppercase shadow-sm ${
                      estaEntrega.esFinal
                        ? 'border-indigo-200 bg-indigo-100 text-indigo-700'
                        : 'border-cyan-200 bg-cyan-100 text-cyan-700'
                    }`}
                  >
                    {estaEntrega.esFinal ? 'Final' : 'Parcial'}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      estaEntrega.estado === 'ENTREGADO'
                        ? 'bg-green-100 text-green-800'
                        : estaEntrega.estado === 'CANCELADO'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {estaEntrega.estado}
                  </span>
                  <span>•</span>
                  <span>Programada vía Coordinación</span>
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
          <div className="space-y-6 overflow-y-auto bg-gray-50/50 p-6">
            {/* Tarjeta 1: Obra y Cliente */}
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
                    <p className="text-xs font-medium text-gray-500">
                      Dirección de Obra
                    </p>
                    <p className="font-semibold text-gray-900">
                      {estaEntrega.obra.direccion}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">
                      Cliente Titular
                    </p>
                    <p className="font-semibold text-gray-900">
                      {nombreCliente}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta 2: Tiempos y Fechas */}
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-5 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-indigo-900 uppercase">
                <CalendarRange className="h-4 w-4" /> Cronograma Logístico
              </h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <p className="mb-1 text-xs font-medium text-indigo-600/80">
                    Llegada al Cliente (Pactada)
                  </p>
                  <div className="rounded-lg border border-indigo-100 bg-white px-3 py-2 text-sm font-medium text-indigo-900">
                    {formatDateTime(estaEntrega.fecha_hora_entrega)}
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium text-gray-500">
                    Salida de Planta Estimada
                  </p>
                  <div className="rounded-lg border border-gray-200 bg-gray-50/50 bg-white px-3 py-2 text-sm font-medium text-gray-800">
                    {formatDateTime(
                      fechaSalida || estaEntrega.fecha_hora_entrega
                    )}
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-xs font-medium text-gray-500">
                    Regreso a Planta Estimado
                  </p>
                  <div className="rounded-lg border border-gray-200 bg-gray-50/50 bg-white px-3 py-2 text-sm font-medium text-gray-800">
                    {formatDateTime(fechaRegreso)}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
              {/* Columna Izquierda: Personal y Viáticos */}
              <div className="flex flex-col gap-6">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-sm font-bold tracking-wider text-gray-900 uppercase">
                    Personal Asignado
                  </h3>
                  <div className="space-y-4">
                    {encargado ? (
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-blue-100 p-2">
                          <Shield className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">
                            Encargado entrega
                          </p>
                          <p className="font-semibold text-gray-900">
                            {encargado.empleado.nombre}{' '}
                            {encargado.empleado.apellido}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No hay encargado designado.
                      </p>
                    )}

                    {acompanantes && acompanantes.length > 0 && (
                      <div className="flex items-start gap-3 border-t border-gray-100 pt-2">
                        <div className="mt-1 rounded-full bg-green-100 p-2">
                          <Users className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">
                            Acompañantes ({acompanantes.length})
                          </p>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {acompanantes.map((a, i) => (
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

                {estaEntrega.dias_viaticos && estaEntrega.dias_viaticos > 0 && (
                  <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm">
                    <h3 className="mb-2 text-sm font-bold tracking-wider text-yellow-900 uppercase">
                      Costo de Viáticos
                    </h3>
                    <div className="mt-3 flex items-end justify-between">
                      <div>
                        <p className="text-xs text-yellow-700">
                          Total {estaEntrega.dias_viaticos} días x{' '}
                          {estaEntrega.entrega_empleado?.length || 0} pers.
                        </p>
                        <p className="text-xs text-yellow-600">
                          Valor diario: {formatCurrency(viaticoPorDia)}
                        </p>
                      </div>
                      <p className="text-2xl font-black text-yellow-900">
                        {formatCurrency(totalViaticos)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Columna Derecha: OP, Recursos y Detalles */}
              <div className="flex h-full flex-col gap-6">
                {/* Sección de Órdenes de Producción */}
                {(() => {
                  const ops = estaEntrega.ordenes_de_produccion
                  if (!ops || ops.length === 0) return null

                  const activeOp: OrdenProduccion = ops[activeOpIndex] ?? ops[0]

                  return (
                    <div className="rounded-xl border border-purple-200 bg-purple-50 p-5 shadow-sm">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-purple-900 uppercase">
                          <Package className="h-4 w-4" />
                          {ops.length === 1
                            ? 'Orden de Producción Asociada'
                            : `Órdenes de Producción (${ops.length})`}
                        </h3>
                      </div>

                      {/* Tabs si hay más de 1 OP */}
                      {ops.length > 1 && (
                        <div className="mb-4 flex flex-wrap gap-1.5">
                          {ops.map((op, idx) => (
                            <button
                              key={op.cod_op}
                              onClick={() => setActiveOpIndex(idx)}
                              className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                                activeOpIndex === idx
                                  ? 'bg-purple-600 text-white shadow-md'
                                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                              }`}
                            >
                              OP #{op.cod_op}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Info de la OP activa */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-purple-100 p-2">
                            <Package className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-purple-600/80">
                              Orden Seleccionada
                            </p>
                            <p className="text-lg font-bold text-purple-900">
                              OP #{activeOp.cod_op}
                            </p>
                            <p className="text-xs text-purple-600/70">
                              Confeccionada:{' '}
                              {new Date(
                                activeOp.fecha_confeccion
                              ).toLocaleDateString('es-AR')}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setViewerUrl(activeOp.url)
                            setViewerTitle(
                              `Orden de Producción #${activeOp.cod_op}`
                            )
                            setIsViewerOpen(true)
                          }}
                          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-purple-700"
                        >
                          Ver Documento
                        </button>
                      </div>
                    </div>
                  )
                })()}

                <div className="flex flex-1 flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-sm font-bold tracking-wider text-gray-900 uppercase">
                    Flota y Maquinaria
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <Truck className="h-4 w-4 text-gray-500" />
                        <p className="text-xs font-medium text-gray-500">
                          Vehículos Desplegados
                        </p>
                      </div>
                      {estaEntrega.vehiculos &&
                      estaEntrega.vehiculos.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {estaEntrega.vehiculos.map((v, index) => {
                            const veh = (
                              'vehiculo' in v ? v.vehiculo : v
                            ) as Vehiculo
                            return (
                              <div
                                key={index}
                                className="flex items-center justify-start py-1"
                              >
                                <span className="rounded-md border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm">
                                  {veh?.patente}{' '}
                                  {veh?.marca ? `- ${veh.marca}` : ''}{' '}
                                  {veh?.modelo || ''}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="pl-6 text-sm text-gray-500 italic">
                          Ninguno especificado
                        </p>
                      )}
                    </div>

                    <div className="border-t border-gray-50 pt-2">
                      <div className="mb-2 flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-gray-500" />
                        <p className="text-xs font-medium text-gray-500">
                          Maquinaria Especial
                        </p>
                      </div>
                      {estaEntrega.maquinarias &&
                      estaEntrega.maquinarias.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {estaEntrega.maquinarias.map((m, index) => {
                            const maq = (
                              'maquinaria' in m ? m.maquinaria : m
                            ) as Maquinaria
                            return (
                              <div
                                key={index}
                                className="flex items-center justify-start py-1"
                              >
                                <span className="rounded-md border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm">
                                  {maq?.descripcion || 'Maquinaria genérica'}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="pl-6 text-sm text-gray-500 italic">
                          Ninguna requerida
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fila Inferior: Notas de Carga Full-Width */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold tracking-wider text-gray-900 uppercase">
                <Info className="h-4 w-4 text-blue-500" /> Notas de Carga
              </h3>
              <div className="space-y-4 rounded-lg border border-blue-50/50 bg-blue-50/30 p-4 text-sm text-gray-700">
                <div>
                  <span className="mb-1.5 block font-semibold text-gray-900">
                    Detalle de Transporte:
                  </span>
                  <p className="rounded-md border border-blue-100 bg-white p-3 text-sm leading-relaxed text-gray-800 shadow-sm">
                    {estaEntrega.detalle ||
                      'Sin detalle de carga proporcionado'}
                  </p>
                </div>

                {(estaEntrega.estado === 'ENTREGADO' ||
                  estaEntrega.estado === 'CANCELADO') && (
                  <div className="border-t border-blue-200 pt-4">
                    <span className="mb-1.5 block font-semibold text-gray-900">
                      Observaciones Extras:
                    </span>
                    <p
                      className={`rounded-md border p-3 text-sm ${estaEntrega.observaciones ? 'border-blue-50 bg-blue-100/40 text-gray-700 italic' : 'border-gray-100 bg-gray-50/50 text-gray-500'}`}
                    >
                      {estaEntrega.observaciones ||
                        'Sin observaciones adicionales registradas.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DocumentViewer
        url={viewerUrl}
        title={viewerTitle}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </>
  )
}
