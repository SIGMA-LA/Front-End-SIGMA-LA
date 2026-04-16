'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { EntregaEmpleado, PaginatedResponse } from '@/types'
import { getEntregasByEmpleado } from '@/actions/entregas'
import { notify } from '@/lib/toast'
import { PLANTA_PAGE_SIZE } from '@/constants'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type EstadoFiltroEntrega = 'PENDIENTE' | 'ENTREGADO' | 'CANCELADO'

interface UseEntregasPaginadasParams {
  cuil: string
  initialData: PaginatedResponse<EntregaEmpleado>
  /** Overrides PLANTA_PAGE_SIZE if provided. */
  pageSize?: number
}

export interface UseEntregasPaginadasReturn {
  entregas: EntregaEmpleado[]
  estadoFiltro: EstadoFiltroEntrega
  setEstadoFiltro: (estado: EstadoFiltroEntrega) => void
  searchTerm: string
  setSearchTerm: (v: string) => void
  filterDate: string
  setFilterDate: (v: string) => void
  loading: boolean
  loadingMore: boolean
  error: string | null
  hasMore: boolean
  lastElementRef: (node: HTMLDivElement | null) => void
  handleRetry: () => Promise<void>
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Manages paginated entrega list with debounced search, date filter,
 * status filter, and infinite-scroll via IntersectionObserver.
 *
 * Previously duplicated between PlantaClient and VisitadorClient.
 */
export default function useEntregasPaginadas({
  cuil,
  initialData,
  pageSize = PLANTA_PAGE_SIZE,
}: UseEntregasPaginadasParams): UseEntregasPaginadasReturn {
  const [entregas, setEntregas] = useState<EntregaEmpleado[]>(initialData.data)
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoFiltroEntrega>('PENDIENTE')
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialData.page < initialData.totalPages)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [debouncedDate, setDebouncedDate] = useState('')

  const observer = useRef<IntersectionObserver | null>(null)

  // Debounce search and date inputs (2 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setDebouncedDate(filterDate)
    }, 2000)
    return () => clearTimeout(timer)
  }, [searchTerm, filterDate])

  const loadEntregas = useCallback(
    async (
      estado: EstadoFiltroEntrega,
      search: string,
      date: string,
      page: number = 1,
      append: boolean = false,
    ) => {
      if (!cuil) return

      try {
        if (page === 1) setLoading(true)
        else setLoadingMore(true)

        setError(null)

        const response = await getEntregasByEmpleado(cuil, estado, search, date, page, pageSize)

        if (append) {
          setEntregas((prev) => [...prev, ...response.data])
        } else {
          setEntregas(response.data)
        }

        setHasMore(response.page < response.totalPages)
        setCurrentPage(page)
      } catch (err) {
        console.error('Error loading entregas:', err)
        setError('Error al cargar las entregas')
        notify.error('Error al actualizar el listado de entregas')
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [cuil, pageSize],
  )

  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore && !loading) {
      void loadEntregas(estadoFiltro, debouncedSearch, debouncedDate, currentPage + 1, true)
    }
  }, [hasMore, loadingMore, loading, currentPage, estadoFiltro, debouncedSearch, debouncedDate, loadEntregas])

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || loadingMore) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore()
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, loadingMore, hasMore, loadMore],
  )

  // Refetch when debounced params or status filter change
  useEffect(() => {
    void loadEntregas(estadoFiltro, debouncedSearch, debouncedDate)
  }, [estadoFiltro, debouncedSearch, debouncedDate, loadEntregas])

  const handleRetry = async () => {
    await loadEntregas(estadoFiltro, debouncedSearch, debouncedDate)
  }

  return {
    entregas,
    estadoFiltro,
    setEstadoFiltro,
    searchTerm,
    setSearchTerm,
    filterDate,
    setFilterDate,
    loading,
    loadingMore,
    error,
    hasMore,
    lastElementRef,
    handleRetry,
  }
}
