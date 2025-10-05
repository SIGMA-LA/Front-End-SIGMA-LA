'use client'

import { X, Upload } from 'lucide-react'

interface CrearOrdenModalProps {
  isOpen: boolean
  onClose: () => void
  obraCodigo?: number
}

export default function CrearOrdenModal({
  isOpen,
  onClose,
  obraCodigo,
}: CrearOrdenModalProps) {
  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implementar lógica para crear orden de producción
    alert('Funcionalidad en desarrollo: Crear orden de producción')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-6">
      {/* Overlay */}
      <div
        className="bg-opacity-50 absolute inset-0 bg-transparent backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-lg bg-white shadow-xl lg:max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-5 lg:p-7">
          <h3 className="text-lg font-semibold text-gray-800 lg:text-2xl">
            Crear Orden de Producción
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <X className="h-6 w-6 lg:h-7 lg:w-7" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-5 lg:space-y-6 lg:p-7">
            {/* Alert de confirmación de nota de fábrica */}
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-gray-700 lg:text-base">
                Al crear una orden de producción, se confirmará que la nota de fábrica es válida y se
                requerirá a Coordinación que la habilite.
              </p>
              
            </div>

            {/* Upload de archivo */}
            <div className="space-y-3">
              <label
                htmlFor="orden-file"
                className="block text-sm font-medium text-gray-700 lg:text-base"
              >
                Subir Orden de Producción (PDF o Imagen)
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="orden-file"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors lg:h-64"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400 lg:w-12 lg:h-12" />
                    <p className="mb-2 text-sm text-gray-500 lg:text-base">
                      <span className="font-semibold">Click para subir</span> o
                      arrastra el archivo
                    </p>
                    <p className="text-xs text-gray-500 lg:text-sm">
                      PDF, PNG, JPG o JPEG (MAX. 10MB)
                    </p>
                  </div>
                  <input
                    id="orden-file"
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                  />
                </label>
              </div>
            </div>

            {/* Mensaje de funcionalidad en desarrollo */}
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
              <p className="text-sm text-yellow-800 lg:text-base">
                <span className="font-semibold">⚠️ Funcionalidad en desarrollo:</span> El
                endpoint para crear órdenes de producción aún no está implementado.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col space-y-3 rounded-b-lg border-t bg-gray-50 p-5 sm:flex-row sm:space-y-0 sm:space-x-4 lg:p-7">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:outline-none lg:px-6 lg:py-4 lg:text-base"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md border border-transparent bg-green-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none lg:px-6 lg:py-4 lg:text-base"
            >
              Crear Orden
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}