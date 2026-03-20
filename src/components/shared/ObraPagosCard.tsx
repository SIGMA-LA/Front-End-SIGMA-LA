'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Pago, Obra } from '@/types'
import { Trash2, DollarSign, Calendar, Building2, User, ChevronDown, ChevronUp } from 'lucide-react'
import ConfirmDeleteModal from '../ventas/ConfirmDeleteModal'
import { deletePago } from '@/actions/pagos'

interface ObraPagosCardProps {
  obraInfo: Obra | undefined
  pagos: Pago[]
  totalPagado: number
  usuarioRol?: string
}

export default function ObraPagosCard({ obraInfo, pagos, totalPagado, usuarioRol }: ObraPagosCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [modalOpen, setModalOpen] = useState(false)
  const [pagoToDelete, setPagoToDelete] = useState<number | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleDelete = () => {
    if (!pagoToDelete) return
    startTransition(async () => {
      try {
        await deletePago(pagoToDelete)
        setModalOpen(false)
        setPagoToDelete(null)
        router.refresh()
      } catch (error) {
        console.error('Error al eliminar pago:', error)
        alert('Error al eliminar el pago')
      }
    })
  }

  const confirmDelete = (codPago: number) => {
    setPagoToDelete(codPago)
    setModalOpen(true)
  }

  const esVentas = usuarioRol === 'VENTAS'
  const esAdmin = usuarioRol === 'ADMIN'

  const nombreCliente = obraInfo?.cliente
    ? obraInfo.cliente.tipo_cliente === 'EMPRESA'
      ? obraInfo.cliente.razon_social
      : `${obraInfo.cliente.nombre ?? ''} ${obraInfo.cliente.apellido ?? ''}`.trim()
    : 'Cliente no identificado'

  return (
    <>
      <ConfirmDeleteModal
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setPagoToDelete(null); }}
        onConfirm={handleDelete}
        loading={isPending}
        title="Eliminar Pago"
        message={`¿Está seguro que desea eliminar este pago? Esta acción no se puede deshacer.`}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
        {/* Header de la Obra */}
        <div 
          className="flex cursor-pointer items-center justify-between border-b bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 transition-colors hover:from-blue-100 hover:to-blue-200"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">
              {obraInfo?.direccion || `Obra no especificada`}
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-green-200 px-3 py-1 text-xs font-semibold text-green-800 shadow-sm">
              Total pagado: $ {totalPagado.toLocaleString()}
            </span>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>
        </div>

        {/* Resumen del Cliente (Siempre visible) */}
        <div className="p-6 pb-2">
          <div className="mb-4 flex items-start gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Cliente</p>
              <p className="font-semibold text-gray-900 line-clamp-2">{nombreCliente}</p>
            </div>
          </div>
        </div>

        {/* Pagos Individuales (Desplegable) */}
        {isExpanded && (
          <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
            <h4 className="mb-3 text-sm font-medium text-gray-700">Historial de Pagos ({pagos.length})</h4>
            <div className="space-y-3">
              {pagos.map((pago) => (
                <div key={pago.cod_pago} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        Pago #{pago.cod_pago}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {new Date(pago.fecha_pago).toLocaleDateString('es-AR', {
                          timeZone: 'UTC',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-900">
                      $ {pago.monto.toLocaleString()}
                    </span>
                    {(esVentas || esAdmin) && (
                      <button
                        onClick={() => confirmDelete(pago.cod_pago)}
                        disabled={isPending}
                        className="rounded-md p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 transition-colors"
                        title="Eliminar Pago"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
