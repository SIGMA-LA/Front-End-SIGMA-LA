'use client'

import { X } from 'lucide-react'
import type { RolEmpleado } from '@/types'
import { useNotaFabrica } from '@/hooks/useNotaFabrica'
import { NotaViewer, NotaUploadForm } from './nota-fabrica/SeccionesNotaFabrica'

interface NotaFabricaModalProps {
  isOpen: boolean
  onClose: () => void
  notaUrl?: string | null
  codObra: number
  onUploadSuccess?: (url: string) => void
  rolActual?: RolEmpleado | ''
}

/**
 * Modal window to view, upload or delete the production note (PDF).
 * Refactored to separate business logic and UI sections.
 */
export default function NotaFabricaModal({
  isOpen,
  onClose,
  notaUrl,
  codObra,
  onUploadSuccess,
  rolActual = '',
}: NotaFabricaModalProps) {
  const {
    selectedFile,
    loading,
    isDeleting,
    error,
    modoCambio,
    handleFileChange,
    handleUpload,
    handleEliminar,
    handleCambioNota,
    resetState,
  } = useNotaFabrica({ codObra, onUploadSuccess, onClose })

  if (!isOpen) return null

  const handleClose = () => {
    if (!loading) {
      resetState()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4 lg:p-6">
      <div
        className="bg-opacity-50 absolute inset-0 bg-transparent backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-5 lg:p-7">
          <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl">
            Nota de Fábrica
          </h3>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 transition-colors hover:text-gray-600 disabled:cursor-not-allowed"
          >
            <X className="h-6 w-6 lg:h-7 lg:w-7" />
          </button>
        </div>

        {/* Content */}
        {notaUrl && !modoCambio ? (
          <NotaViewer
            notaUrl={notaUrl}
            rolActual={rolActual}
            loading={loading}
            isDeleting={isDeleting}
            error={error}
            onCambioNota={handleCambioNota}
            onEliminar={handleEliminar}
          />
        ) : (
          <NotaUploadForm
            selectedFile={selectedFile}
            loading={loading}
            error={error}
            notaUrlExists={!!notaUrl}
            onFileChange={handleFileChange}
            onUpload={handleUpload}
            onCancel={handleClose}
          />
        )}
      </div>
    </div>
  )
}
