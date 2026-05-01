'use client'

import { X, Upload, FileText, Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { crearOrdenProduccion } from '@/actions/ordenes'
import { notify } from '@/lib/toast'

interface CrearOrdenModalProps {
  isOpen: boolean
  onClose: () => void
  obraCodigo?: number
  onSuccess?: () => void
}

export default function CrearOrdenModal({
  isOpen,
  onClose,
  obraCodigo,
  onSuccess,
}: CrearOrdenModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [isPending, startTransition] = useTransition()

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Solo se permiten archivos PDF')
        setSelectedFile(null)
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('El archivo no puede superar los 10MB')
        setSelectedFile(null)
        return
      }
      setSelectedFile(file)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      setError('Debe seleccionar un archivo PDF')
      return
    }

    if (!obraCodigo) {
      setError('No se pudo identificar la obra')
      return
    }

    const formData = new FormData()
    formData.append('cod_obra', obraCodigo.toString())
    formData.append('file', selectedFile)

    setError(null)

    startTransition(async () => {
      try {
        const result = await crearOrdenProduccion(formData)
        if (result.success) {
          setSelectedFile(null)
          notify.success('Orden de produccion registrada correctamente.')
          onSuccess?.()
          onClose()
        } else {
          const message = result.error || 'Ocurrió un error inesperado.'
          setError(message)
          notify.error(message)
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Ocurrió un error inesperado.'
        setError(message)
        notify.error(message)
      }
    })
  }

  const handleClose = () => {
    if (!isPending) {
      setSelectedFile(null)
      setError(null)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-6">
      <div
        className="bg-opacity-50 absolute inset-0 bg-transparent backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-lg rounded-lg bg-white shadow-xl lg:max-w-2xl">
        <div className="flex items-center justify-between border-b p-5 lg:p-7">
          <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl">
            Crear Orden de Producción
          </h3>
          <button
            onClick={handleClose}
            disabled={isPending}
            className="text-gray-400 transition-colors hover:text-gray-600 disabled:cursor-not-allowed"
          >
            <X className="h-6 w-6 lg:h-7 lg:w-7" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-5 lg:space-y-6 lg:p-7">
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-gray-700 lg:text-base">
                Al crear una orden de producción se confirmará que la nota de
                fábrica es válida. Se solicitará a Coordinación que habilite
                esta Orden de Producción.
              </p>
            </div>

            <div className="space-y-3">
              <label
                htmlFor="orden-file"
                className="block text-sm font-medium text-gray-700 lg:text-base"
              >
                Subir Orden de Producción (PDF) *
              </label>
              <div className="relative flex w-full items-center justify-center">
                {' '}
                {/* 1. Contenedor relativo */}
                <label
                  htmlFor="orden-file"
                  className={`flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors lg:h-64 ${selectedFile
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    } ${isPending ? 'opacity-50' : ''}`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {/* ... (contenido interno del label sin cambios) ... */}
                    {selectedFile ? (
                      <>
                        <FileText className="mb-3 h-10 w-10 text-green-600 lg:h-12 lg:w-12" />
                        <p className="mb-2 text-sm font-semibold text-green-700 lg:text-base">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-green-600 lg:text-sm">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="mb-3 h-10 w-10 text-gray-400 lg:h-12 lg:w-12" />
                        <p className="mb-2 text-sm text-gray-500 lg:text-base">
                          <span className="font-semibold">
                            Click para subir
                          </span>{' '}
                          o arrastra el archivo
                        </p>
                        <p className="text-xs text-gray-500 lg:text-sm">
                          Solo PDF (MAX. 10MB)
                        </p>
                      </>
                    )}
                  </div>
                </label>
                {/* 2. CORRECCIÓN CLAVE AQUÍ */}
                <input
                  id="orden-file"
                  type="file"
                  // ANTERIORMENTE: className="hidden"
                  // CORRECCIÓN: Hacemos el input invisible pero funcional
                  className="absolute h-full w-full cursor-pointer opacity-0"
                  accept=".pdf"
                  onChange={handleFileChange}
                  disabled={isPending}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-800 lg:text-base">
                  <span className="font-semibold">Error:</span> {error}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-3 rounded-b-lg border-t bg-gray-50 p-5 sm:flex-row sm:space-y-0 sm:space-x-4 lg:p-7">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="flex-1 rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 lg:px-6 lg:py-4 lg:text-base"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending || !selectedFile}
              className="flex-1 rounded-md border border-transparent bg-green-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 lg:px-6 lg:py-4 lg:text-base"
            >
              {isPending ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creando orden...
                </div>
              ) : (
                'Crear Orden'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
