import {
  Calendar,
  Mail,
  MapPin,
  Phone,
  User as UserIcon,
  FileText,
  CheckCircle,
  AlertTriangle,
  Tag,
} from 'lucide-react'
import type { Obra, OrdenProduccion } from '@/types'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useCallback, useState, useEffect } from 'react'
import { formatDateOnly } from '@/lib/utils'
import OrdenesProduccionList from './OrdenesProduccionList'
import { finalizarProduccionObra } from '@/actions/obras'
import ProduccionActionModal, {
  type ProduccionActionSummary,
} from './ProduccionActionModal'
import SolicitarStockModal from './SolicitarStockModal'
import { notify } from '@/lib/toast'
import { getPedidosStock } from '@/actions/pedidoStock'

interface NotaFabricaDetailsProps {
  obra: Obra
  onCrearOrden: () => void
  onProduccionFinalizada?: () => void
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
  onProduccionFinalizada,
}: NotaFabricaDetailsProps) {
  const clienteNombre =
    obra.cliente.razon_social?.trim() ||
    `${obra.cliente.nombre ?? ''} ${obra.cliente.apellido ?? ''}`.trim() ||
    'Sin nombre'

  const direccionObra = obra.localidad
    ? `${obra.direccion}, ${obra.localidad.nombre_localidad}`
    : obra.direccion

  const obraSummary: ProduccionActionSummary = {
    entidadLabel: 'Obra',
    entidadValor: `#${obra.cod_obra}`,
    cliente: clienteNombre,
    direccion: direccionObra,
    telefono: obra.cliente.telefono,
    mail: obra.cliente.mail,
    estadoActual: obra.estado,
  }

  const [pdfLoading, setPdfLoading] = useState(true)
  const [pdfError, setPdfError] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isFinalizando, setIsFinalizando] = useState(false)
  const [isStockModalOpen, setIsStockModalOpen] = useState(false)
  const [tieneOpFinalizada, setTieneOpFinalizada] = useState(false)
  const [hasActivePedido, setHasActivePedido] = useState(false)

  useEffect(() => {
    const fetchPedidos = async () => {
      const res = await getPedidosStock()
      if (res.success && res.data) {
        const activePedido = res.data.find(
          (p) => p.obraId === obra.cod_obra && p.estado !== 'RECIBIDO'
        )
        setHasActivePedido(!!activePedido)
      }
    }
    fetchPedidos()
  }, [obra.cod_obra])

  const isEnProduccion = obra.estado === 'EN PRODUCCION'
  const puedeFinalizarProduccion = isEnProduccion && tieneOpFinalizada

  const handleOrdenesLoaded = useCallback((ordenes: OrdenProduccion[]) => {
    setTieneOpFinalizada(ordenes.some((op) => op.estado === 'FINALIZADA'))
  }, [])

  // URL de la nota de fábrica (PDF)
  const notaFabricaUrl = obra.nota_fabrica || null

  // Verificar si es un PDF
  const isPdf = notaFabricaUrl?.toLowerCase().endsWith('.pdf')

  const handleAbrirConfirmacion = () => {
    setIsConfirmModalOpen(true)
  }

  const handleCerrarConfirmacion = () => {
    if (!isFinalizando) {
      setIsConfirmModalOpen(false)
    }
  }

  const handleConfirmarFinalizar = async () => {
    setIsFinalizando(true)
    try {
      const result = await finalizarProduccionObra(obra.cod_obra)
      if (result.success) {
        notify.success('Producción finalizada correctamente.')
        setIsConfirmModalOpen(false)
        onProduccionFinalizada?.()
      } else {
        notify.error(result.error || 'Error al finalizar la producción')
      }
    } catch (error) {
      console.error('Error al finalizar producción de obra:', error)
      notify.error('Error al finalizar la producción. Intente nuevamente.')
    } finally {
      setIsFinalizando(false)
    }
  }

  const handleOpenPdf = () => {
    if (notaFabricaUrl) {
      window.open(notaFabricaUrl, '_blank')
    }
  }

  return (
    <Card className="mx-auto w-full max-w-7xl border-gray-200 bg-white shadow-lg lg:max-w-[95%]">
      <CardContent className="flex flex-col gap-6 p-6 lg:gap-8 lg:p-10">
        {/* Header */}
        <div className="flex items-start justify-between space-x-4 border-b pb-6">
          <div className="flex-1">
            <h2 className="mb-0 text-2xl font-bold text-gray-900 lg:text-4xl">
              Nota de Fábrica - Obra #{obra.cod_obra}
            </h2>
          </div>
          <div className="flex-shrink-0">
            <FileText className="h-12 w-12 text-gray-300 sm:h-14 sm:w-14 lg:h-16 lg:w-16" />
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main Content (PDF / Viewer) Column */}
          <div className="order-2 mt-6 lg:order-1 lg:col-span-8 lg:mt-0">
            {/* Nota de fábrica (PDF o Imagen) */}
            {notaFabricaUrl ? (
              <div className="flex h-full flex-col">
                {isPdf ? (
                  <div className="flex flex-1 flex-col space-y-4">
                    {/* Vista previa del PDF embebido */}
                    <div className="relative flex-1 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-inner">
                      <iframe
                        src={`${notaFabricaUrl}#view=FitH`}
                        className="h-[500px] w-full lg:h-[700px] xl:h-[800px]"
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
                      className="w-full rounded-xl border-2 border-blue-500 bg-white px-5 py-3 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 lg:px-6 lg:py-4 lg:text-base"
                    >
                      <FileText className="mr-2 inline-block h-5 w-5 lg:h-6 lg:w-6" />
                      Abrir PDF en nueva pestaña
                    </button>
                  </div>
                ) : (
                  // Si es imagen
                  <div className="relative flex flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-inner">
                    {pdfLoading && !pdfError && (
                      <div className="flex min-h-[500px] flex-1 items-center justify-center">
                        <div className="text-center">
                          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600 lg:h-10 lg:w-10"></div>
                          <p className="text-sm text-gray-500 lg:text-base">
                            Cargando imagen...
                          </p>
                        </div>
                      </div>
                    )}
                    {pdfError ? (
                      <div className="flex min-h-[500px] flex-1 items-center justify-center">
                        <div className="text-center">
                          <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400 lg:h-16 lg:w-16" />
                          <p className="text-sm text-gray-500 lg:text-base">
                            Error al cargar el archivo
                          </p>
                        </div>
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={notaFabricaUrl}
                        alt="Nota de Fábrica"
                        className="h-full w-full object-contain"
                        style={{ maxHeight: '800px' }}
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
              <div className="flex h-full min-h-[500px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                <FileText className="mb-4 h-12 w-12 text-gray-400 lg:h-16 lg:w-16" />
                <p className="text-lg font-medium text-gray-600">
                  No hay archivo de nota de fábrica disponible
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
                  <span>Iniciada: {formatDateOnly(obra.fecha_ini)}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm">
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <Tag className="h-5 w-5 flex-shrink-0 text-blue-500 lg:h-6 lg:w-6" />
                    <span className="font-medium text-gray-600">Estado</span>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold lg:text-base ${getEstadoBadge(obra.estado)}`}
                  >
                    {obra.estado}
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
                  <UserIcon className="h-5 w-5 flex-shrink-0 text-blue-500 lg:h-6 lg:w-6" />
                  <span className="font-medium break-all">{clienteNombre}</span>
                </div>
                <div className="flex items-center space-x-3 rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm lg:space-x-4">
                  <Phone className="h-5 w-5 flex-shrink-0 text-blue-500 lg:h-6 lg:w-6" />
                  <span className="break-all">
                    {obra.cliente.telefono || 'Sin teléfono'}
                  </span>
                </div>
                <div className="flex items-center space-x-3 rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm lg:space-x-4">
                  <Mail className="h-5 w-5 flex-shrink-0 text-blue-500 lg:h-6 lg:w-6" />
                  <span className="break-all">
                    {obra.cliente.mail || 'Sin mail'}
                  </span>
                </div>
                <div className="flex items-center space-x-3 rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm lg:space-x-4">
                  <MapPin className="h-5 w-5 flex-shrink-0 text-blue-500 lg:h-6 lg:w-6" />
                  <span className="break-words">{direccionObra}</span>
                </div>
              </div>
            </div>

            {/* Lista de Órdenes de Producción */}
            <div className="flex h-full flex-col">
              <h4 className="mt-2 mb-4 text-lg font-semibold text-gray-700 lg:text-xl">
                Órdenes Asignadas
              </h4>
              <div className="custom-scrollbar max-h-[300px] overflow-y-auto pr-2">
                <OrdenesProduccionList
                  cod_obra={obra.cod_obra}
                  onOrdenesLoaded={handleOrdenesLoaded}
                />
              </div>
            </div>

            {/* Acciones Disponibles */}
            <div className="mt-auto flex flex-col gap-4 border-t pt-6">
              <h4 className="mb-2 text-sm font-semibold tracking-widest text-gray-500 uppercase">
                Acciones
              </h4>
              <div className="flex flex-col gap-3">
                {/* Botón para crear orden de producción (solo si la producción no está finalizada) */}
                {isEnProduccion && (
                  <Button
                    onClick={onCrearOrden}
                    className="w-full cursor-pointer bg-green-600 py-4 text-base text-white transition-colors hover:bg-green-700 lg:py-5 lg:text-lg"
                  >
                    <CheckCircle className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
                    <span>Crear Orden</span>
                  </Button>
                )}

                {/* Botón Pedir Stock (solo si la obra no tiene un pedido activo) */}
                {obra.estado === 'PAGADA PARCIALMENTE' && (
                  <Button
                    onClick={() => setIsStockModalOpen(true)}
                    disabled={hasActivePedido}
                    variant="outline"
                    className="w-full cursor-pointer border-2 border-orange-500 bg-white py-4 text-base text-orange-600 transition-colors hover:bg-orange-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-500 disabled:opacity-50 lg:py-5 lg:text-lg"
                  >
                    <AlertTriangle className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
                    <span>
                      {hasActivePedido ? 'Pedido en Curso' : 'Pedir Stock'}
                    </span>

                  </Button>
                )}

                {puedeFinalizarProduccion && (
                  <Button
                    onClick={handleAbrirConfirmacion}
                    className="w-full cursor-pointer bg-amber-500 py-4 text-base text-white transition-colors hover:bg-amber-600 lg:py-5 lg:text-lg"
                  >
                    <CheckCircle className="mr-2 h-5 w-5 lg:h-6 lg:w-6" />
                    <span>Finalizar Producción</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <ProduccionActionModal
          isOpen={isConfirmModalOpen}
          title="Finalizar Producción"
          message="¿Estás seguro de que querés dar por finalizada la producción de la obra?"
          description="Esta acción va a cambiar el estado a PRODUCCION FINALIZADA."
          confirmLabel="Sí, finalizar"
          loadingLabel="Finalizando..."
          tone="amber"
          icon={<AlertTriangle className="h-6 w-6" />}
          summary={obraSummary}
          onConfirm={handleConfirmarFinalizar}
          onCancel={handleCerrarConfirmacion}
          loading={isFinalizando}
        />

        <SolicitarStockModal
          isOpen={isStockModalOpen}
          onClose={() => setIsStockModalOpen(false)}
          obraId={obra.cod_obra}
          onSuccess={() => onProduccionFinalizada?.()} // Reusing to refresh parent
        />
      </CardContent>
    </Card>
  )
}
