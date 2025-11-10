'use client'

import { useEffect } from 'react'
import { AlertCircle, Home } from 'lucide-react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="es">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8">
          <div className="w-full max-w-md space-y-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Error Crítico
              </h1>
              <p className="text-gray-600">
                La aplicación encontró un error inesperado.
              </p>
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-4 rounded-lg bg-red-50 p-4 text-left">
                  <summary className="cursor-pointer font-semibold text-red-900">
                    Detalles técnicos
                  </summary>
                  <pre className="mt-2 overflow-auto text-xs text-red-800">
                    {error.message}
                    {error.digest && `\nDigest: ${error.digest}`}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={reset}
                className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Reintentar
              </button>
              <Link
                href="/"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Home className="h-4 w-4" />
                Inicio
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
