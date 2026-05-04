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
      <Card className="mx-auto w-full max-w-7xl border-gray-200 bg-white shadow-lg lg:max-w-full">
        <CardContent className="flex flex-col gap-6 p-6 lg:gap-8 lg:p-10">
          {/* Header responsivo */}
          <div className="flex items-start justify-between space-x-4 border-b pb-6">
            <div className="flex-1">
              <h2 className="mb-2 text-2xl font-bold text-gray-900 lg:text-4xl">
                Entrega #{entrega.entrega.cod_entrega}
              </h2>
              <p className="mb-3 text-lg text-gray-600 lg:text-xl">
                {entrega.obra.cliente?.razon_social ||
                  [entrega.obra.cliente?.nombre, entrega.obra.cliente?.apellido].filter(Boolean).join(' ') ||
                  'Cliente no especificado'}
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
                  className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold tracking-wider uppercase shadow-sm lg:px-4 lg:py-2 lg:text-sm ${
                    entrega.entrega.esFinal
                      ? 'border-indigo-200 bg-indigo-100 text-indigo-800'
                      : 'border-cyan-200 bg-cyan-100 text-cyan-800'
                  }`}
                >
                  {entrega.entrega.esFinal
                    ? 'ENTREGA FINAL'
                    : 'ENTREGA PARCIAL'}
                </span>
                <span className="text-sm text-gray-500 lg:text-base">
                  Rol:{' '}
                  <span className="font-medium">{entrega.rol_entrega}</span>
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Truck className="h-16 w-16 text-gray-300 sm:h-14 sm:w-14 lg:h-20 lg:w-20" />
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Main Info Column */}
            <div className="flex flex-col gap-6 lg:col-span-7">
              {/* Información de contacto responsiva */}
              <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:gap-6 lg:text-base">
                <div className="flex items-center space-x-3 rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm lg:space-x-4">
                  <Phone className="h-5 w-5 text-blue-500 lg:h-6 lg:w-6" />
                  <span className="break-all">
                    {entrega.obra.cliente?.telefono || 'No disponible'}
                  </span>
                </div>
                <div className="flex items-center space-x-3 rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm lg:space-x-4">
                  <Mail className="h-5 w-5 text-blue-500 lg:h-6 lg:w-6" />
                  <span className="break-all">
                    {entrega.obra.cliente?.mail || 'No disponible'}
                  </span>
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
                    Programada:{' '}
                    {formatDateTime(entrega.entrega.fecha_hora_entrega)}
                  </span>
                </div>
              </div>

              {/* Detalles de la entrega */}
              <div className="mt-2">
                <h4 className="mb-3 text-lg font-semibold text-gray-700 lg:text-xl">
                  Detalles de la entrega
                </h4>
                <p className="rounded-md border bg-gray-50 p-4 text-base leading-relaxed text-gray-600 lg:p-5 lg:text-lg">
                  {entrega.entrega.detalle || 'Sin detalles especificados'}
                </p>
              </div>

              {/* Observaciones */}
              {entrega.entrega.observaciones && (
                <div className="mt-2">
                  <h4 className="mb-3 text-lg font-semibold text-gray-700 lg:text-xl">
                    Observaciones
                  </h4>
                  <p className="rounded-md border bg-gray-50 p-4 text-base leading-relaxed text-gray-600 lg:p-5 lg:text-lg">
                    {entrega.entrega.observaciones}
                  </p>
                </div>
              )}
            </div>

            {/* Side Column (Orders) */}
            <div className="flex flex-col lg:col-span-5">
              {/* Órdenes de Producción Asociadas */}
              {(() => {
                const ops = entrega.entrega.ordenes_de_produccion
                if (!ops || ops.length === 0) return null
                const activeOp: OrdenProduccion = ops[activeOpIndex] ?? ops[0]
                return (
                  <div className="mt-6 flex h-full flex-col border-none lg:mt-0">
                    <h4 className="mb-4 flex items-center gap-2 border-b pb-2 text-lg font-semibold text-gray-700 lg:text-xl">
                      <Package className="h-5 w-5 text-purple-600 lg:h-6 lg:w-6" />
                      {ops.length === 1
                        ? 'Orden de Producción'
                        : `Órdenes de Producción (${ops.length})`}
                    </h4>

                    <div className="flex flex-1 flex-col">
                      {/* Tabs si hay más de 1 OP */}
                      {ops.length > 1 && (
                        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-1.5 lg:mb-6">
                          {ops.map((op, idx) => (
                            <button
                              key={op.cod_op}
                              onClick={() => setActiveOpIndex(idx)}
                              className={`rounded-lg px-4 py-2 text-sm font-bold transition-all sm:rounded-full sm:px-3 sm:py-1.5 ${
                                activeOpIndex === idx
                                  ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                              }`}
                            >
                              OP #{op.cod_op}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-col items-end gap-3 rounded-xl border border-purple-200 bg-purple-50 p-4 shadow-sm sm:w-full sm:flex-row sm:items-center sm:justify-between lg:p-5">
                        <div className="w-full text-right sm:w-auto sm:text-left">
                          <p className="text-sm font-medium text-purple-600/80">
                            Orden Seleccionada
                          </p>
                          <p className="mt-1 text-xl font-bold text-purple-900 lg:text-2xl">
                            OP #{activeOp.cod_op}
                          </p>
                          <p className="mt-1 text-xs font-medium text-purple-600/70">
                            Confeccionada:{' '}
                            {new Date(
                              activeOp.fecha_confeccion
                            ).toLocaleDateString('es-AR')}
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setViewerUrl(activeOp.url)
                            setViewerTitle(
                              `Orden de Producción #${activeOp.cod_op}`
                            )
                            setIsViewerOpen(true)
                          }}
                          className="w-full flex-shrink-0 cursor-pointer bg-purple-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-purple-700 focus:ring-4 focus:ring-purple-500/20 active:scale-95 sm:w-auto lg:px-6 lg:py-3 lg:text-base"
                        >
                          <Package className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                          <span className="hidden sm:inline">
                            Ver Documento
                          </span>
                          <span className="sm:hidden">Ver</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>

          {/* Botones responsivos */}
          <div className="mt-2 flex flex-col justify-end space-y-4 border-t pt-6 sm:flex-row sm:space-y-0 sm:space-x-4 lg:pt-8">
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
                className="flex-1 cursor-pointer bg-green-600 py-4 text-base text-white hover:bg-green-700 sm:flex-initial lg:py-5 lg:text-lg"
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
