'use client'

import { Button } from '@/components/ui/Button'

interface ConfirmDeleteMaquinariaModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  maquinariaNombre: string
  isDeleting: boolean
}

export default function ConfirmDeleteMaquinariaModal({
  isOpen,
  onClose,
  onConfirm,
  maquinariaNombre,
  isDeleting,
}: ConfirmDeleteMaquinariaModalProps) {
  if (!isOpen) return null

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6">
        <div className="mb-4">
          <div className="mb-2 flex items-center">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Confirmar Eliminación
              </h3>
              <p className="text-sm text-gray-500">
                Esta acción no se puede deshacer
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-700">
            ¿Estás seguro de que quieres eliminar la maquinaria{' '}
            <span className="font-semibold text-gray-900">
              {maquinariaNombre}
            </span>
            ?
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Se eliminará permanentemente del sistema.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <svg
                  className="mr-2 -ml-1 h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Eliminando...
              </>
            ) : (
              'Eliminar'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
