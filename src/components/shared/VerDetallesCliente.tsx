'use client'

import { useEffect, useState } from 'react'
import { X, Building2, MapPin, Calendar, Loader2 } from 'lucide-react'
import { getCliente } from '@/actions/clientes'
import { getClienteObras } from '@/actions/obras'
import type { Cliente, Obra } from '@/types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface VerDetallesClienteProps {
  cuil: string
  onClose: () => void
}

export default function VerDetallesCliente({
  cuil,
  onClose,
}: VerDetallesClienteProps) {
  const pathname = usePathname()
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [obras, setObras] = useState<Obra[]>([])
  const [loading, setLoading] = useState(true)
  const canViewObraDetails = pathname.startsWith('/admin')

  const getObraHref = (codObra: number) => {
    if (pathname.startsWith('/admin')) return `/admin/obras/${codObra}`
    if (pathname.startsWith('/ventas')) return '/ventas/obras'
    if (pathname.startsWith('/coordinacion')) return '/coordinacion/obras'
    return '/admin/obras'
  }

  useEffect(() => {
    async function cargar() {
      try {
        setLoading(true)
        const [clienteData, obrasData] = await Promise.all([
          getCliente(cuil),
          getClienteObras(cuil),
        ])
        setCliente(clienteData)
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
                {obras.map((obra) => (
                  <div
                    key={obra.cod_obra}
                    className="rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-300"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900">
                          {obra.direccion}
                        </p>
                        <p className="text-sm text-gray-600">
                          Estado: {obra.estado}
                        </p>
                        <p className="text-sm text-gray-600">
                          Inicio:{' '}
                          {new Date(obra.fecha_ini).toLocaleDateString('es-AR')}
                        </p>
                      </div>
                      {canViewObraDetails && (
                        <Link
                          href={getObraHref(obra.cod_obra)}
                          onClick={onClose}
                          className="inline-flex items-center self-start rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 sm:self-center"
                        >
                          Ver Detalles
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
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
