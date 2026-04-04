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
  Package,
} from 'lucide-react'
import { useState } from 'react'
import type { EntregaEmpleado, OrdenProduccion } from '@/types'
import { abrirGoogleMaps, navegarADireccion } from '@/lib/maps'
import { DocumentViewer } from '@/components/shared/DocumentViewer'

interface EntregaDetailsProps {
  entrega: EntregaEmpleado
  onFinalizarEntrega: () => void
}


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

  const [activeOpIndex, setActiveOpIndex] = useState(0)
  const [viewerUrl, setViewerUrl] = useState('')
  const [viewerTitle, setViewerTitle] = useState('')
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  // Función para obtener la dirección completa para navegación
  const getDireccionCompleta = () => {
    const direccion = entrega.obra.direccion
    const localidad = entrega.obra.localidad?.nombre_localidad
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
    <>
      <Card className="mx-auto max-w-6xl border-gray-200 bg-white shadow-lg">
        <CardContent className="space-y-6 p-6 lg:space-y-8 lg:p-12">
        {/* Header responsivo */}
        <div className="flex items-start justify-between space-x-4">
          <div className="flex-1">
            <h2 className="mb-2 text-2xl font-bold text-gray-900 lg:text-4xl">
              Entrega #{entrega.entrega.cod_entrega}
            </h2>
            <p className="mb-3 text-lg text-gray-600 lg:text-xl">
              {entrega.obra.cliente?.razon_social || 'Cliente no especificado'}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold lg:px-5 lg:text-base ${
                  entrega.entrega.estado === 'PENDIENTE'
                    ? 'bg-yellow-100 text-yellow-800'
                    : entrega.entrega.estado === 'ENTREGADO'
                      ? 'bg-green-100 text-green-800'
                      : entrega.entrega.estado === 'CANCELADO'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                }`}
              >
                {entrega.entrega.estado === 'ENTREGADO' 
                  ? 'ENTREGADA' 
                  : entrega.entrega.estado === 'CANCELADO' 
                    ? 'CANCELADA' 
                    : 'PENDIENTE'}
              </span>
              <span
                className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold border lg:px-4 lg:py-2 lg:text-sm tracking-wider shadow-sm uppercase ${
                  entrega.entrega.esFinal
                    ? 'border-indigo-200 bg-indigo-100 text-indigo-800'
                    : 'border-cyan-200 bg-cyan-100 text-cyan-800'
                }`}
              >
                {entrega.entrega.esFinal ? 'ENTREGA FINAL' : 'ENTREGA PARCIAL'}
              </span>
              <span className="text-sm text-gray-500 lg:text-base">
                Rol: <span className="font-medium">{entrega.rol_entrega}</span>
              </span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Truck className="h-16 w-16 text-gray-300 sm:h-14 sm:w-14 lg:h-20 lg:w-20" />
          </div>
        </div>

        {/* Información de contacto responsiva */}
        <div className="grid grid-cols-1 gap-4 border-t pt-6 text-sm sm:grid-cols-2 lg:gap-6 lg:pt-8 lg:text-base">
          <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3 lg:space-x-4">
            <Phone className="h-5 w-5 text-gray-400 lg:h-6 lg:w-6" />
            <span className="break-all">
              {entrega.obra.cliente?.telefono || 'No disponible'}
            </span>
          </div>
          <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3 lg:space-x-4">
            <Mail className="h-5 w-5 text-gray-400 lg:h-6 lg:w-6" />
            <span className="break-all">
              {entrega.obra.cliente?.mail || 'No disponible'}
            </span>
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
              Programada: {formatDateTime(entrega.entrega.fecha_hora_entrega)}
            </span>
          </div>
        </div>

        {/* Detalles de la entrega */}
        <div>
          <h4 className="mb-4 text-lg font-semibold text-gray-700 lg:text-2xl">
            Detalles de la entrega
          </h4>
          <p className="mt-4 rounded-md border bg-gray-50 p-3 text-base leading-relaxed text-gray-600 lg:p-5 lg:text-lg">
            {entrega.entrega.detalle || 'Sin detalles especificados'}
          </p>
        </div>

        {/* Órdenes de Producción Asociadas */}
        {(() => {
          const ops = entrega.entrega.ordenes_de_produccion
          if (!ops || ops.length === 0) return null
          const activeOp: OrdenProduccion = ops[activeOpIndex] ?? ops[0]
          return (
            <div className="border-t pt-6">
              <h4 className="mb-4 text-lg font-semibold text-gray-700 lg:text-2xl flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-600 lg:h-6 lg:w-6" />
                {ops.length === 1 ? 'Orden de Producción' : `Órdenes de Producción (${ops.length})`}
              </h4>

              {/* Tabs si hay más de 1 OP */}
              {ops.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {ops.map((op, idx) => (
                    <button
                      key={op.cod_op}
                      onClick={() => setActiveOpIndex(idx)}
                      className={`rounded-full px-3 py-1.5 text-sm font-bold transition-all ${
                        activeOpIndex === idx
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                      }`}
                    >
                      OP #{op.cod_op}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between rounded-xl border border-purple-200 bg-purple-50 p-4 lg:p-5">
                <div>
                  <p className="text-sm font-medium text-purple-600/80">Orden Seleccionada</p>
                  <p className="font-bold text-purple-900 text-xl lg:text-2xl">OP #{activeOp.cod_op}</p>
                  <p className="text-xs text-purple-600/70 mt-1">
                    Confeccionada: {new Date(activeOp.fecha_confeccion).toLocaleDateString('es-AR')}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setViewerUrl(activeOp.url)
                    setViewerTitle(`Orden de Producción #${activeOp.cod_op}`)
                    setIsViewerOpen(true)
                  }}
                  className="bg-purple-600 text-white hover:bg-purple-700 py-3 text-sm lg:text-base cursor-pointer"
                >
                  <Package className="mr-2 h-4 w-4" />
                  Ver Documento
                </Button>
              </div>
            </div>
          )
        })()}

        {/* Observaciones */}
        {entrega.entrega.observaciones && (
          <div>
            <h4 className="mb-4 text-lg font-semibold text-gray-700 lg:text-2xl">
              Observaciones
            </h4>
            <p className="mt-4 rounded-md border bg-gray-50 p-3 text-base leading-relaxed text-gray-600 lg:p-5 lg:text-lg">
              {entrega.entrega.observaciones}
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
          {isEntregaPendiente && isEncargado && (
            <Button
              onClick={onFinalizarEntrega}
              className="flex-1 cursor-pointer bg-green-600 py-4 text-base text-white hover:bg-green-700 lg:py-5 lg:text-lg"
            >
              <CheckCircle className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
              <span className="hidden sm:inline">Finalizar Entrega</span>
              <span className="sm:hidden">Finalizar</span>
            </Button>
          )}
          </div>
        </CardContent>
      </Card>

      <DocumentViewer
        url={viewerUrl}
        title={viewerTitle}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </>
  )
}
