import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  Truck,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  Navigation,
} from 'lucide-react'
import type { EntregaEmpleado } from '@/types'
import { abrirGoogleMaps, navegarADireccion } from '@/lib/maps'

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
  const isEncargado = entrega.rol_entrega === 'ENCARGADO'

  // Función para obtener la dirección completa para navegación
  const getDireccionCompleta = () => {
    const direccion = entrega.obra.direccion
    const localidad = entrega.obra.localidad?.nombre_localidad
    console.log({ direccion, localidad })
    return { direccion, localidad }
  }

  const handleVerEnMapa = () => {
    const { direccion, localidad } = getDireccionCompleta()
    if (direccion) {
      abrirGoogleMaps(direccion, localidad)
    }
  }

  const handleNavegar = () => {
    const { direccion, localidad } = getDireccionCompleta()
    if (direccion) {
      navegarADireccion(direccion, localidad)
    }
  }

  const { direccion, localidad } = getDireccionCompleta()
  const tieneUbicacion = !!direccion

  return (
    <Card className="mx-auto max-w-4xl border-gray-200 bg-white shadow-lg">
      <CardContent className="space-y-4 p-4 lg:space-y-6 lg:p-8">
        {/* Header responsivo */}
        <div className="flex flex-col items-start justify-between space-y-3 sm:flex-row sm:items-center sm:space-y-0">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 lg:text-2xl">
              Entrega #{entrega.entrega.cod_entrega}
            </h2>
            <p className="text-base text-gray-600 lg:text-lg">
              {entrega.obra.cliente?.razon_social || 'Cliente no especificado'}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold lg:px-3 ${
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
              <span className="text-xs text-gray-500 lg:text-sm">
                Rol: {entrega.rol_entrega}
              </span>
            </div>
          </div>
          <Truck className="h-10 w-10 text-gray-300 lg:h-12 lg:w-12" />
        </div>

        {/* Información de contacto responsiva */}
        <div className="grid grid-cols-1 gap-3 border-t pt-4 text-xs sm:grid-cols-2 lg:gap-4 lg:pt-6 lg:text-sm">
          <div className="flex items-center space-x-2 lg:space-x-3">
            <Phone className="h-4 w-4 text-gray-400 lg:h-5 lg:w-5" />
            <span className="break-all">
              {entrega.obra.cliente?.telefono || 'No disponible'}
            </span>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-3">
            <Mail className="h-4 w-4 text-gray-400 lg:h-5 lg:w-5" />
            <span className="break-all">
              {entrega.obra.cliente?.mail || 'No disponible'}
            </span>
          </div>
          <div className="col-span-1 flex items-center space-x-2 sm:col-span-2 lg:space-x-3">
            <MapPin className="h-4 w-4 text-gray-400 lg:h-5 lg:w-5" />
            <span className="break-words">
              {direccion}
              {localidad && `, ${localidad}`}
            </span>
          </div>
          <div className="col-span-1 flex items-center space-x-2 sm:col-span-2 lg:space-x-3">
            <Calendar className="h-4 w-4 text-gray-400 lg:h-5 lg:w-5" />
            <span>
              Programada: {formatDateTime(entrega.entrega.fecha_hora_entrega)}
            </span>
          </div>
        </div>

        {/* Detalles de la entrega */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 lg:text-base">
            Detalles de la entrega
          </h4>
          <p className="mt-2 rounded-md border bg-gray-50 p-3 text-xs text-gray-600 lg:text-sm">
            {entrega.entrega.detalle || 'Sin detalles especificados'}
          </p>
        </div>

        {/* Observaciones */}
        {entrega.entrega.observaciones && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 lg:text-base">
              Observaciones
            </h4>
            <p className="mt-2 rounded-md border bg-gray-50 p-3 text-xs text-gray-600 lg:text-sm">
              {entrega.entrega.observaciones}
            </p>
          </div>
        )}

        {/* Botones responsivos */}
        <div className="flex flex-col space-y-3 border-t pt-4 sm:flex-row sm:space-y-0 sm:space-x-2 lg:pt-6">
          {/* Botones de navegación */}
          {tieneUbicacion && (
            <>
              <Button
                onClick={handleVerEnMapa}
                className="flex-1 border border-blue-300 bg-white text-blue-700 hover:bg-blue-50 sm:flex-initial"
              >
                <MapPin className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Ver en mapa</span>
                <span className="sm:hidden">Mapa</span>
              </Button>
              <Button
                onClick={handleNavegar}
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700 sm:flex-initial"
              >
                <Navigation className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Cómo llegar</span>
                <span className="sm:hidden">Navegar</span>
              </Button>
            </>
          )}

          {/* Botón finalizar */}
          {isEntregaPendiente && isEncargado && (
            <Button
              onClick={onFinalizarEntrega}
              className="flex-1 bg-green-600 text-white hover:bg-green-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Finalizar Entrega</span>
              <span className="sm:hidden">Finalizar</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
