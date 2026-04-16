'use client'

import { useState, useEffect, useMemo } from 'react'
import { X, Info } from 'lucide-react'
import type { Entrega } from '@/types'
import { getActualViatico } from '@/actions/parametros'
import { getEntrega } from '@/actions/entregas'
import { DocumentViewer } from '@/components/shared/DocumentViewer'

import EntregaHeader from './entrega-details/EntregaHeader'
import EntregaInfoCards from './entrega-details/EntregaInfoCards'
import EntregaRecursosPersonal from './entrega-details/EntregaRecursosPersonal'
import OrdenProduccionSeccion from './entrega-details/OrdenProduccionSeccion'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EntregaDetailsModalProps {
  isOpen: boolean
  entrega: Entrega | null
  onClose: () => void
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EntregaDetailsModal({
  isOpen,
  entrega,
  onClose,
}: EntregaDetailsModalProps) {
  const [estaEntrega, setEstaEntrega] = useState<Entrega | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viaticoPorDia, setViaticoPorDia] = useState(0)
  const [activeOpIndex, setActiveOpIndex] = useState(0)
  const [viewerUrl, setViewerUrl] = useState('')
  const [viewerTitle, setViewerTitle] = useState('')
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  useEffect(() => {
    if (isOpen && entrega) {
      async function fetchData() {
        setLoading(true)
        setError(null)
        try {
          const [entregaData, params] = await Promise.all([
            getEntrega(entrega!.cod_entrega),
            getActualViatico(),
          ])
          setEstaEntrega(entregaData)
          setViaticoPorDia(params.viatico_dia_persona)
        } catch (err) {
          setError('Error al cargar los detalles de la entrega')
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    } else if (!isOpen) {
      setEstaEntrega(null)
      setViaticoPorDia(0)
    }
  }, [isOpen, entrega])

  useEffect(() => {
    setActiveOpIndex(0)
    setIsViewerOpen(false)
  }, [estaEntrega?.cod_entrega])

  const totalViaticos = useMemo(() => {
    if (!estaEntrega || !estaEntrega.dias_viaticos || viaticoPorDia <= 0) return 0
    const cantidadPersonas = estaEntrega.entrega_empleado?.length || 0
    return estaEntrega.dias_viaticos * cantidadPersonas * viaticoPorDia
  }, [estaEntrega, viaticoPorDia])

  if (!isOpen) return null

  if (loading) return <LoadingOverlay />
  if (error || !estaEntrega) return <ErrorOverlay error={error} onClose={onClose} />

  const nombreCliente = (estaEntrega.obra.cliente?.tipo_cliente === 'EMPRESA'
    ? estaEntrega.obra.cliente.razon_social
    : `${estaEntrega.obra.cliente?.nombre ?? ''} ${estaEntrega.obra.cliente?.apellido ?? ''}`.trim()) || 'N/A'

  const vehiculoData = estaEntrega.vehiculos?.[0] as { fecha_hora_ini_uso?: string; fecha_hora_ini_est?: string } | undefined

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
          <EntregaHeader entrega={estaEntrega} onClose={onClose} />

          <div className="space-y-6 overflow-y-auto bg-gray-50/50 p-6">
            <EntregaInfoCards
              entrega={estaEntrega}
              nombreCliente={nombreCliente}
              fechaSalida={vehiculoData?.fecha_hora_ini_uso}
              fechaRegreso={vehiculoData?.fecha_hora_ini_est}
            />

            <EntregaRecursosPersonal
              entrega={estaEntrega}
              viaticoPorDia={viaticoPorDia}
              totalViaticos={totalViaticos}
            />

            <OrdenProduccionSeccion
              ordenes={estaEntrega.ordenes_de_produccion || []}
              activeIndex={activeOpIndex}
              onIndexChange={setActiveOpIndex}
              onVerDocumento={(url, title) => { setViewerUrl(url); setViewerTitle(title); setIsViewerOpen(true) }}
            />

            {/* Notas de Carga */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold tracking-wider text-gray-900 uppercase">
                <Info className="h-4 w-4 text-blue-500" /> Notas de Carga
              </h3>
              <div className="space-y-4 rounded-lg border border-blue-50/50 bg-blue-50/30 p-4 text-sm text-gray-700">
                <div>
                  <span className="mb-1.5 block font-semibold text-gray-900">Detalle de Transporte:</span>
                  <p className="rounded-md border border-blue-100 bg-white p-3 text-sm leading-relaxed text-gray-800 shadow-sm">
                    {estaEntrega.detalle || 'Sin detalle de carga proporcionado'}
                  </p>
                </div>

                {(estaEntrega.estado === 'ENTREGADO' || estaEntrega.estado === 'CANCELADO') && (
                  <div className="border-t border-blue-200 pt-4">
                    <span className="mb-1.5 block font-semibold text-gray-900">Observaciones Extras:</span>
                    <p className={`rounded-md border p-3 text-sm ${estaEntrega.observaciones ? 'border-blue-50 bg-blue-100/40 text-gray-700 italic' : 'border-gray-100 bg-gray-50/50 text-gray-500'}`}>
                      {estaEntrega.observaciones || 'Sin observaciones adicionales registradas.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DocumentViewer url={viewerUrl} title={viewerTitle} isOpen={isViewerOpen} onClose={() => setIsViewerOpen(false)} />
    </>
  )
}

// ---------------------------------------------------------------------------
// Internal Overlays
// ---------------------------------------------------------------------------

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-12 text-center shadow-2xl">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p className="mt-4 font-medium tracking-tight text-gray-600">Cargando detalles de entrega...</p>
      </div>
    </div>
  )
}

function ErrorOverlay({ error, onClose }: { error: string | null; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
        <div className="mb-4 flex justify-center text-red-500">
          <X className="h-12 w-12 rounded-full bg-red-50 p-2" />
        </div>
        <p className="font-bold text-gray-700">{error || 'No se encontró la entrega.'}</p>
        <button onClick={onClose} className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700">
          Cerrar Ventana
        </button>
      </div>
    </div>
  )
}
