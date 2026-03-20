'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  X,
  Truck,
  Calendar,
  Clock,
  Shield,
  Users,
  Wrench,
  Package,
} from 'lucide-react'
import type { Entrega } from '@/types'
import { getActualViatico } from '@/actions/parametros'

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

export default function EntregaDetailsModal({
  isOpen,
  entrega,
  onClose,
}: EntregaDetailsModalProps) {
  const [viaticoPorDia, setViaticoPorDia] = useState(0)

  useEffect(() => {
    if (isOpen) {
      getActualViatico().then((params) => {
        setViaticoPorDia(params.viatico_dia_persona)
      })
    }
  }, [isOpen])

  const totalViaticos = useMemo(() => {
    if (!entrega || !entrega.dias_viaticos || viaticoPorDia <= 0) {
      return 0
    }
    const cantidadPersonas = entrega.empleados_asignados?.length || 0
    return entrega.dias_viaticos * cantidadPersonas * viaticoPorDia
  }, [entrega, viaticoPorDia])

  if (!isOpen || !entrega) return null

  const encargado = entrega.empleados_asignados?.find(
    (e) => e.rol_entrega === 'ENCARGADO'
  )
  const acompanantes = entrega.empleados_asignados?.filter(
    (e) => e.rol_entrega !== 'ENCARGADO'
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-xl bg-white shadow-2xl">
        <div className="flex flex-shrink-0 items-center justify-between border-b p-6">
          <div className="flex items-center gap-3">
            <Truck className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Detalles de la Entrega #{entrega.cod_entrega}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-6 rounded-lg border bg-gray-50 p-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-500">Obra</label>
              <p className="font-semibold text-gray-800">
                {entrega.obra.direccion}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Cliente
              </label>
              <p className="font-semibold text-gray-800">
                {entrega.obra.cliente.razon_social ||
                  `${entrega.obra.cliente.nombre} ${entrega.obra.cliente.apellido}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Fecha
                </label>
                <p>
                  {new Date(entrega.fecha_hora_entrega).toLocaleDateString(
                    'es-AR'
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Hora
                </label>
                <p>
                  {new Date(entrega.fecha_hora_entrega).toLocaleTimeString(
                    'es-AR',
                    { hour: '2-digit', minute: '2-digit' }
                  )}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">Personal Asignado</h3>
            <div className="space-y-3">
              {encargado && (
                <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">Encargado</p>
                    <p className="text-sm text-gray-700">
                      {encargado.empleado.nombre} {encargado.empleado.apellido}
                    </p>
                  </div>
                </div>
              )}
              {acompanantes && acompanantes.length > 0 && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                  <div className="mb-2 flex items-center gap-3">
                    <Users className="h-5 w-5 text-green-700" />
                    <p className="font-semibold">
                      Acompañantes ({acompanantes.length})
                    </p>
                  </div>
                  <ul className="list-disc pl-10 text-sm text-gray-700">
                    {acompanantes.map((a, i) => (
                      <li key={a?.empleado?.cuil ? `${entrega.cod_entrega}-${a.empleado.cuil}` : `acomp-${i}`}>
                        {a.empleado?.nombre} {a.empleado?.apellido}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {entrega.orden_de_produccion && (
            <div>
              <h3 className="mb-3 text-lg font-semibold">
                Orden de Producción Asociada
              </h3>
              <div className="flex items-center justify-between rounded-lg border border-indigo-200 bg-indigo-50 p-3">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="font-semibold text-indigo-800">
                      Orden #{entrega.orden_de_produccion.cod_op}
                    </p>
                    <p className="text-xs text-gray-500">
                      Confección:{' '}
                      {new Date(
                        entrega.orden_de_produccion.fecha_confeccion
                      ).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                </div>
                <a
                  href={entrega.orden_de_produccion.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Ver PDF
                </a>
              </div>
            </div>
          )}

          {entrega.dias_viaticos && entrega.dias_viaticos > 0 && (
            <div>
              <h3 className="mb-3 text-lg font-semibold">Costo de Viáticos</h3>
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-yellow-800">
                    Monto total calculado:
                  </p>
                  <p className="text-xl font-bold text-yellow-900">
                    {formatCurrency(totalViaticos)}
                  </p>
                </div>
                <p className="mt-1 text-xs text-yellow-700">
                  ({entrega.dias_viaticos} días x{' '}
                  {entrega.empleados_asignados.length} personas x{' '}
                  {formatCurrency(viaticoPorDia)}/día)
                </p>
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-3 text-lg font-semibold">Recursos Utilizados</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-gray-100 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-gray-600" />
                  <p className="font-medium">Vehículos</p>
                </div>
                {entrega.vehiculos &&
                entrega.vehiculos.length > 0 ? (
                  <ul className="list-disc pl-8 text-sm text-gray-700">
                    {entrega.vehiculos.map((v, index) => {
                      const veh = v.vehiculo || v as any // fallback while normalizing
                      return (
                        <li key={veh?.patente || `veh-${index}`}>
                          {veh?.marca ? `${veh.marca} ${veh.modelo || ''} (${veh.patente})` : veh?.patente || 'Vehículo'}
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="pl-8 text-sm text-gray-500">No especificados</p>
                )}
              </div>
              <div className="rounded-lg bg-gray-100 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-gray-600" />
                  <p className="font-medium">Maquinaria</p>
                </div>
                {entrega.maquinarias &&
                entrega.maquinarias.length > 0 ? (
                  <ul className="list-disc pl-8 text-sm text-gray-700">
                    {entrega.maquinarias.map((m, index) => {
                      const maq = m.maquinaria || m as any
                      return <li key={maq?.cod_maquina || `maq-${index}`}>{maq?.descripcion || 'Maquinaria'}</li>
                    })}
                  </ul>
                ) : (
                  <p className="pl-8 text-sm text-gray-500">Ninguna</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">
              Información Adicional
            </h3>
            <div className="space-y-2 rounded-lg border bg-gray-50 p-4 text-sm text-gray-700">
              <p>
                <strong className="font-medium">Detalle:</strong>{' '}
                {entrega.detalle}
              </p>
              <p>
                <strong className="font-medium">Observaciones:</strong>{' '}
                {entrega.observaciones || 'Ninguna'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
