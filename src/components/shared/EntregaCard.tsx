'use client'

import { useState } from 'react'
import {
  Calendar,
  Clock,
  User,
  PackageOpen,
  Eye,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import type { Entrega } from '@/types'
import EntregaDetailsModal from './EntregaDetailsModal'
import { useRouter } from 'next/navigation'
import { cancelarEntrega } from '@/actions/entregas'
import { notify } from '@/lib/toast'

interface EntregaCardProps {
  entrega: Entrega
}

export default function EntregaCard({ entrega }: EntregaCardProps) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [isPendingAction, setIsPendingAction] = useState(false)
  const [motivoCancelacion, setMotivoCancelacion] = useState('')

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'text-yellow-600 bg-yellow-50'
      case 'ENTREGADO':
        return 'text-green-600 bg-green-50'
      case 'CANCELADO':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (estado: string) => {
    const estados: { [key: string]: string } = {
      PENDIENTE: 'PENDIENTE',
      ENTREGADO: 'ENTREGADA',
      CANCELADO: 'CANCELADA',
    }
    return estados[estado] || estado
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Argentina/Buenos_Aires',
    })
  }

  const getEncargado = () => {
    const encargado = entrega.entrega_empleado?.find(
      (e) => e.rol_entrega === 'ENCARGADO'
    )
    return encargado
      ? `${encargado.empleado.nombre} ${encargado.empleado.apellido}`
      : 'No asignado'
  }

  const handleCancelar = async () => {
    if (!motivoCancelacion.trim()) {
      notify.warning('Debe ingresar un motivo para cancelar la entrega.')
      return
    }

    setIsPendingAction(true)
    try {
      const result = await cancelarEntrega(
        entrega.cod_entrega,
        motivoCancelacion
      )
      if (result.success) {
        notify.success('Entrega cancelada exitosamente.')
        setIsCancelling(false)
        router.refresh()
      } else {
        notify.error(result.error || 'Error al cancelar la entrega.')
      }
    } catch {
      notify.error('Error de red al intentar cancelar.')
    } finally {
      setIsPendingAction(false)
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center justify-between border-b bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-3">
          <h3 className="text-lg font-semibold text-gray-800">
            {entrega.obra?.direccion || 'Dirección no disponible'}
          </h3>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-bold shadow-sm ${
              entrega.esFinal
                ? 'border-indigo-200 bg-indigo-100 text-indigo-700'
                : 'border-cyan-200 bg-cyan-100 text-cyan-700'
            }`}
          >
            {entrega.esFinal ? 'Entrega Final' : 'Entrega Parcial'}
          </span>
        </div>

        <div className="p-6">
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Fecha</p>
                <p className="font-medium text-gray-900">
                  {formatDate(entrega.fecha_hora_entrega)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Hora</p>
                <p className="font-medium text-gray-900">
                  {formatTime(entrega.fecha_hora_entrega)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Encargado</p>
                <p className="font-medium text-gray-900">{getEncargado()}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                <PackageOpen className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Estado</p>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(entrega.estado)}`}
                >
                  {getStatusText(entrega.estado)}
                </span>
              </div>
            </div>
          </div>

          {entrega.detalle && (
            <div className="mb-3 rounded-lg bg-gray-50 p-3">
              <p className="text-sm font-medium text-gray-700">
                Detalle: {entrega.detalle}
              </p>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-4">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition-all hover:bg-blue-100"
            >
              <Eye className="h-4 w-4" />
              Detalle Completo
            </button>

            {entrega.estado === 'PENDIENTE' && (
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    router.push(
                      `/coordinacion/entregas/${entrega.cod_entrega}/editar`
                    )
                  }
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg active:scale-95"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </button>
                <button
                  onClick={() => setIsCancelling(true)}
                  className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition-all hover:border-red-300 hover:bg-red-50 active:scale-95"
                >
                  <Trash2 className="h-4 w-4" />
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Cancelación */}
      {isCancelling && (
        <div className="animate-in fade-in fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm duration-200">
          <div className="animate-in zoom-in-95 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200/60 duration-200">
            <div className="flex items-center gap-3 border-b border-slate-100 bg-red-50/50 px-6 py-4">
              <div className="rounded-full bg-red-100 p-2 shadow-inner">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Cancelar Entrega
              </h3>
            </div>

            <div className="p-6">
              <p className="mb-4 text-sm leading-relaxed text-slate-600">
                ¿Está seguro de que desea cancelar la entrega para{' '}
                <span className="font-bold text-slate-800">
                  {entrega.obra?.direccion}
                </span>
                ? Esta acción liberará los recursos asignados.
              </p>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  Motivo de la cancelación *
                </label>
                <textarea
                  value={motivoCancelacion}
                  onChange={(e) => setMotivoCancelacion(e.target.value)}
                  placeholder="Ej: Cambio de fecha solicitado por el cliente, falta de material..."
                  className="min-h-[100px] w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm transition-all focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCancelling(false)}
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100"
                  disabled={isPendingAction}
                >
                  No, volver
                </button>
                <button
                  type="button"
                  onClick={handleCancelar}
                  disabled={isPendingAction || !motivoCancelacion.trim()}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none disabled:opacity-50"
                >
                  {isPendingAction ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Confirmar Cancelación'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <EntregaDetailsModal
          isOpen={showModal}
          entrega={entrega}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
