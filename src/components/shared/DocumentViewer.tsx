'use client'

import { useEffect, useState } from 'react'
import { X, ExternalLink, FileText, ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface DocumentViewerProps {
  url: string
  title?: string
  isOpen: boolean
  onClose: () => void
}

export function DocumentViewer({ url, title = 'Documento', isOpen, onClose }: DocumentViewerProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Prevenir scroll en el body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
      setIsLoading(true) // Reset loader
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  if (!isOpen) return null

  // Deduct type from URL (Cloudinary may not have extensions sometimes, but usually it does for raw/pdf files, inside the string or we just try iframe)
  const isImage = url.match(/\.(jpeg|jpg|gif|png|webp|avif)$/i) != null || url.includes('/image/upload/')
  const isPdf = url.match(/\.pdf$/i) != null || url.includes('.pdf')

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/75 p-4 backdrop-blur-sm sm:p-6 lg:p-8">
      {/* Click externo para cerrar */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative flex h-full max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-gray-200 lg:max-h-[95vh]">
        
        {/* Header del Visor */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 min-w-0 flex-grow">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
              {isImage ? <ImageIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
            </div>
            <h3 className="truncate text-base font-semibold text-gray-900 sm:text-lg">
              {title}
            </h3>
          </div>
          
          <div className="ml-4 flex flex-shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex text-gray-600 bg-white hover:bg-gray-50 hover:text-gray-900"
              onClick={() => window.open(url, '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Abrir en nueva pestaña
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full border-none"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Contenido principal del Visor */}
        <div className="relative flex-grow overflow-auto bg-gray-100/50 p-4 sm:p-6">
          
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-50/80 backdrop-blur-sm">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-4" />
              <p className="text-sm font-medium text-gray-600 animate-pulse">Cargando documento...</p>
            </div>
          )}

          <div className="flex h-full w-full items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
            {isImage && !isPdf ? (
               // Renderización de Imagen
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={url}
                alt={title}
                className="max-h-full max-w-full object-contain transition-opacity duration-300"
                style={{ opacity: isLoading ? 0 : 1 }}
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
              />
            ) : (
              // iframe general para PDFs u otros formatos donde el navegador nativamente hace render
              <iframe
                src={url}
                className="h-full w-full border-0 transition-opacity duration-300"
                style={{ opacity: isLoading ? 0 : 1 }}
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
                title={title}
              />
            )}
          </div>
        </div>
        
        {/* Footer responsivo de botones para móviles */}
        <div className="border-t border-gray-100 bg-gray-50 p-4 sm:hidden flex justify-between gap-3">
           <Button
              variant="outline"
              className="flex-1 text-gray-700 bg-white"
              onClick={() => window.open(url, '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Ver original
            </Button>
            <Button className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700" onClick={onClose}>
              Cerrar Visor
            </Button>
        </div>
      </div>
    </div>
  )
}
