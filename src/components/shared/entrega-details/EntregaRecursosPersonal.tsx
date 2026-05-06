'use client'

import { Shield, Users, Truck, Wrench } from 'lucide-react'
import type { Entrega, Vehiculo, Maquinaria } from '@/types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount)
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EntregaRecursosPersonalProps {
  entrega: Entrega
  viaticoPorDia: number
  totalViaticos: number
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EntregaRecursosPersonal({
  entrega,
  viaticoPorDia,
  totalViaticos,
}: EntregaRecursosPersonalProps) {
  const encargado = entrega.entrega_empleado?.find((e) => e.rol_entrega === 'ENCARGADO')
  const acompanantes = entrega.entrega_empleado?.filter((e) => e.rol_entrega !== 'ENCARGADO')

  return (
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
                  <p className="text-xs font-medium text-gray-500">Encargado entrega</p>
                  <p className="font-semibold text-gray-900">
                    {encargado.empleado.nombre} {encargado.empleado.apellido}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No hay encargado designado.</p>
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
      </div>

      {/* Columna Derecha: Recursos */}
      <div className="flex h-full flex-col gap-6">
        <div className="flex flex-1 flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-bold tracking-wider text-gray-900 uppercase">
            Flota y Maquinaria
          </h3>

          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Truck className="h-4 w-4 text-gray-500" />
                <p className="text-xs font-medium text-gray-500">Vehículos Desplegados</p>
              </div>
              {entrega.vehiculos && entrega.vehiculos.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {entrega.vehiculos.map((v, index) => {
                    const veh = ('vehiculo' in v ? v.vehiculo : v) as Vehiculo
                    return (
                      <div key={index} className="flex items-center justify-start py-1">
                        <span className="rounded-md border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm">
                          {veh?.patente} {veh?.marca ? `- ${veh.marca}` : ''} {veh?.modelo || ''}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="pl-6 text-sm text-gray-500 italic">Ninguno especificado</p>
              )}
            </div>

            <div className="border-t border-gray-50 pt-2">
              <div className="mb-2 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-gray-500" />
                <p className="text-xs font-medium text-gray-500">Maquinaria Especial</p>
              </div>
              {entrega.maquinarias && entrega.maquinarias.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {entrega.maquinarias.map((m, index) => {
                    const maq = ('maquinaria' in m ? m.maquinaria : m) as Maquinaria
                    return (
                      <div key={index} className="flex items-center justify-start py-1">
                        <span className="rounded-md border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm">
                          {maq?.descripcion || 'Maquinaria genérica'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="pl-6 text-sm text-gray-500 italic">Ninguna requerida</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
