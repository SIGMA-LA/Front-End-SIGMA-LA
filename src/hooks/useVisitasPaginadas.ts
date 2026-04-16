'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Visita, PaginatedResponse } from '@/types'
import { getVisitasByEmpleado } from '@/actions/visitas'
import { notify } from '@/lib/toast'
import { PLANTA_PAGE_SIZE } from '@/constants'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Maps the UI status tab to the actual visita estado values sent to the API. */
const ESTADO_MAP: Record<VisitaStatusFilter, string[]> = {
  PENDIENTE: ['PROGRAMADA', 'EN CURSO'],
  REALIZADA: ['COMPLETADA'],
  CANCELADA: ['CANCELADA'],
}

export type VisitaStatusFilter = 'PENDIENTE' | 'REALIZADA' | 'CANCELADA'

interface UseVisitasPaginadasParams {
  cuil: string
  initialData: PaginatedResponse<Visita>
  /** Overrides PLANTA_PAGE_SIZE if provided. */
  pageSize?: number
}

export interface UseVisitasPaginadasReturn {
  visitas: Visita[]
  statusFilter: VisitaStatusFilter
  setStatusFilter: (status: VisitaStatusFilter) => void
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
 * Manages paginated visita list with debounced search, date filter,
 * status filter, and infinite-scroll via IntersectionObserver.
 *
 * Extracted from VisitadorClient to eliminate inline pagination logic.
 */
export default function useVisitasPaginadas({
  cuil,
  initialData,
  pageSize = PLANTA_PAGE_SIZE,
}: UseVisitasPaginadasParams): UseVisitasPaginadasReturn {
  const [visitas, setVisitas] = useState<Visita[]>(initialData.data)
  const [statusFilter, setStatusFilter] = useState<VisitaStatusFilter>('PENDIENTE')
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

  // Debounce search and date inputs (1 second)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setDebouncedDate(filterDate)
    }, 1000)
    return () => clearTimeout(timer)
  }, [searchTerm, filterDate])

  const loadVisitas = useCallback(
    async (
      status: VisitaStatusFilter,
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

        const estados = ESTADO_MAP[status]
        const response = await getVisitasByEmpleado(cuil, estados, search, date, page, pageSize)

        if (append) {
          setVisitas((prev) => [...prev, ...response.data])
        } else {
          setVisitas(response.data)
        }

        setHasMore(response.page < response.totalPages)
        setCurrentPage(page)
      } catch (err) {
        console.error('Error loading visitas:', err)
        setError('Error al cargar las visitas')
        notify.error('Error al actualizar el listado de visitas')
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [cuil, pageSize],
  )

  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore && !loading) {
      void loadVisitas(statusFilter, debouncedSearch, debouncedDate, currentPage + 1, true)
    }
  }, [hasMore, loadingMore, loading, currentPage, statusFilter, debouncedSearch, debouncedDate, loadVisitas])

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
    void loadVisitas(statusFilter, debouncedSearch, debouncedDate)
  }, [statusFilter, debouncedSearch, debouncedDate, loadVisitas])

  const handleRetry = async () => {
    await loadVisitas(statusFilter, debouncedSearch, debouncedDate)
  }

  return {
    visitas,
    statusFilter,
    setStatusFilter,
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
