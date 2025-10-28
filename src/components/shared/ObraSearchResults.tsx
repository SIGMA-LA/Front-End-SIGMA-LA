// components/shared/ObraSearchResults.tsx
'use client'

import { Obra } from '@/types'
import { useEffect, useState } from 'react'

export default function ObraSearchResults({
  filtro,
  onSelectObra,
  searchAction,
}: {
  filtro: string
  onSelectObra: (obra: Obra) => void
  searchAction?: (filtro: string) => Promise<Obra[]>
}) {
  const [obras, setObras] = useState<Obra[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    if (filtro.length < 2) {
      setObras([])
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    const run = async () => {
      try {
        console.log('[ObraSearchResults] Buscando:', filtro)

        let data: Obra[] = []

        if (searchAction) {
          // Usar Server Action
          data = await searchAction(filtro)
        } else {
          // Fallback a fetch directo
          // IMPORTANTE: El backend espera ?{texto} sin clave
          const response = await fetch(
            `http://localhost:4000/api/obras/buscar?${encodeURIComponent(filtro)}`,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
          }

          data = await response.json()
        }

        console.log('[ObraSearchResults] Resultados:', data?.length || 0)

        if (!ignore) {
          setObras(Array.isArray(data) ? data : [])
          setError(null)
        }
      } catch (err) {
        console.error('[ObraSearchResults] Error:', err)
        if (!ignore) {
          setObras([])
          setError(
            'Error al buscar obras. Verifica que el backend esté corriendo.'
          )
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    run()

    return () => {
      ignore = true
    }
  }, [filtro, searchAction])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4 text-sm text-gray-500">
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
        Buscando...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
        {error}
      </div>
    )
  }

  return (
    <div className="max-h-60 space-y-2 overflow-y-auto">
      {obras.length === 0 && (
        <div className="py-4 text-center text-sm text-gray-500">
          No se encontraron obras con "{filtro}"
        </div>
      )}
      {obras.map((obra: Obra) => (
        <button
          key={obra.cod_obra}
          type="button"
          onClick={() => {
            console.log('[ObraSearchResults] Seleccionando obra:', {
              cod_obra: obra.cod_obra,
              direccion: obra.direccion,
            })
            onSelectObra(obra)
          }}
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-left transition-colors hover:border-blue-300 hover:bg-blue-50"
        >
          <div className="font-medium text-gray-900">{obra.direccion}</div>
          <div className="mt-1 text-sm text-gray-600">
            {obra.cliente?.razon_social
              ? obra.cliente.razon_social
              : `${obra.cliente?.nombre ?? ''} ${obra.cliente?.apellido ?? ''}`.trim()}
            {obra.localidad?.nombre_localidad && (
              <span className="ml-2 text-gray-500">
                • {obra.localidad.nombre_localidad}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs">
            <span className="text-gray-500">ID: #{obra.cod_obra}</span>
            <span className="text-gray-400">•</span>
            <span
              className={`font-medium ${
                obra.estado === 'CANCELADA'
                  ? 'text-red-600'
                  : obra.estado === 'ENTREGADA'
                    ? 'text-green-600'
                    : 'text-blue-600'
              }`}
            >
              {obra.estado}
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}
