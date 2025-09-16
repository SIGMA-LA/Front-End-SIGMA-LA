'use client'

import { useState } from 'react'
import {
  Package,
  Phone,
  Mail,
  Building2,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  X,
} from 'lucide-react'

interface RegistrarPedidoProps {
  onCancel: () => void
  onSubmit: (pedidoData: any) => void
  preloadedObra?: any | null
}

interface ModalConfirmacionProps {
  isOpen: boolean
  pedidoData: any
  onConfirm: () => void
  onCancel: () => void
}

// Texto de materiales hardcodeado
const materialesTexto = `• PERFILES DE ALUMINIO - MARCO: Perfiles principales para marcos de ventanas y puertas Serie 4000 anodizado natural, aproximadamente 450 metros lineales. PRIORIDAD ALTA.

• PERFILES DE ALUMINIO - HOJA: Perfiles para hojas móviles y fijas Serie 4000 anodizado natural, aproximadamente 320 metros lineales. PRIORIDAD ALTA.

• VIDRIOS LAMINADOS: Vidrios de seguridad laminados 4+4mm con PVB transparente, aproximadamente 85 m². PRIORIDAD MEDIA.

• HERRAJES Y ACCESORIOS: Bisagras, manijas, cerraduras, burletes y tornillería específica para aluminio. Kit completo para 12 aberturas. PRIORIDAD MEDIA.

• SELLADORES Y ADHESIVOS: Silicona estructural y sellador neutro para montaje e impermeabilización. 8 tubos de silicona estructural + 6 tubos sellador neutro. PRIORIDAD BAJA.`

function ModalConfirmacion({
  isOpen,
  pedidoData,
  onConfirm,
  onCancel,
}: ModalConfirmacionProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <Package className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Confirmar Pedido de Stock
            </h3>
            <p className="text-sm text-gray-600">
              Se cambiará el estado de la obra y se notificará a la fábrica.
            </p>
          </div>
        </div>

        <div className="mb-6 space-y-3 rounded-lg bg-gray-50 p-4">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Obra:</span>
            <span className="text-gray-900">{pedidoData.obra?.direccion}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Cliente:</span>
            <span className="text-gray-900">
              {pedidoData.obra?.cliente?.nombre} {pedidoData.obra?.cliente?.apellido}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Fecha de solicitud:</span>
            <span className="text-gray-900">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mb-4 rounded-lg bg-blue-50 p-3">
          <p className="text-sm text-blue-800">
            Al confirmar, se registrará la obra en estado 'A producir'. El cambio es irreversible.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-700"
          >
            Confirmar Pedido
          </button>
        </div>
      </div>
    </div>
  )
}

export default function RegistrarPedido({
  onCancel,
  onSubmit,
  preloadedObra,
}: RegistrarPedidoProps) {
  const [showModal, setShowModal] = useState(false)

  const handleConfirm = () => {
    const pedidoData = {
      id: Date.now(),
      obra: preloadedObra,
      fechaPedido: new Date().toISOString().split('T')[0],
      materialesTexto: materialesTexto,
      estado: 'stock_solicitado',
    }

    setShowModal(false)
    onSubmit(pedidoData)
  }

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Registrar Pedido de Stock
              </h1>
              {preloadedObra && (
                <div className="mt-3 rounded-lg bg-blue-50 p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Detalles de la Obra:</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Dirección:</span> {preloadedObra.direccion}</p>
                    <p><span className="font-medium">Cliente:</span> {`${preloadedObra.cliente.nombre} ${preloadedObra.cliente.apellido}`}</p>
                    <p><span className="font-medium">Presupuesto:</span> ${preloadedObra.presupuesto?.toLocaleString()}</p>
                    <p><span className="font-medium">Estado actual:</span> {preloadedObra.estado}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Información de contacto ALUAR */}
            <div className="mb-8 rounded-lg border border-orange-200 bg-orange-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-orange-800">
                  Contacto Fábrica ALUAR
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-700">Teléfono:</span>
                  <a
                    href="tel:+542804421200"
                    className="text-orange-800 underline hover:text-orange-900"
                  >
                    +54 2804 421200
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-700">Email:</span>
                  <a
                    href="mailto:pedidos@aluar.com.ar"
                    className="text-orange-800 underline hover:text-orange-900"
                  >
                    pedidos@aluar.com.ar
                  </a>
                </div>
              </div>
            </div>

            {/* Detalle de materiales */}
            <div className="mb-8">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Package className="h-5 w-5 text-orange-600" />
                Materiales requeridos para la obra
              </h3>
              
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                  {materialesTexto}
                </pre>
              </div>
            </div>

            {/* Instrucciones */}
            <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">Instrucciones para el pedido:</h4>
                  <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                    <li>Contacte a ALUAR usando los datos de contacto proporcionados arriba</li>
                    <li>Envíe el detalle completo de materiales mostrado arriba</li>
                    <li>Coordine fecha de entrega según cronograma de la obra</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="rounded-lg bg-orange-600 px-6 py-2 font-medium text-white transition-colors hover:bg-orange-700"
              >
                Marcar como Solicitado
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      <ModalConfirmacion
        isOpen={showModal}
        pedidoData={{obra: preloadedObra }}
        onConfirm={handleConfirm}
        onCancel={() => setShowModal(false)}
      />
    </>
  )
}