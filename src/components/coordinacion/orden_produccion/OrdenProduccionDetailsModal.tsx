'use client'

import { useState } from 'react'
import {
  X,
  Package,
  Calendar,
  MapPin,
  FileText,
  User,
  Building2,
  Eye,
  ExternalLink,
} from 'lucide-react'
import type { OrdenProduccion } from '@/types'
import PDFViewerModal from './PDFViewerModal'

interface OrdenProduccionDetailsModalProps {
  isOpen: boolean
  orden: OrdenProduccion | null
  onClose: () => void
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const getEstadoInfo = (estado: string) => {
  switch (estado) {
    case 'PENDIENTE':
      return {
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        borderColor: 'border-yellow-200',
        badgeColor: 'bg-yellow-500',
      }
    case 'APROBADA':
      return {
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200',
        badgeColor: 'bg-blue-500',
      }
    case 'EN PRODUCCION':
      return {
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        borderColor: 'border-green-200',
        badgeColor: 'bg-green-500',
      }
    case 'FINALIZADA':
      return {
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-700',
        borderColor: 'border-gray-200',
        badgeColor: 'bg-gray-500',
      }
    default:
      return {
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-700',
        borderColor: 'border-gray-200',
        badgeColor: 'bg-gray-400',
      }
  }
}

export default function OrdenProduccionDetailsModal({
  isOpen,
  orden,
  onClose,
}: OrdenProduccionDetailsModalProps) {
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false)

  if (!isOpen || !orden) return null

  const estadoInfo = getEstadoInfo(orden.estado)

  const handleOpenPDF = () => {
    setIsPDFModalOpen(true)
  }

  const handleOpenInNewTab = () => {
    if (orden.url) {
      window.open(orden.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Orden de Producción
              </h2>
              <p className="text-sm text-gray-600">Código #{orden.cod_op}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Estado */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Estado Actual
              </label>
              <div
                className={`rounded-lg border p-4 ${estadoInfo.borderColor} ${estadoInfo.bgColor}`}
              >
                <span
                  className={`inline-block rounded-lg px-3 py-1 text-sm font-semibold text-white ${estadoInfo.badgeColor}`}
                >
                  {orden.estado}
                </span>
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar className="h-4 w-4" />
                  Fecha de Confección
                </label>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="font-medium text-gray-900">
                    {formatDate(orden.fecha_confeccion)}
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar className="h-4 w-4" />
                  Fecha de Validación
                </label>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="font-medium text-gray-900">
                    {formatDate(orden.fecha_validacion)}
                  </p>
                </div>
              </div>
            </div>

            {/* Información de la Obra */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Building2 className="h-4 w-4" />
                Información de la Obra
              </label>
              <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div>
                  <p className="text-xs text-gray-500">Código de Obra</p>
                  <p className="font-mono text-sm font-semibold text-gray-900">
                    #{orden.cod_obra}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Estado de la Obra</p>
                  <p className="text-sm font-medium text-gray-900">
                    {orden.obra?.estado || 'N/A'}
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Dirección</p>
                    <p className="text-sm text-gray-900">
                      {orden.obra?.direccion || 'Sin dirección'}
                    </p>
                    {orden.obra?.localidad?.nombre_localidad && (
                      <p className="text-xs text-gray-500">
                        {orden.obra.localidad.nombre_localidad}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Información del Cliente */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="h-4 w-4" />
                Información del Cliente
              </label>
              <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div>
                  <p className="text-xs text-gray-500">Razón Social</p>
                  <p className="text-sm font-medium text-gray-900">
                    {orden.obra?.cliente?.razon_social || 'N/A'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">CUIL</p>
                    <p className="font-mono text-sm text-gray-900">
                      {orden.obra?.cliente?.cuil || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Teléfono</p>
                    <p className="text-sm text-gray-900">
                      {orden.obra?.cliente?.telefono || 'N/A'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">
                    {orden.obra?.cliente?.mail || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Documento */}
            {orden.url && (
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FileText className="h-4 w-4" />
                  Documento PDF
                </label>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      onClick={handleOpenPDF}
                      className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      <Eye className="h-4 w-4" />
                      Ver PDF
                    </button>
                    <button
                      onClick={handleOpenInNewTab}
                      className="flex items-center justify-center gap-2 rounded-lg border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Abrir en nueva pestaña
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-gray-600 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Modal de visualización de PDF */}
      {orden.url && (
        <PDFViewerModal
          isOpen={isPDFModalOpen}
          onClose={() => setIsPDFModalOpen(false)}
          pdfUrl={orden.url}
          title={`Orden de Producción #${orden.cod_op}`}
        />
      )}
    </div>
  )
}
