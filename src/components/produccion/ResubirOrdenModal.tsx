'use client'

import { X, Upload, FileText, Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { updateOrdenProduccion } from '@/actions/ordenes'
import { notify } from '@/lib/toast'

interface ResubirOrdenModalProps {
  isOpen: boolean
  onClose: () => void
  cod_op: number
  onSuccess?: () => void
}

export default function ResubirOrdenModal({
  isOpen,
  onClose,
  cod_op,
  onSuccess,
}: ResubirOrdenModalProps) {
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

    const formData = new FormData()
    formData.append('file', selectedFile)

    setError(null)

    startTransition(async () => {
      try {
        const result = await updateOrdenProduccion(cod_op, formData)
        if (result.success) {
          setSelectedFile(null)
          notify.success('Orden de producción actualizada correctamente.')
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
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl lg:max-w-lg">
        <div className="flex items-center justify-between border-b border-gray-200 p-6 lg:p-8">
          <h2 className="text-xl font-bold text-gray-900 lg:text-2xl">
            Resubir Orden de Producción
          </h2>
          <button
            onClick={handleClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 lg:p-8">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="file-upload"
                className="block text-sm font-medium text-gray-700 lg:text-base"
              >
                Seleccionar archivo PDF
              </label>
              <div className="mt-2">
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 lg:file:text-base"
                />
              </div>
              {selectedFile && (
                <div className="mt-4 flex items-center space-x-3 rounded-lg border border-green-200 bg-green-50 p-4">
                  <FileText className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-green-600">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex space-x-3 lg:space-x-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 lg:px-6 lg:py-4 lg:text-base"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending || !selectedFile}
                className="flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 lg:px-6 lg:py-4 lg:text-base"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    Resubir OP
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}