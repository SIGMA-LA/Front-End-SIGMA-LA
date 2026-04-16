'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Cliente } from '@/types'
import { getClientes } from '@/actions/clientes'
import useDebounce from '@/hooks/useDebounce'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Extracts the display name from a client (empresa or persona). */
export function getClienteDisplayName(cliente: Cliente): string {
  if (cliente.tipo_cliente === 'EMPRESA') {
    return cliente.razon_social ?? ''
  }
  return `${cliente.nombre ?? ''} ${cliente.apellido ?? ''}`.trim()
}

export interface ClienteSearchState {
  query: string
  setQuery: (q: string) => void
  results: Cliente[]
  isSearching: boolean
  selectedCliente: Cliente | null
  selectCliente: (cliente: Cliente) => void
  clearSelection: () => void
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Reusable debounced client (or architect) search.
 * Skips the API call when the current query matches the selected client's name.
 *
 * @param soloPersonas - When true, filters out EMPRESA tipo_cliente results (used for arquitecto search).
 */
export function useClienteSearch(soloPersonas = false): ClienteSearchState {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Cliente[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)

  const debouncedQuery = useDebounce(query, 500)

  const fetchClientes = useCallback(
    async (q: string) => {
      if (!q.trim() || q.length < 2) {
        setResults([])
        return
      }
      setIsSearching(true)
      try {
        const response = await getClientes(q, 1, 100)
        const data = response.data ?? []
        setResults(soloPersonas ? data.filter((c) => c.tipo_cliente !== 'EMPRESA') : data)
      } catch (err) {
        console.error('Error buscando clientes:', err)
        setResults([])
      } finally {
        setIsSearching(false)
      }
    },
    [soloPersonas],
  )

  useEffect(() => {
    // Avoid searching when the query matches the already-selected client name
    const currentName = selectedCliente ? getClienteDisplayName(selectedCliente) : ''

    if (debouncedQuery && debouncedQuery !== currentName) {
      void fetchClientes(debouncedQuery)
    } else if (!debouncedQuery) {
      setResults([])
    }
  }, [debouncedQuery, fetchClientes, selectedCliente])

  const selectCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setQuery(getClienteDisplayName(cliente))
    setResults([])
  }

  const clearSelection = () => {
    setSelectedCliente(null)
    setQuery('')
    setResults([])
  }

  return {
    query,
    setQuery,
    results,
    isSearching,
    selectedCliente,
    selectCliente,
    clearSelection,
  }
}
