'use client'

import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Truck, Phone, Mail, MapPin, Calendar } from 'lucide-react'
import type { EntregaEmpleado } from '@/types'

interface EntregaDetailsProps {
  entrega: EntregaEmpleado
  onFinalizarEntrega: () => void
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

const formatDateTime = (dateString: string) =>
  new Date(dateString).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

export default function EntregaDetails({
  entrega,
  onFinalizarEntrega,
}: EntregaDetailsProps) {
  const isEntregaPendiente = entrega.entrega.estado === 'PENDIENTE'

  return (
    <Card className="mx-auto max-w-3xl border-gray-200 bg-white shadow-lg">
      <CardContent className="space-y-6 p-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Entrega #{entrega.entrega.cod_entrega}
            </h2>
            <p className="text-lg text-gray-600">
              {entrega.obra.cliente?.razon_social || 'Cliente no especificado'}
            </p>
            <div className="mt-2 flex items-center space-x-2">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  entrega.entrega.estado === 'PENDIENTE'
                    ? 'bg-yellow-100 text-yellow-800'
                    : entrega.entrega.estado === 'ENTREGADO'
                      ? 'bg-green-100 text-green-800'
                      : entrega.entrega.estado === 'EN CURSO'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                }`}
              >
                {entrega.entrega.estado}
              </span>
              <span className="text-sm text-gray-500">
                Rol: {entrega.rol_entrega}
              </span>
            </div>
          </div>
          <Truck className="h-12 w-12 text-gray-300" />
        </div>

        <div className="grid grid-cols-1 gap-4 border-t pt-6 text-sm md:grid-cols-2">
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-gray-400" />
            <span>{entrega.obra.cliente?.telefono || 'No disponible'}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <span>{entrega.obra.cliente?.mail || 'No disponible'}</span>
          </div>
          <div className="col-span-2 flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-gray-400" />
            <span>{entrega.obra.direccion}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span>
              Programada: {formatDateTime(entrega.entrega.fecha_hora_entrega)}
            </span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700">
            Detalles de la entrega
          </h4>
          <p className="mt-1 rounded-md border bg-gray-50 p-3 text-gray-600">
            {entrega.entrega.detalle || 'Sin detalles especificados'}
          </p>
        </div>

        {entrega.entrega.observaciones && (
          <div>
            <h4 className="font-semibold text-gray-700">Observaciones</h4>
            <p className="mt-1 rounded-md border bg-gray-50 p-3 text-gray-600">
              {entrega.entrega.observaciones}
            </p>
          </div>
        )}

        <div className="flex space-x-4 border-t pt-6">
          <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
            <MapPin className="mr-2 h-4 w-4" /> Ruta de Entrega
          </Button>

          {isEntregaPendiente && (
            <Button
              onClick={onFinalizarEntrega}
              className="flex-1 bg-green-600 text-white hover:bg-green-700"
            >
              Finalizar Entrega
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
