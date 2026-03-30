'use client'
// Componente de buscador con debounce y limpieza de otros parámetros

import { useState, useEffect, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'

interface SearchWrapperProps {
  placeholder?: string
  initialValue?: string
  paramName?: string
  debounceMs?: number
  clearOtherParams?: string[]
}

export default function SearchWrapper({
  placeholder = 'Buscar...',
  initialValue = '',
  paramName = 'q',
  debounceMs = 500,
  clearOtherParams = [],
}: SearchWrapperProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchQuery, setSearchQuery] = useState(initialValue)

  const debouncedSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const normalizedValue = value.trim()

    if (normalizedValue) {
      params.set(paramName, normalizedValue)
      clearOtherParams.forEach((param) => params.delete(param))
    } else {
      params.delete(paramName)
    }

    const nextQueryString = params.toString()
    const currentQueryString = searchParams.toString()

    if (nextQueryString === currentQueryString) {
      return
    }

    startTransition(() => {
      const url = nextQueryString ? `?${nextQueryString}` : '?'
      router.replace(url, { scroll: false })
    })
  }, debounceMs)

  useEffect(() => {
    setSearchQuery(initialValue)
  }, [initialValue])

  const handleChange = (value: string) => {
    setSearchQuery(value)
    debouncedSearch(value)
  }

  const handleClear = () => {
    setSearchQuery('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete(paramName)

    const nextQueryString = params.toString()
    const currentQueryString = searchParams.toString()

    if (nextQueryString === currentQueryString) {
      return
    }

    startTransition(() => {
      const url = nextQueryString ? `?${nextQueryString}` : '?'
      router.replace(url, { scroll: false })
    })
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 py-2.5 pr-10 pl-10 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {isPending && (
        <div className="absolute top-1/2 right-12 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
        </div>
      )}
    </div>
  )
}
