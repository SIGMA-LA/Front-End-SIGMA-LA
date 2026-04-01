import {
  Calendar,
  Mail,
  MapPin,
  Phone,
  User as UserIcon,
  FileText,
  CheckCircle,
} from 'lucide-react'
import type { Obra } from '@/types'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useState } from 'react'
import { formatDateOnly } from '@/lib/utils'
import OrdenesProduccionList from './OrdenesProduccionList'

interface NotaFabricaDetailsProps {
  obra: Obra
  onCrearOrden: () => void
}

const getEstadoBadge = (estado: Obra['estado']) => {
  const badges = {
    'EN ESPERA DE PAGO': 'bg-blue-100 text-blue-800',
    'PAGADA PARCIALMENTE': 'bg-indigo-100 text-indigo-800',
    'EN PRODUCCION': 'bg-yellow-100 text-yellow-800',
    'PRODUCCION FINALIZADA': 'bg-green-100 text-green-800',
    ENTREGADA: 'bg-purple-100 text-purple-800',
    CANCELADA: 'bg-red-100 text-red-800',
    'EN ESPERA DE STOCK': 'bg-orange-100 text-orange-800',
    'PAGADA TOTALMENTE': 'bg-teal-100 text-teal-800',
  }
  return badges[estado] || 'bg-gray-100 text-gray-800'
}

export default function NotaFabricaDetails({
  obra,
  onCrearOrden,
}: NotaFabricaDetailsProps) {
  const clienteNombre =
    obra.cliente.razon_social?.trim() ||
    `${obra.cliente.nombre ?? ''} ${obra.cliente.apellido ?? ''}`.trim() ||
    'Sin nombre'

  const [pdfLoading, setPdfLoading] = useState(true)
  const [pdfError, setPdfError] = useState(false)

  // URL de la nota de fábrica (PDF)
  const notaFabricaUrl = obra.nota_fabrica || null

  // Verificar si es un PDF
  const isPdf = notaFabricaUrl?.toLowerCase().endsWith('.pdf')

  const handleOpenPdf = () => {
    if (notaFabricaUrl) {
      window.open(notaFabricaUrl, '_blank')
    }
  }

  return (
    <Card className="mx-auto max-w-6xl border-gray-200 bg-white shadow-lg">
      <CardContent className="space-y-6 p-6 lg:space-y-8 lg:p-12">
        {/* Header */}
        <div className="flex items-start justify-between space-x-4">
          <div className="flex-1">
            <h2 className="mb-2 text-2xl font-bold text-gray-900 lg:text-4xl">
              Nota de Fábrica - Obra #{obra.cod_obra}
            </h2>
            <p className="mb-3 text-lg text-gray-600 lg:text-xl">
              {clienteNombre}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold lg:px-5 lg:text-base ${getEstadoBadge(obra.estado)}`}
              >
                {obra.estado}
              </span>
              <span className="text-sm text-gray-500 lg:text-base">
                Iniciada:{' '}
                <span className="font-medium">
                  {formatDateOnly(obra.fecha_ini)}
                </span>
              </span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <UserIcon className="h-12 w-12 text-gray-300 sm:h-14 sm:w-14 lg:h-20 lg:w-20" />
          </div>
        </div>

        {/* Información de contacto */}
        <div className="grid grid-cols-1 gap-4 border-t pt-6 text-sm sm:grid-cols-2 lg:gap-6 lg:pt-8 lg:text-base">
          <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3 lg:space-x-4">
            <Phone className="h-5 w-5 text-gray-400 lg:h-6 lg:w-6" />
            <span className="break-all">{obra.cliente.telefono}</span>
          </div>
          <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3 lg:space-x-4">
            <Mail className="h-5 w-5 text-gray-400 lg:h-6 lg:w-6" />
            <span className="break-all">{obra.cliente.mail}</span>
          </div>
          <div className="col-span-1 flex items-center space-x-3 rounded-lg bg-gray-50 p-3 sm:col-span-2 lg:space-x-4">
            <MapPin className="h-5 w-5 text-gray-400 lg:h-6 lg:w-6" />
            <span className="break-words">
              {obra.direccion}
              {obra.localidad && `, ${obra.localidad.nombre_localidad}`}
            </span>
          </div>
        </div>

        {/* Nota de fábrica (PDF o Imagen) */}
        {notaFabricaUrl ? (
          <div>
            <h4 className="mb-4 text-lg font-semibold text-gray-700 lg:text-2xl">
              Nota de Fábrica
            </h4>
            {isPdf ? (
              <div className="space-y-4">
                {/* Vista previa del PDF embebido */}
                <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                  <iframe
                    src={`${notaFabricaUrl}#view=FitH`}
                    className="w-full"
                    style={{ height: '600px' }}
                    title="Nota de Fábrica PDF"
                    onLoad={() => setPdfLoading(false)}
                    onError={() => {
                      setPdfLoading(false)
                      setPdfError(true)
                    }}
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
                {/* Botón para abrir en nueva pestaña */}
                <button
                  onClick={handleOpenPdf}
                  className="w-full rounded-md border-2 border-blue-500 bg-white px-5 py-3 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 lg:px-6 lg:py-4 lg:text-base"
                >
                  <FileText className="mr-2 inline-block h-5 w-5 lg:h-6 lg:w-6" />
                  Abrir PDF en nueva pestaña
                </button>
              </div>
            ) : (
              // Si es imagen
              <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                {pdfLoading && !pdfError && (
                  <div className="flex h-96 items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600 lg:h-10 lg:w-10"></div>
                      <p className="text-sm text-gray-500 lg:text-base">
                        Cargando imagen...
                      </p>
                    </div>
                  </div>
                )}
                {pdfError ? (
                  <div className="flex h-96 items-center justify-center">
                    <div className="text-center">
                      <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400 lg:h-16 lg:w-16" />
                      <p className="text-sm text-gray-500 lg:text-base">
                        Error al cargar el archivo
                      </p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={notaFabricaUrl}
                    alt="Nota de Fábrica"
                    className="w-full object-contain"
                    style={{ maxHeight: '600px' }}
                    onLoad={() => setPdfLoading(false)}
                    onError={() => {
                      setPdfLoading(false)
                      setPdfError(true)
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h4 className="mb-4 text-lg font-semibold text-gray-700 lg:text-2xl">
              Nota de Fábrica
            </h4>
            <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
              <div className="text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400 lg:h-16 lg:w-16" />
                <p className="text-sm text-gray-500 lg:text-base">
                  No hay archivo de nota de fábrica disponible
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Órdenes de Producción */}
        <div>
          <h4 className="mb-4 text-lg font-semibold text-gray-700 lg:text-2xl">
            Órdenes de Producción Asociadas
          </h4>
          <OrdenesProduccionList cod_obra={obra.cod_obra} />
        </div>

        {/* Botón para crear orden de producción */}
        <div className="flex flex-col space-y-4 border-t pt-6 sm:flex-row sm:space-y-0 sm:space-x-3 lg:space-x-4 lg:pt-8">
          <Button
            onClick={onCrearOrden}
            className="flex-1 cursor-pointer bg-green-600 py-4 text-base text-white hover:bg-green-700 lg:py-5 lg:text-lg"
          >
            <CheckCircle className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
            <span>Crear Orden de Producción</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
