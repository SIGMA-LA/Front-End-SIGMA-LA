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
    <Card className="mx-auto max-w-4xl border-gray-200 bg-white shadow-lg">
      <CardContent className="space-y-4 p-4 lg:space-y-6 lg:p-8">
        {/* Header responsivo */}
        <div className="flex flex-col items-start justify-between space-y-3 sm:flex-row sm:items-center sm:space-y-0">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold text-gray-800 lg:text-2xl">
                Detalles de la Visita
              </h3>
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold lg:px-3 ${getEstadoBadge(visita.estado)}`}
              >
                {visita.estado}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500 lg:text-base">
              {visita.obra?.cuil_cliente || 'Visita sin obra asignada'}
            </p>
            <p className="text-xs text-gray-400 lg:text-sm">
              Motivo: {getMotivoText(visita.motivo_visita)}
            </p>
          </div>
          <UserIcon className="h-10 w-10 text-gray-300 lg:h-12 lg:w-12" />
        </div>

        {/* Información de contacto responsiva */}
        {visita.obra && (
          <div className="grid grid-cols-1 gap-3 border-t pt-4 text-xs sm:grid-cols-2 lg:gap-4 lg:pt-6 lg:text-sm">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <Phone className="h-4 w-4 text-gray-400 lg:h-5 lg:w-5" />
              <span className="break-all">{visita.obra.cliente.telefono}</span>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-3">
              <Mail className="h-4 w-4 text-gray-400 lg:h-5 lg:w-5" />
              <span className="break-all">{visita.obra.cliente.mail}</span>
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
                Programada: {formatDateTime(visita.fecha_hora_visita)}
              </span>
            </div>
          </div>
        )}

        {/* Información sin obra */}
        {!visita.obra && visita.direccion_visita && (
          <div className="grid grid-cols-1 gap-3 border-t pt-4 text-xs lg:gap-4 lg:pt-6 lg:text-sm">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <MapPin className="h-4 w-4 text-gray-400 lg:h-5 lg:w-5" />
              <span className="break-words">{visita.direccion_visita}</span>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-3">
              <Calendar className="h-4 w-4 text-gray-400 lg:h-5 lg:w-5" />
              <span>
                Programada: {formatDateTime(visita.fecha_hora_visita)}
              </span>
            </div>
          </div>
        )}

        {/* Observaciones */}
        {visita.observaciones && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 lg:text-base">
              Observaciones
            </h4>
            <p className="mt-2 rounded-md border bg-gray-50 p-3 text-xs text-gray-600 lg:text-sm">
              {visita.observaciones}
            </p>
          </div>
        )}

        {/* Fecha de cancelación */}
        {visita.fecha_cancelacion && (
          <div>
            <h4 className="text-sm font-semibold text-red-600 lg:text-base">
              Fecha de Cancelación
            </h4>
            <p className="mt-1 text-xs text-gray-600 lg:text-sm">
              {formatDate(visita.fecha_cancelacion)}
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
          {canFinalize && (
            <Button
              onClick={onFinalizarVisita}
              className="flex-1 bg-green-600 text-white hover:bg-green-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Finalizar visita</span>
              <span className="sm:hidden">Finalizar</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
