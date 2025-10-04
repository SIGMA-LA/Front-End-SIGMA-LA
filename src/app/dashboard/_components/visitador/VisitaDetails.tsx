import {
  Calendar,
  CheckCircle,
  Mail,
  MapPin,
  Phone,
  User as UserIcon,
} from 'lucide-react'
import type { Visita } from '@/types'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

interface VisitaDetailsProps {
  visita: Visita
  onFinalizarVisita: () => void
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

const getEstadoBadge = (estado: Visita['estado']) => {
  const badges = {
    PROGRAMADA: 'bg-blue-100 text-blue-800',
    'EN CURSO': 'bg-yellow-100 text-yellow-800',
    COMPLETADA: 'bg-green-100 text-green-800',
    CANCELADA: 'bg-red-100 text-red-800',
    REPROGRAMADA: 'bg-purple-100 text-purple-800',
  }
  return badges[estado] || 'bg-gray-100 text-gray-800'
}

const getMotivoText = (motivo: Visita['motivo_visita']) => {
  const motivos = {
    MEDICION: 'Medición',
    'RE-MEDICION': 'Re-medición',
    REPARACION: 'Reparación',
    ASESORAMIENTO: 'Asesoramiento',
    'VISITA INICIAL': 'Visita Inicial',
  }
  return motivos[motivo] || motivo
}

export default function VisitaDetails({
  visita,
  onFinalizarVisita,
}: VisitaDetailsProps) {
  // Verificar si se puede finalizar la visita
  const canFinalize = visita.estado === 'PROGRAMADA' || visita.estado === 'EN CURSO'

  return (
    <Card className="mx-auto max-w-3xl border-gray-200 bg-white shadow-lg">
      <CardContent className="space-y-6 p-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h3 className="text-2xl font-bold text-gray-800">
                Detalles de la Visita
              </h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getEstadoBadge(visita.estado)}`}
              >
                {visita.estado}
              </span>
            </div>
            <p className="mt-1 text-gray-500">
              {visita.obra?.cliente.razon_social || 'Sin obra asignada'}
            </p>
            <p className="text-sm text-gray-400">
              Motivo: {getMotivoText(visita.motivo_visita)}
            </p>
          </div>
          <UserIcon className="h-12 w-12 text-gray-300" />
        </div>

        {visita.obra && (
          <div className="grid grid-cols-1 gap-4 border-t pt-6 text-sm md:grid-cols-2">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <span>{visita.obra.cliente.telefono}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <span>{visita.obra.cliente.mail}</span>
            </div>
            <div className="col-span-2 flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span>{visita.direccion_visita || visita.obra.direccion}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span>{formatDate(visita.fecha_hora_visita)}</span>
            </div>
          </div>
        )}

        {!visita.obra && visita.direccion_visita && (
          <div className="border-t pt-6">
            <div className="flex items-center space-x-3 text-sm">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span>{visita.direccion_visita}</span>
            </div>
            <div className="mt-2 flex items-center space-x-3 text-sm">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span>{formatDate(visita.fecha_hora_visita)}</span>
            </div>
          </div>
        )}

        {visita.observaciones && (
          <div>
            <h4 className="font-semibold text-gray-700">Observaciones</h4>
            <p className="mt-1 rounded-md border bg-gray-50 p-3 text-gray-600">
              {visita.observaciones}
            </p>
          </div>
        )}

        {visita.fecha_cancelacion && (
          <div>
            <h4 className="font-semibold text-red-600">Fecha de Cancelación</h4>
            <p className="mt-1 text-sm text-gray-600">
              {formatDate(visita.fecha_cancelacion)}
            </p>
          </div>
        )}

        <div className="flex space-x-4 border-t pt-6">
          <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
            <MapPin className="mr-2 h-4 w-4" /> Cómo llegar
          </Button>
          {canFinalize && (
            <Button
              onClick={onFinalizarVisita}
              className="flex-1 bg-green-600 text-white hover:bg-green-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Finalizar visita
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}