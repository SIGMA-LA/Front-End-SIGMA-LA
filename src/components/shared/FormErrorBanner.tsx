'use client'

import { AlertCircle } from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FormErrorBannerProps {
  /** The error string to display. Multiple lines separated by '\n' are each rendered as a <p>. */
  error: string | null
  /** Called when the user clicks the dismiss button. Should clear the error in the parent. */
  onDismiss: () => void
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Displays a red error banner with multi-line support and a dismiss button.
 *
 * Previously duplicated identically between:
 *   - CrearEntregaForm.tsx (lines 409–439)
 *   - CrearVisita.tsx (lines 268–296)
 */
export default function FormErrorBanner({ error, onDismiss }: FormErrorBannerProps) {
  if (!error) return null

  const lines = error.split('\n')

  return (
    <div className="mb-6 flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm animate-in fade-in slide-in-from-top-2">
      <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
      <div className="flex-1">
        <h4 className="text-sm font-bold text-red-800">Se detectaron problemas:</h4>
        <div className="mt-1 text-sm text-red-700 whitespace-pre-wrap leading-relaxed">
          {lines.map((line, idx) => (
            <p
              key={idx}
              className={
                lines.length > 1 && idx > 0
                  ? 'relative mt-2 pl-3.5 before:absolute before:top-2 before:left-0 before:h-1.5 before:w-1.5 before:rounded-full before:bg-red-500'
                  : 'font-medium'
              }
            >
              {line}
            </p>
          ))}
        </div>
      </div>
      <button
        onClick={onDismiss}
        className="text-red-400 hover:text-red-600 transition-colors"
        type="button"
        aria-label="Cerrar mensaje de error"
      >
        <AlertCircle className="h-4 w-4" />
      </button>
    </div>
  )
}
