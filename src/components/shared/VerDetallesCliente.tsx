'use client'

import { useEffect, useState } from 'react'
import {
  X,
  Building2,
  MapPin,
  Calendar,
  Loader2,
  DollarSign,
  Truck,
  ClipboardList,
} from 'lucide-react'
import { getCliente } from '@/actions/clientes'
import { getObras } from '@/actions/obras'
import type { Cliente, Obra, VerDetallesClienteProps } from '@/types'

export default function VerDetallesCliente({
  cuil,
  onClose,
}: VerDetallesClienteProps) {
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [obras, setObras] = useState<Obra[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargar() {
      try {
        setLoading(true)
        const clienteData = await getCliente(cuil)
        setCliente(clienteData)

        // Buscar obras del cliente usando su razón social o nombre
        let obrasData: Obra[] = []
        if (clienteData) {
          const searchTerm =
            clienteData.razon_social ||
            `${clienteData.nombre} ${clienteData.apellido}`
          obrasData = await getObras(searchTerm)
        }
        setObras(obrasData || [])
      } catch (error) {
        console.error('Error cargando detalles:', error)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [cuil])

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-4xl rounded-xl bg-white p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="mt-4 text-gray-600">Cargando detalles...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!cliente) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-4xl rounded-xl bg-white p-8">
          <p className="text-center text-gray-600">Cliente no encontrado</p>
          <button
            onClick={onClose}
            className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    )
  }

  const esEmpresa = cliente.tipo_cliente === 'EMPRESA'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900">
            Detalles del Cliente
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-white hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="max-h-[80vh] overflow-y-auto p-6">
          {/* Información del cliente */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              {esEmpresa ? (
                <Building2 className="h-5 w-5" />
              ) : (
                <Calendar className="h-5 w-5" />
              )}
              Información General
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {esEmpresa ? 'Razón Social' : 'Nombre Completo'}
                </p>
                <p className="mt-1 font-semibold text-gray-900">
                  {esEmpresa
                    ? cliente.razon_social
                    : `${cliente.nombre} ${cliente.apellido}`}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">CUIL</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {cliente.cuil}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {cliente.mail}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {cliente.telefono}
                </p>
              </div>
              {!esEmpresa && cliente.sexo && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Sexo</p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {cliente.sexo === 'M' ? 'Masculino' : 'Femenino'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Obras asociadas */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <MapPin className="h-5 w-5" />
              Obras Asociadas ({obras.length})
            </h3>
            {obras.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                <p className="text-gray-600">No hay obras asociadas</p>
              </div>
            ) : (
              <div className="space-y-3">
                {obras.map((obra) => {
                  const pagos = obra.pagos ?? obra.pago ?? []
                  const visitas = obra.visitas ?? obra.visita ?? []
                  const entregas = obra.entregas ?? obra.entrega ?? []

                  const cantidadPagosPendientes = pagos.length
                  const tienePagosPendientes =
                    obra.estado === 'EN ESPERA DE PAGO' ||
                    obra.estado === 'PAGADA PARCIALMENTE'
                  const tieneVisitasPendientes = visitas.some(
                    (v) => v.estado !== 'COMPLETADA' && v.estado !== 'CANCELADA'
                  )
                  const tieneEntregasPendientes = entregas.some(
                    (e) => e.estado !== 'ENTREGADO' && e.estado !== 'CANCELADO'
                  )

                  return (
                    <div
                      key={obra.cod_obra}
                      className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-blue-300"
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">
                            {obra.direccion}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            Estado: {obra.estado}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            title="Pagos pendientes"
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${
                              tienePagosPendientes
                                ? 'border-amber-300 bg-amber-50 text-amber-700'
                                : 'border-emerald-300 bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            <DollarSign className="h-3.5 w-3.5" />
                            {tienePagosPendientes
                              ? `Pagos: ${cantidadPagosPendientes}`
                              : 'Pagos: 0'}
                          </span>

                          <span
                            title="Visitas pendientes"
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${
                              tieneVisitasPendientes
                                ? 'border-blue-300 bg-blue-50 text-blue-700'
                                : 'border-emerald-300 bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            <ClipboardList className="h-3.5 w-3.5" />
                            {tieneVisitasPendientes
                              ? 'Visitas: pendientes'
                              : 'Visitas: ok'}
                          </span>

                          <span
                            title="Entregas pendientes"
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${
                              tieneEntregasPendientes
                                ? 'border-orange-300 bg-orange-50 text-orange-700'
                                : 'border-emerald-300 bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            <Truck className="h-3.5 w-3.5" />
                            {tieneEntregasPendientes
                              ? 'Entregas: pendientes'
                              : 'Entregas: ok'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
