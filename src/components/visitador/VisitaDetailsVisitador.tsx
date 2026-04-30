import { useState } from 'react'
import {
  Calendar,
  CheckCircle,
  Mail,
  MapPin,
  Phone,
  User as UserIcon,
  Navigation,
  FileText,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import type { Visita } from '@/types'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { abrirGoogleMaps, navegarADireccion } from '@/lib/maps'
import { useOrdenesProduccion } from '@/hooks/visitador/useOrdenesVisita'
import { DocumentViewer } from '@/components/shared/DocumentViewer'
import OrdenProduccionSeccion from '../shared/entrega-details/OrdenProduccionSeccion'

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
  const badges: Record<string, string> = {
    PROGRAMADA: 'bg-blue-100 text-blue-800',
    'EN CURSO': 'bg-yellow-100 text-yellow-800',
    COMPLETADA: 'bg-green-100 text-green-800',
    CANCELADA: 'bg-red-100 text-red-800',
    REPROGRAMADA: 'bg-purple-100 text-purple-800',
  }
  return (estado && badges[estado]) || 'bg-gray-100 text-gray-800'
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
  const {
    ordenes,
    loading: loadingOPs,
    error: errorOPs,
  } = useOrdenesProduccion(visita.obra?.cod_obra || null)
  const [activeOpIndex, setActiveOpIndex] = useState(0)
  const [viewerUrl, setViewerUrl] = useState('')
  const [viewerTitle, setViewerTitle] = useState('')
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  const handleVerDocumento = (url: string, title: string) => {
    setViewerUrl(url)
    setViewerTitle(title)
    setIsViewerOpen(true)
  }

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
    <Card className="mx-auto w-full max-w-7xl border-gray-200 bg-white shadow-lg lg:max-w-full">
      <CardContent className="flex flex-col gap-6 p-6 lg:gap-8 lg:p-10">
        {/* Header responsivo */}
        <div className="flex items-start justify-between space-x-4 border-b pb-6">
          <div className="flex-1">
            <h2 className="mb-2 text-2xl font-bold text-gray-900 lg:text-4xl">
              Visita #{visita.cod_visita}
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
            <UserIcon className="h-16 w-16 text-gray-300 sm:h-14 sm:w-14 lg:h-20 lg:w-20" />
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main Info Column */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            {/* Información de contacto responsiva */}
            {visita.obra && (
              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:gap-6 lg:text-base">
                <div className="flex items-center space-x-3 rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm lg:space-x-4">
                  <Phone className="h-5 w-5 text-blue-500 lg:h-6 lg:w-6" />
                  <span className="break-all">
                    {visita.obra.cliente.telefono}
                  </span>
                </div>
                <div className="flex items-center space-x-3 rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm lg:space-x-4">
                  <Mail className="h-5 w-5 text-blue-500 lg:h-6 lg:w-6" />
                  <span className="break-all">{visita.obra.cliente.mail}</span>
                </div>
                <div className="col-span-1 flex items-center space-x-3 rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm sm:col-span-2 lg:space-x-4">
                  <MapPin className="h-5 w-5 text-blue-500 lg:h-6 lg:w-6" />
                  <span className="break-words">
                    {direccion}
                    {localidad && `, ${localidad}`}
                  </span>
                </div>
                <div className="col-span-1 flex items-center space-x-3 rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm sm:col-span-2 lg:space-x-4">
                  <Calendar className="h-5 w-5 text-blue-500 lg:h-6 lg:w-6" />
                  <span>
                    Programada: {formatDateTime(visita.fecha_hora_visita)}
                  </span>
                </div>
              </div>
            )}

            {/* Información sin obra */}
            {!visita.obra && visita.direccion_visita && (
              <div className="grid grid-cols-1 gap-4 text-sm lg:gap-6 lg:text-base">
                <div className="flex items-center space-x-3 rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm lg:space-x-4">
                  <MapPin className="h-5 w-5 text-blue-500 lg:h-6 lg:w-6" />
                  <span className="break-words">{visita.direccion_visita}</span>
                </div>
                <div className="flex items-center space-x-3 rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm lg:space-x-4">
                  <Calendar className="h-5 w-5 text-blue-500 lg:h-6 lg:w-6" />
                  <span>
                    Programada: {formatDateTime(visita.fecha_hora_visita)}
                  </span>
                </div>
              </div>
            )}

            {/* Observaciones */}
            {visita.observaciones && (
              <div className="mt-2">
                <h4 className="mb-3 text-lg font-semibold text-gray-700 lg:text-xl">
                  Observaciones
                </h4>
                <p className="rounded-md border bg-gray-50 p-4 text-base leading-relaxed text-gray-600 lg:p-5 lg:text-lg">
                  {visita.observaciones}
                </p>
              </div>
            )}

            {/* Fecha de cancelación */}
            {visita.fecha_cancelacion && (
              <div className="mt-2">
                <h4 className="mb-3 text-lg font-semibold text-red-600 lg:text-xl">
                  Fecha de Cancelación
                </h4>
                <p className="text-base font-medium text-gray-700 lg:text-lg">
                  {formatDate(visita.fecha_cancelacion)}
                </p>
              </div>
            )}
          </div>

          {/* Side Column (Documents & Orders) */}
          <div className="flex flex-col lg:col-span-5">
            <h4 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-700 lg:text-xl">
              Documentos Relacionados
            </h4>
            <div className="flex h-full flex-col gap-4">
              {/* Nota de Fábrica como Referencia */}
              {visita.obra?.nota_fabrica && (
                <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-5 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold tracking-wider text-blue-900 uppercase">
                          Nota de Fábrica
                        </h4>
                        <p className="text-sm font-medium text-blue-700/80">
                          Sugerida para medidas y remedición
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() =>
                        handleVerDocumento(
                          visita.obra!.nota_fabrica!,
                          `Nota de Fábrica - ${visita.obra?.cliente.razon_social}`
                        )
                      }
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 lg:px-5 lg:py-2.5"
                    >
                      Ver Nota
                    </Button>
                  </div>
                </div>
              )}

              {/* Órdenes de Producción */}
              {visita.obra && (
                <div className="flex flex-1 flex-col">
                  {loadingOPs ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                      <span className="ml-3 font-medium text-gray-600 lg:text-lg">
                        Cargando órdenes...
                      </span>
                    </div>
                  ) : errorOPs ? (
                    <p className="rounded-lg bg-red-50 py-4 text-center font-medium text-red-600 lg:text-lg">
                      {errorOPs}
                    </p>
                  ) : ordenes.length > 0 ? (
                    <OrdenProduccionSeccion
                      ordenes={ordenes}
                      activeIndex={activeOpIndex}
                      onIndexChange={setActiveOpIndex}
                      onVerDocumento={handleVerDocumento}
                    />
                  ) : (
                    <p className="py-8 text-center text-gray-500">
                      No hay órdenes de producción para esta obra.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botones responsivos */}
        <div className="mt-2 flex flex-col justify-end space-y-4 border-t pt-6 sm:flex-row sm:space-y-0 sm:space-x-4 lg:pt-8">
          {/* Botones de navegación */}
          {tieneUbicacion && (
            <>
              <Button
                onClick={handleVerEnMapa}
                variant="outline"
                className="flex-1 cursor-pointer border-blue-300 text-blue-700 hover:bg-blue-50 sm:flex-initial lg:py-5 lg:text-lg"
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
              className="flex-1 cursor-pointer bg-green-600 py-4 text-base text-white hover:bg-green-700 sm:flex-initial lg:py-5 lg:text-lg"
            >
              <CheckCircle className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
              <span className="hidden sm:inline">Finalizar visita</span>
              <span className="sm:hidden">Finalizar</span>
            </Button>
          )}
        </div>
      </CardContent>

      {/* Visualizador de Documentos Reutilizado */}
      <DocumentViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        url={viewerUrl}
        title={viewerTitle}
      />
    </Card>
  )
}
