import {
  Calendar,
  CheckCircle,
  Mail,
  MapPin,
  Phone,
  User as UserIcon,
  Navigation,
} from 'lucide-react'
import type { Visita } from '@/types'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { abrirGoogleMaps, navegarADireccion } from '@/lib/maps'

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

const formatDateTime = (dateString: string) =>
  new Date(dateString).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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
  const canFinalize =
    visita.estado === 'PROGRAMADA' || visita.estado === 'EN CURSO'

  // Función para obtener la dirección completa para navegación
  const getDireccionCompleta = () => {
    const direccion = visita.direccion_visita || visita.obra?.direccion
    const localidad = visita.obra?.localidad?.nombre_localidad

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
    <Card className="mx-auto max-w-6xl border-gray-200 bg-white shadow-lg">
      <CardContent className="space-y-6 p-6 lg:space-y-8 lg:p-12">
        {/* Header responsivo */}
        <div className="flex items-start justify-between space-x-4">
          <div className="flex-1">
            <h2 className="mb-2 text-2xl font-bold text-gray-900 lg:text-4xl">
              Detalles de la Visita
            </h2>
            <p className="mb-3 text-lg text-gray-600 lg:text-xl">
              {visita.obra?.cliente.razon_social || 'Visita sin obra asignada'}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold lg:px-5 lg:text-base ${getEstadoBadge(visita.estado)}`}
              >
                {visita.estado}
              </span>
              <span className="text-sm text-gray-500 lg:text-base">
                Motivo:{' '}
                <span className="font-medium">
                  {getMotivoText(visita.motivo_visita)}
                </span>
              </span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <UserIcon className="h-12 w-12 text-gray-300 sm:h-14 sm:w-14 lg:h-20 lg:w-20" />
          </div>
        </div>

        {/* Información de contacto responsiva */}
        {visita.obra && (
          <div className="grid grid-cols-1 gap-4 border-t pt-6 text-sm sm:grid-cols-2 lg:gap-6 lg:pt-8 lg:text-base">
            <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3 lg:space-x-4">
              <Phone className="h-5 w-5 text-gray-400 lg:h-6 lg:w-6" />
              <span className="break-all">{visita.obra.cliente.telefono}</span>
            </div>
            <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3 lg:space-x-4">
              <Mail className="h-5 w-5 text-gray-400 lg:h-6 lg:w-6" />
              <span className="break-all">{visita.obra.cliente.mail}</span>
            </div>
            <div className="col-span-1 flex items-center space-x-3 rounded-lg bg-gray-50 p-3 sm:col-span-2 lg:space-x-4">
              <MapPin className="h-5 w-5 text-gray-400 lg:h-6 lg:w-6" />
              <span className="break-words">
                {direccion}
                {localidad && `, ${localidad}`}
              </span>
            </div>
            <div className="col-span-1 flex items-center space-x-3 rounded-lg bg-gray-50 p-3 sm:col-span-2 lg:space-x-4">
              <Calendar className="h-5 w-5 text-gray-400 lg:h-6 lg:w-6" />
              <span>
                Programada: {formatDateTime(visita.fecha_hora_visita)}
              </span>
            </div>
          </div>
        )}

        {/* Información sin obra */}
        {!visita.obra && visita.direccion_visita && (
          <div className="grid grid-cols-1 gap-4 border-t pt-6 text-sm lg:gap-6 lg:pt-8 lg:text-base">
            <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3 lg:space-x-4">
              <MapPin className="h-5 w-5 text-gray-400 lg:h-6 lg:w-6" />
              <span className="break-words">{visita.direccion_visita}</span>
            </div>
            <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3 lg:space-x-4">
              <Calendar className="h-5 w-5 text-gray-400 lg:h-6 lg:w-6" />
              <span>
                Programada: {formatDateTime(visita.fecha_hora_visita)}
              </span>
            </div>
          </div>
        )}

        {/* Observaciones */}
        {visita.observaciones && (
          <div>
            <h4 className="mb-4 text-lg font-semibold text-gray-700 lg:text-2xl">
              Observaciones
            </h4>
            <p className="mt-4 rounded-md border bg-gray-50 p-3 text-base leading-relaxed text-gray-600 lg:p-5 lg:text-lg">
              {visita.observaciones}
            </p>
          </div>
        )}

        {/* Fecha de cancelación */}
        {visita.fecha_cancelacion && (
          <div>
            <h4 className="mb-4 text-lg font-semibold text-red-600 lg:text-2xl">
              Fecha de Cancelación
            </h4>
            <p className="mt-4 text-base text-gray-600 lg:text-lg">
              {formatDate(visita.fecha_cancelacion)}
            </p>
          </div>
        )}

        {/* Botones responsivos */}
        <div className="flex flex-col space-y-4 border-t pt-6 sm:flex-row sm:space-y-0 sm:space-x-3 lg:space-x-4 lg:pt-8">
          {/* Botones de navegación */}
          {tieneUbicacion && (
            <>
              <Button
                onClick={handleVerEnMapa}
                className="flex-1 cursor-pointer border border-blue-300 bg-white py-4 text-base text-blue-700 hover:bg-blue-50 sm:flex-initial lg:py-5 lg:text-lg"
              >
                <MapPin className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
                <span className="hidden sm:inline">Ver en mapa</span>
                <span className="sm:hidden">Mapa</span>
              </Button>
              <Button
                onClick={handleNavegar}
                className="flex-1 cursor-pointer bg-blue-600 py-4 text-base text-white hover:bg-blue-700 sm:flex-initial lg:py-5 lg:text-lg"
              >
                <Navigation className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
                <span className="hidden sm:inline">Cómo llegar</span>
                <span className="sm:hidden">Navegar</span>
              </Button>
            </>
          )}

          {/* Botón finalizar */}
          {canFinalize && (
            <Button
              onClick={onFinalizarVisita}
              className="flex-1 cursor-pointer bg-green-600 py-4 text-base text-white hover:bg-green-700 lg:py-5 lg:text-lg"
            >
              <CheckCircle className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
              <span className="hidden sm:inline">Finalizar visita</span>
              <span className="sm:hidden">Finalizar</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
