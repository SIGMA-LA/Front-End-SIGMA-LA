'use client'

import { useState } from 'react'
import {
  Package,
  Phone,
  Mail,
  Building2,
  FileText,
  Loader2,
} from 'lucide-react'
import { solicitarStockObra } from '@/actions/obras'
import type { Obra } from '@/types'
import { notify } from '@/lib/toast'

interface RegistrarPedidoProps {
  onCancel: () => void
  onSubmit: (obraActualizada: Obra) => void
  preloadedObra?: Obra | null
}

interface ModalConfirmacionProps {
  isOpen: boolean
  obra: Obra
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
  error: string | null
}

// --- CONSTANTES ---
const materialesTexto = `• PERFILES DE ALUMINIO - MARCO: Perfiles principales para marcos de ventanas y puertas Serie 4000 anodizado natural, aproximadamente 450 metros lineales. PRIORIDAD ALTA.

• PERFILES DE ALUMINIO - HOJA: Perfiles para hojas móviles y fijas Serie 4000 anodizado natural, aproximadamente 320 metros lineales. PRIORIDAD ALTA.

• VIDRIOS LAMINADOS: Vidrios de seguridad laminados 4+4mm con PVB transparente, aproximadamente 85 m². PRIORIDAD MEDIA.

• HERRAJES Y ACCESORIOS: Bisagras, manijas, cerraduras, burletes y tornillería específica para aluminio. Kit completo para 12 aberturas. PRIORIDAD MEDIA.

• SELLADORES Y ADHESIVOS: Silicona estructural y sellador neutro para montaje e impermeabilización. 8 tubos de silicona estructural + 6 tubos sellador neutro. PRIORIDAD BAJA.`

function ModalConfirmacion({
  isOpen,
  obra,
  onConfirm,
  onCancel,
  loading,
  error,
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
            <span className="text-right text-gray-900">{obra.direccion}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Cliente:</span>
            <span className="text-right text-gray-900">
              {obra.cliente.razon_social}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">
              Fecha de solicitud:
            </span>
            <span className="text-gray-900">
              {new Date().toLocaleDateString('es-AR')}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="mb-4 rounded-lg bg-blue-50 p-3">
          <p className="text-sm text-blue-800">
            Al confirmar, la obra pasará al estado &quot;EN ESPERA DE
            STOCK&quot;.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-400"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Confirmando...
              </>
            ) : (
              'Confirmar Pedido'
            )}
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    if (!preloadedObra) return

    setLoading(true)
    setError(null)
    try {
      const obraActualizada = await solicitarStockObra(preloadedObra.cod_obra)

      setShowModal(false)
      notify.success('Pedido de stock registrado correctamente.')
      onSubmit(obraActualizada)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al solicitar el stock.'
      setError(message)
      notify.error(message)
    } finally {
      setLoading(false)
    }
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
                  <h3 className="mb-2 font-semibold text-blue-800">
                    Detalles de la Obra:
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Dirección:</span>{' '}
                      {preloadedObra.direccion}
                    </p>
                    <p>
                      <span className="font-medium">Cliente:</span>{' '}
                      {preloadedObra.cliente.razon_social}
                    </p>
                    <p>
                      <span className="font-medium">Estado actual:</span>{' '}
                      {preloadedObra.estado}
                    </p>
                  </div>
                </div>
              )}
            </div>

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

            <div className="mb-8">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Package className="h-5 w-5 text-orange-600" />
                Materiales requeridos para la obra
              </h3>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                <pre className="font-mono text-sm whitespace-pre-wrap text-gray-800">
                  {materialesTexto}
                </pre>
              </div>
            </div>

            <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="mb-2 font-medium text-blue-800">
                    Instrucciones para el pedido:
                  </h4>
                  <ul className="list-inside list-disc space-y-1 text-sm text-blue-700">
                    <li>
                      Contacte a ALUAR usando los datos de contacto
                      proporcionados arriba.
                    </li>
                    <li>
                      Envíe el detalle completo de materiales mostrado en esta
                      pantalla.
                    </li>
                    <li>
                      Coordine la fecha de entrega según el cronograma de la
                      obra.
                    </li>
                    <li>
                      Una vez realizado el pedido, marque esta obra como
                      &quot;Solicitado&quot;.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-6 py-2 font-medium text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-400"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Procesando...</span>
                  </>
                ) : (
                  'Marcar como Solicitado'
                )}
              </button>
            </div>
            {error && <p className="mt-4 text-center text-red-600">{error}</p>}
          </div>
        </div>
      </div>

      {preloadedObra && (
        <ModalConfirmacion
          isOpen={showModal}
          obra={preloadedObra}
          onConfirm={handleConfirm}
          onCancel={() => setShowModal(false)}
          loading={loading}
          error={error}
        />
      )}
    </>
  )
}
