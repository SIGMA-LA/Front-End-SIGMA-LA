'use client'

import type { ReactNode } from 'react'
import { Mail, MapPin, Phone, X } from 'lucide-react'

type ModalTone = 'green' | 'amber'

export interface ProduccionActionSummary {
  entidadLabel: string
  entidadValor: string
  cliente: string
  direccion: string
  telefono?: string
  mail?: string
  estadoActual: string
}

interface ProduccionActionModalProps {
  isOpen: boolean
  title: string
  message: string
  description?: string
  confirmLabel: string
  loadingLabel: string
  icon: ReactNode
  tone?: ModalTone
  summary: ProduccionActionSummary
  warningTitle?: string
  warningText?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

const TONE_STYLES: Record<
  ModalTone,
  {
    iconBg: string
    iconColor: string
    noticeBox: string
    noticeTitle: string
    noticeText: string
    actionButton: string
  }
> = {
  green: {
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    noticeBox: 'border-green-200 bg-green-50',
    noticeTitle: 'text-green-900',
    noticeText: 'text-green-700',
    actionButton: 'bg-green-600 hover:bg-green-700',
  },
  amber: {
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    noticeBox: 'border-amber-200 bg-amber-50',
    noticeTitle: 'text-amber-900',
    noticeText: 'text-amber-700',
    actionButton: 'bg-amber-500 hover:bg-amber-600',
  },
}

export default function ProduccionActionModal({
  isOpen,
  title,
  message,
  description,
  confirmLabel,
  loadingLabel,
  icon,
  tone = 'amber',
  summary,
  warningTitle,
  warningText,
  onConfirm,
  onCancel,
  loading = false,
}: ProduccionActionModalProps) {
  if (!isOpen) return null

  const styles = TONE_STYLES[tone]

  const handleConfirm = () => {
    if (!loading) {
      onConfirm()
    }
  }

  const handleCancel = () => {
    if (!loading) {
      onCancel()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${styles.iconBg} ${styles.iconColor}`}
            >
              {icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={handleCancel}
            disabled={loading}
            aria-label="Cerrar modal"
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div className={`rounded-lg border p-4 ${styles.noticeBox}`}>
            <p className={`text-sm font-medium ${styles.noticeTitle}`}>
              {message}
            </p>
            {description && (
              <p className={`mt-1 text-sm ${styles.noticeText}`}>
                {description}
              </p>
            )}
          </div>

          <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div>
              <p className="text-xs font-medium text-gray-500">
                {summary.entidadLabel}
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {summary.entidadValor}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">Cliente</p>
              <p className="text-sm text-gray-900">{summary.cliente}</p>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
              <p className="text-sm text-gray-900">{summary.direccion}</p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{summary.telefono || 'Sin teléfono'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="truncate">{summary.mail || 'Sin mail'}</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">Estado actual</p>
              <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                {summary.estadoActual}
              </span>
            </div>

            {warningText && (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs font-medium text-amber-800">
                  {warningTitle || 'Advertencia'}
                </p>
                <p className="mt-1 text-xs text-amber-700">{warningText}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 border-t border-gray-200 bg-gray-50 p-4">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${styles.actionButton}`}
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {loadingLabel}
              </>
            ) : (
              <>{confirmLabel}</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
