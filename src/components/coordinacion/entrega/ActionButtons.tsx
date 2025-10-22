'use client'

import { Loader2 } from 'lucide-react'

interface ActionButtonsProps {
  onCancel: () => void
  isSubmitting: boolean
  isEncargadoSelected: boolean
}

export default function ActionButtons({
  onCancel,
  isSubmitting,
  isEncargadoSelected,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-col gap-3 pt-4 sm:flex-row">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Cancelar
      </button>
      <button
        type="submit"
        disabled={isSubmitting || !isEncargadoSelected}
        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creando...
          </>
        ) : (
          'Confirmar Entrega'
        )}
      </button>
    </div>
  )
}
