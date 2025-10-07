'use client'

import { X, Upload, FileText } from 'lucide-react'
import { useState } from 'react'
import api from '@/services/api/api'

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
  const [observaciones, setObservaciones] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

    try {
      setLoading(true)
      setError(null)

      const formData = new FormData()
      formData.append('cod_obra', obraCodigo.toString())
      formData.append('file', selectedFile)
      if (observaciones.trim()) {
        formData.append('observaciones', observaciones.trim())
      }

      // Llamar al endpoint del backend
      await api.post('/ordenes-produccion', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setSelectedFile(null)
      setObservaciones('')
      onSuccess?.()
      onClose()
    } catch (error: any) {
      console.error('Error al crear orden:', error)
      setError(error.response?.data?.message || 'Error al crear la orden de producción')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setSelectedFile(null)
      setObservaciones('')
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
            disabled={loading}
            className="text-gray-400 transition-colors hover:text-gray-600 disabled:cursor-not-allowed"
          >
            <X className="h-6 w-6 lg:h-7 lg:w-7" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-5 lg:space-y-6 lg:p-7">
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-gray-700 lg:text-base">
                Al crear una orden de producción se confirmará que la nota de fábrica es válida. Se
                solicitará a Coordinación que habilite esta Orden de Producción.
              </p>
            </div>

            <div className="space-y-3">
              <label
                htmlFor="orden-file"
                className="block text-sm font-medium text-gray-700 lg:text-base"
              >
                Subir Orden de Producción (PDF) *
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="orden-file"
                  className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors lg:h-64 ${
                    selectedFile
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {selectedFile ? (
                      <>
                        <FileText className="w-10 h-10 mb-3 text-green-600 lg:w-12 lg:h-12" />
                        <p className="mb-2 text-sm text-green-700 lg:text-base font-semibold">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-green-600 lg:text-sm">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 mb-3 text-gray-400 lg:w-12 lg:h-12" />
                        <p className="mb-2 text-sm text-gray-500 lg:text-base">
                          <span className="font-semibold">Click para subir</span> o
                          arrastra el archivo
                        </p>
                        <p className="text-xs text-gray-500 lg:text-sm">
                          Solo PDF (MAX. 10MB)
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    id="orden-file"
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
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
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