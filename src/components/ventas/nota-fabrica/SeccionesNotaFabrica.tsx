'use client'

import { FileText, RefreshCw, Trash2, Loader2, Upload, X } from 'lucide-react'
import type { RolEmpleado } from '@/types'

interface NotaViewerProps {
  notaUrl: string
  rolActual: RolEmpleado | ''
  loading: boolean
  isDeleting: boolean
  error: string | null
  onCambioNota: () => void
  onEliminar: () => void
}

export function NotaViewer({
  notaUrl,
  rolActual,
  loading,
  isDeleting,
  error,
  onCambioNota,
  onEliminar,
}: NotaViewerProps) {
  return (
    <div className="p-5 lg:p-7">
      <div className="mb-4 rounded-lg border border-gray-200">
        <iframe
          src={notaUrl}
          title="Nota de Fábrica"
          className="h-[70vh] w-full rounded"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          href={notaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-md border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
        >
          <FileText className="h-4 w-4" />
          Abrir en nueva pestaña
        </a>
        {rolActual === 'VENTAS' && (
          <>
            <button
              type="button"
              onClick={onCambioNota}
              disabled={loading || isDeleting}
              className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading && !isDeleting ? 'animate-spin' : ''}`} />
              Cambiar Nota
            </button>
            <button
              type="button"
              onClick={onEliminar}
              disabled={loading || isDeleting}
              className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {isDeleting ? 'Eliminando...' : 'Eliminar Nota'}
            </button>
          </>
        )}
      </div>
      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800 lg:text-base">
            <span className="font-semibold">Error:</span> {error}
          </p>
        </div>
      )}
    </div>
  )
}

interface NotaUploadFormProps {
  selectedFile: File | null
  loading: boolean
  error: string | null
  notaUrlExists: boolean
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onUpload: (e: React.FormEvent) => void
  onCancel: () => void
}

export function NotaUploadForm({
  selectedFile,
  loading,
  error,
  notaUrlExists,
  onFileChange,
  onUpload,
  onCancel,
}: NotaUploadFormProps) {
  return (
    <form onSubmit={onUpload}>
      <div className="space-y-5 p-5 lg:space-y-6 lg:p-7">
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-gray-700 lg:text-base">
            {notaUrlExists
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
                      <span className="font-semibold">Click para subir</span> o arrastra el archivo
                    </p>
                    <p className="text-xs text-gray-500 lg:text-sm">Solo PDF (MAX. 10MB)</p>
                  </>
                )}
              </div>
              <input
                id="nota-file"
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={onFileChange}
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
          onClick={onCancel}
          disabled={loading}
          className="flex-1 rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 lg:px-6 lg:py-4 lg:text-base"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || !selectedFile}
          className="flex-1 rounded-md border border-transparent bg-green-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50 lg:px-6 lg:py-4 lg:text-base"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent lg:h-5 lg:w-5" />
              Subiendo...
            </div>
          ) : (
            'Subir Nota'
          )}
        </button>
      </div>
    </form>
  )
}
