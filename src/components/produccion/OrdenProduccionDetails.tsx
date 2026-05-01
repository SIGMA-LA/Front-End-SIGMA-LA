import {
  Calendar,
  Mail,
  MapPin,
  Phone,
  Package,
  FileText,
  Play,
  CheckCircle,
  User as UserIcon,
  Tag,
} from 'lucide-react'
import type { OrdenProduccion } from '@/types'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useState } from 'react'
import { formatDateOnly } from '@/lib/utils'

interface OrdenProduccionDetailsProps {
  orden: OrdenProduccion
  onIniciarProduccion?: () => void
  onFinalizarProduccion?: () => void
}

const getEstadoBadge = (estado: OrdenProduccion['estado']) => {
  const badges = {
    PENDIENTE: 'bg-gray-100 text-gray-800',
    APROBADA: 'bg-blue-100 text-blue-800',
    'EN PRODUCCION': 'bg-yellow-100 text-yellow-800',
    FINALIZADA: 'bg-green-100 text-green-800',
  }
  return badges[estado] || 'bg-gray-100 text-gray-800'
}

export default function OrdenProduccionDetails({
  orden,
  onIniciarProduccion,
  onFinalizarProduccion,
}: OrdenProduccionDetailsProps) {
  const [pdfLoading, setPdfLoading] = useState(true)

  const cliente = orden.obra?.cliente
  const nombreCliente =
    cliente?.tipo_cliente === 'EMPRESA'
      ? cliente.razon_social?.trim()
      : `${cliente?.nombre ?? ''} ${cliente?.apellido ?? ''}`.trim()
  const nombreClienteMostrado = nombreCliente || 'N/A'

  const canIniciar = orden.estado === 'APROBADA'
  const canFinalizar = orden.estado === 'EN PRODUCCION'

  const handleOpenPdf = () => {
    if (orden.url) {
      window.open(orden.url, '_blank')
    }
  }

  return (
    <Card className="mx-auto w-full max-w-7xl border-gray-200 bg-white shadow-lg lg:max-w-[95%]">
      <CardContent className="flex flex-col gap-6 p-6 lg:gap-8 lg:p-10">
        {/* Header */}
        <div className="flex items-start justify-between space-x-4 border-b pb-6">
          <div className="flex-1">
            <h2 className="mb-0 text-2xl font-bold text-gray-900 lg:text-4xl">
              Orden de Producción #{orden.cod_op}
            </h2>
          </div>
          <div className="flex-shrink-0">
            <Package className="h-12 w-12 text-gray-300 sm:h-14 sm:w-14 lg:h-16 lg:w-16" />
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main Content (PDF / Viewer) Column */}
          <div className="order-2 mt-6 lg:order-1 lg:col-span-8 lg:mt-0">
            {/* PDF de la orden */}
            {orden.url ? (
              <div className="flex h-full flex-col">
                <div className="relative flex-1 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-inner">
                  <iframe
                    src={`${orden.url}#view=FitH`}
                    className="h-[500px] w-full lg:h-[700px] xl:h-[800px]"
                    title="Orden de Producción PDF"
                    onLoad={() => setPdfLoading(false)}
                    onError={() => setPdfLoading(false)}
                  />
                  {pdfLoading && (
                    <div className="bg-opacity-90 absolute inset-0 flex items-center justify-center bg-white">
                      <div className="text-center">
                        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600 lg:h-10 lg:w-10"></div>
                        <p className="text-sm text-gray-500 lg:text-base">
                          Cargando PDF...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleOpenPdf}
                  className="mt-4 w-full rounded-xl border-2 border-blue-500 bg-white px-5 py-3 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 lg:px-6 lg:py-4 lg:text-base"
                >
                  <FileText className="mr-2 inline-block h-5 w-5 lg:h-6 lg:w-6" />
                  Abrir Documento en nueva pestaña
                </button>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                <FileText className="mb-4 h-12 w-12 text-gray-400" />
                <p className="text-lg font-medium text-gray-600">
                  No hay documento adjunto
                </p>
              </div>
            )}
          </div>

          {/* Details / Actions Column */}
          <div className="order-1 flex flex-col gap-6 lg:order-2 lg:col-span-4">
            <div>
              <h4 className="mb-4 text-lg font-semibold text-gray-700 lg:text-xl">
                Información General
              </h4>
              <div className="flex flex-col gap-4 text-sm lg:text-base">
                <div className="flex items-center space-x-3 rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm lg:space-x-4">
                  <Calendar className="h-5 w-5 flex-shrink-0 text-blue-500 lg:h-6 lg:w-6" />
                  <span>
                    Confección: {formatDateOnly(orden.fecha_confeccion)}
                  </span>
                </div>
                {orden.fecha_validacion && (
                  <div className="flex items-center space-x-3 rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm lg:space-x-4">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-blue-500 lg:h-6 lg:w-6" />
                    <span>
                      Validación: {formatDateOnly(orden.fecha_validacion)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm">
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <Tag className="h-5 w-5 flex-shrink-0 text-blue-500 lg:h-6 lg:w-6" />
                    <span className="font-medium text-gray-600">Estado</span>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold lg:text-base ${getEstadoBadge(orden.estado)}`}
                  >
                    {orden.estado}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-semibold text-gray-700 lg:text-xl">
                Información del Cliente y Obra
              </h4>
              <div className="flex flex-col gap-4 text-sm lg:text-base">
                <div className="flex items-center space-x-3 rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm lg:space-x-4">
                  <Package className="h-5 w-5 flex-shrink-0 text-blue-500 lg:h-6 lg:w-6" />
                  <span className="font-medium">
                    Obra #{orden.obra.cod_obra}
                  </span>
                </div>
                <div className="flex items-center space-x-3 rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm lg:space-x-4">
                  <UserIcon className="h-5 w-5 flex-shrink-0 text-blue-500 lg:h-6 lg:w-6" />
                  <span className="font-medium break-all">
                    {nombreClienteMostrado}
                  </span>
                </div>
                <div className="flex items-center space-x-3 rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm lg:space-x-4">
                  <Phone className="h-5 w-5 flex-shrink-0 text-blue-500 lg:h-6 lg:w-6" />
                  <span className="break-all">
                    {orden.obra.cliente.telefono || 'Sin teléfono'}
                  </span>
                </div>
                <div className="flex items-center space-x-3 rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm lg:space-x-4">
                  <Mail className="h-5 w-5 flex-shrink-0 text-blue-500 lg:h-6 lg:w-6" />
                  <span className="break-all">
                    {orden.obra.cliente.mail || 'Sin mail'}
                  </span>
                </div>
                <div className="flex items-center space-x-3 rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm lg:space-x-4">
                  <MapPin className="h-5 w-5 flex-shrink-0 text-blue-500 lg:h-6 lg:w-6" />
                  <span className="break-words">
                    {orden.obra.direccion}
                    {orden.obra.localidad &&
                      `, ${orden.obra.localidad.nombre_localidad}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Botones para iniciar/finalizar producción */}
            {(canIniciar || canFinalizar) && (
              <div className="mt-auto border-t pt-6">
                <h4 className="mb-4 text-sm font-semibold tracking-widest text-gray-500 uppercase">
                  Acciones Disponibles
                </h4>
                <div className="flex flex-col gap-3">
                  {canIniciar && onIniciarProduccion && (
                    <Button
                      onClick={onIniciarProduccion}
                      className="w-full cursor-pointer bg-green-600 py-4 text-base text-white transition-colors hover:bg-green-700 lg:py-5 lg:text-lg"
                    >
                      <Play className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
                      <span>Iniciar Producción</span>
                    </Button>
                  )}
                  {canFinalizar && onFinalizarProduccion && (
                    <Button
                      onClick={onFinalizarProduccion}
                      className="w-full cursor-pointer bg-amber-500 py-4 text-base text-white transition-colors hover:bg-amber-600 lg:py-5 lg:text-lg"
                    >
                      <CheckCircle className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
                      <span>Finalizar Producción</span>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
