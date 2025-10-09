'use client'

import { useState, useEffect } from 'react'
import ObraSearchResults from './ObraSearchResults'

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debounced
}

export default function ObraSearchWrapper({
  onSelectObra,
}: {
  onSelectObra: (obra: any) => void
}) {
  const [filtro, setFiltro] = useState('')
  const debouncedFiltro = useDebounce(filtro, 400) // 400ms debounce

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar por nombre, cliente o dirección..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2"
      />
      {/* Solo buscar si hay al menos 2 caracteres */}
      {debouncedFiltro.length >= 2 && (
        <ObraSearchResults
          filtro={debouncedFiltro}
          onSelectObra={onSelectObra}
        />
      )}
    </div>
  )
}
