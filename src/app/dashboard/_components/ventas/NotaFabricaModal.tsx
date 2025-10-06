'use client'

import { X, Upload, FileText, Trash2, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { uploadNotaFabrica, deleteNotaFabrica } from '@/actions/obras'

interface NotaFabricaModalProps {
  isOpen: boolean
  onClose: () => void
  notaUrl?: string | null
  codObra: number
  onUploadSuccess?: (url: string) => void
  rolActual?: string
}

export default function NotaFabricaModal({
  isOpen,
  onClose,
  notaUrl,
  codObra,
  onUploadSuccess,
  rolActual = '',
}: NotaFabricaModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modoCambio, setModoCambio] = useState(false)

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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      setError('Debe seleccionar un archivo PDF')
      return
    }
    try {
      setLoading(true)
      setError(null)

      const formData = new FormData()
      formData.append('file', selectedFile)

      const obraActualizada = await uploadNotaFabrica(codObra, formData)

      setSelectedFile(null)
      setModoCambio(false)
      onUploadSuccess?.(obraActualizada.nota_fabrica || '')
      onClose()
    } catch (err: any) {
      setError(
        err.message || 'Error al subir la nota de fábrica. Intenta nuevamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleEliminar = async () => {
    try {
      setLoading(true)
      setError(null)
      const obraActualizada = await deleteNotaFabrica(codObra)
      onUploadSuccess?.(obraActualizada.nota_fabrica || '')
      setModoCambio(false)
      onClose()
    } catch (err: any) {
      setError(
        err.message ||
          'Error al eliminar la nota de fábrica. Intenta nuevamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCambioNota = async () => {
    try {
      setLoading(true)
      setError(null)
      const obraActualizada = await deleteNotaFabrica(codObra)
      onUploadSuccess?.(obraActualizada.nota_fabrica || '')
      setModoCambio(true)
      setSelectedFile(null)
    } catch (err: any) {
      setError(
        err.message ||
          'Error al eliminar la nota de fábrica. Intenta nuevamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setSelectedFile(null)
      setError(null)
      setModoCambio(false)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-6">
      <div
        className="bg-opacity-50 absolute inset-0 bg-transparent backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl">
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
        {notaUrl && !modoCambio ? (
          <div className="p-5 lg:p-7">
            <iframe
              src={notaUrl}
              title="Nota de Fábrica"
              className="mb-4 h-[70vh] w-full rounded border"
            />
            {rolActual === 'VENTAS' && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCambioNota}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  Cambiar Nota
                </button>
                <button
                  type="button"
                  onClick={handleEliminar}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar Nota
                </button>
              </div>
            )}
            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-800 lg:text-base">
                  <span className="font-semibold">Error:</span> {error}
                </p>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleUpload}>
            <div className="space-y-5 p-5 lg:space-y-6 lg:p-7">
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-gray-700 lg:text-base">
                  {notaUrl
                    ? 'Puedes subir un nuevo archivo PDF para reemplazar la nota de fábrica actual.'
                    : 'No hay nota de fábrica adjunta. Sube un archivo PDF para asociarlo a la obra.'}
                </p>
              </div>
              <div className="space-y-3">
                <label
                  htmlFor="nota-file"
                  className="block text-sm font-medium text-gray-700 lg:text-base"
                >
                  Subir Nota de Fábrica (PDF) *
                </label>
                <div className="flex w-full items-center justify-center">
                  <label
                    htmlFor="nota-file"
                    className={`flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors lg:h-64 ${
                      selectedFile
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
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
                    <input
                      id="nota-file"
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      onChange={handleFileChange}
                      disabled={loading}
                    />
                  </label>
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
                disabled={loading}
                className="flex-1 rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 lg:px-6 lg:py-4 lg:text-base"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !selectedFile}
                className="flex-1 rounded-md border border-transparent bg-green-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 lg:px-6 lg:py-4 lg:text-base"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent lg:h-5 lg:w-5"></div>
                    Subiendo...
                  </div>
                ) : (
                  'Subir Nota'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
