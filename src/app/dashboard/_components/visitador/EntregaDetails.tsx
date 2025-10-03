import {
  Calendar,
  CheckCircle,
  Mail,
  MapPin,
  Phone,
  Package,
  Truck,
} from 'lucide-react'
import type { Entrega } from '@/types'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

interface EntregaDetailsProps {
  entrega: Entrega
  onFinalizarEntrega: () => void
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

export default function EntregaDetails({
  entrega,
  onFinalizarEntrega,
}: EntregaDetailsProps) {
  return (
    <Card className="mx-auto max-w-3xl border-gray-200 bg-white shadow-lg">
      <CardContent className="space-y-6 p-8">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              Detalles de la Entrega
            </h3>
            <p className="text-gray-500">
              Cliente: {entrega.obra.cliente.nombre}{' '}
              {entrega.obra.cliente.apellido}
            </p>
          </div>
          <Package className="h-12 w-12 text-gray-300" />
        </div>
        <div className="grid grid-cols-1 gap-4 border-t pt-6 text-sm md:grid-cols-2">
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-gray-400" />
            <span>{entrega.obra.cliente.telefono}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <span>{entrega.obra.cliente.email}</span>
          </div>
          <div className="col-span-2 flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-gray-400" />
            <span>{entrega.direccionEntrega}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span>
              {formatDate(entrega.fecha)} a las {entrega.hora}hs
            </span>
          </div>
          {entrega.vehiculo && (
            <div className="flex items-center space-x-3">
              <Truck className="h-5 w-5 text-gray-400" />
              <span>{entrega.vehiculo}</span>
            </div>
          )}
        </div>
        <div>
          <h4 className="font-semibold text-gray-700">Observaciones</h4>
          <p className="mt-1 rounded-md border bg-gray-50 p-3 text-gray-600">
            {entrega.observaciones}
          </p>
        </div>
        <div className="flex space-x-4 border-t pt-6">
          <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
            <MapPin className="mr-2 h-4 w-4" /> Cómo llegar
          </Button>
          {(entrega.estado === 'PENDIENTE' ||
            entrega.estado === 'EN CURSO') && (
            <Button
              onClick={onFinalizarEntrega}
              className="flex-1 bg-green-600 text-white hover:bg-green-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Finalizar entrega
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
