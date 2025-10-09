'use client'

import { Obra } from '@/types'
import { useEffect, useState } from 'react'

export default function ObraSearchResults({
  filtro,
  onSelectObra,
}: {
  filtro: string
  onSelectObra: (obra: Obra) => void
}) {
  const [obras, setObras] = useState<Obra[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let ignore = false
    if (filtro.length < 2) {
      setObras([])
      return
    }
    setLoading(true)
    fetch(
      `http://localhost:4000/api/obras/buscar?q=${encodeURIComponent(filtro)}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) setObras(data)
        setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [filtro])

  if (loading) return <div className="text-sm text-gray-500">Buscando...</div>

  return (
    <div className="max-h-40 space-y-2 overflow-y-auto">
      {obras.length === 0 && (
        <div className="text-sm text-gray-500">No se encontraron obras.</div>
      )}
      {obras.map((obra: Obra) => (
        <button
          key={obra.cod_obra}
          type="button"
          onClick={() => onSelectObra(obra)}
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-left hover:bg-blue-50"
        >
          <div className="font-medium">{obra.direccion}</div>
          <div className="text-sm text-gray-600">
            {obra.cliente?.razon_social
              ? obra.cliente.razon_social
              : `${obra.cliente?.nombre ?? ''} ${obra.cliente?.apellido ?? ''}`}
            {' - '}
            {obra.direccion}
          </div>
        </button>
      ))}
    </div>
  )
}
