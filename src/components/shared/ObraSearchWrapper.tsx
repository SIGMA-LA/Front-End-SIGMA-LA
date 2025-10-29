'use client'

import { useState, useEffect } from 'react'

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debounced
}

export default function ObraSearchWrapper({
  onSearch,
  placeholder = 'Buscar por nombre, cliente o dirección...',
  initialValue = '',
}: {
  onSearch: (filtro: string) => void
  placeholder?: string
  initialValue?: string
}) {
  const [filtro, setFiltro] = useState(initialValue)
  const debouncedFiltro = useDebounce(filtro, 400)

  useEffect(() => {
    onSearch(String(debouncedFiltro ?? '').trim())
  }, [debouncedFiltro])

  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2"
      />
    </div>
  )
}
