'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'

interface SearchWrapperProps {
  placeholder?: string
  initialValue?: string
  /**
   * Parámetro de búsqueda en la URL (default: 'q')
   * @example 'search', 'query', 'filter'
   */
  paramName?: string
  /**
   * Delay del debounce en ms (default: 500)
   */
  debounceMs?: number
  /**
   * Si al buscar se deben limpiar otros params
   */
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

    if (value.trim()) {
      params.set(paramName, value.trim())
      clearOtherParams.forEach((param) => params.delete(param))
    } else {
      params.delete(paramName)
    }

    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }, debounceMs)

  useEffect(() => {
    debouncedSearch(searchQuery)
  }, [searchQuery, debouncedSearch])

  const handleClear = () => {
    setSearchQuery('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete(paramName)

    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          disabled={isPending}
          className="w-full rounded-lg border border-gray-300 py-2.5 pr-10 pl-10 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:opacity-50"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            disabled={isPending}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
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
