'use client'

import { X, FileText, ExternalLink } from 'lucide-react'

interface PDFViewerModalProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string
  title?: string
}

export default function PDFViewerModal({
  isOpen,
  onClose,
  pdfUrl,
  title = 'Documento PDF',
}: PDFViewerModalProps) {
  if (!isOpen) return null

  const handleOpenInNewTab = () => {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-6">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-5xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-5 lg:p-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800 lg:text-xl">
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenInNewTab}
              className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
              title="Abrir en nueva pestaña"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Abrir en nueva pestaña</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="p-5 lg:p-6">
          <iframe
            src={pdfUrl}
            title={title}
            className="h-[70vh] w-full rounded border border-gray-200"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t bg-gray-50 p-4 lg:p-5">
          <button
            onClick={handleOpenInNewTab}
            className="flex items-center gap-2 rounded-lg border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
          >
            <ExternalLink className="h-4 w-4" />
            Abrir en nueva pestaña
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
