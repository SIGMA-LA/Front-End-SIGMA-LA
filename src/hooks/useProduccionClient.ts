'use client'

import { useEffect, useMemo, useState, useTransition, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type {
  Obra,
  OrdenProduccion,
  Empleado,
  EstadoNotaFabricaProduccion,
  EstadoOrdenProduccion,
} from '@/types'
import { getNotasFabricaProduccion } from '@/actions/obras'
import {
  getOrdenesProduccionPorEstadoYFechas,
  startProduccion,
  finishProduccion,
} from '@/actions/ordenes'
import { notify } from '@/lib/toast'

// ---------------------------------------------------------------------------
// Constants & Helpers
// ---------------------------------------------------------------------------

export type MainTab = 'notas' | 'ordenes'
export type NotasTab = EstadoNotaFabricaProduccion
export type OrdenesTab = EstadoOrdenProduccion

interface ProduccionFilters {
  fechaDesde: string
  fechaHasta: string
}

const EMPTY_FILTERS: ProduccionFilters = {
  fechaDesde: '',
  fechaHasta: '',
}

const buildCacheKey = (status: string, filters: ProduccionFilters) =>
  `${status}|${filters.fechaDesde}|${filters.fechaHasta}`

const getRequestFilters = (filters: ProduccionFilters) => ({
  fechaDesde: filters.fechaDesde || undefined,
  fechaHasta: filters.fechaHasta || undefined,
})

type NotasCache = Record<string, Obra[]>
type OrdenesCache = Record<string, OrdenProduccion[]>

export interface ProduccionActionSummary {
  entidadLabel: string
  entidadValor: string
  cliente: string
  direccion: string
  telefono?: string
  mail?: string
  estadoActual: string
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export default function useProduccionClient(usuario: Empleado, initialNotasSinOrden: Obra[]) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  // Tabs state
  const [activeTab, setActiveTab] = useState<MainTab>('notas')
  const [activeNotasTab, setActiveNotasTab] = useState<NotasTab>('SIN_ORDEN')
  const [activeOrdenesTab, setActiveOrdenesTab] = useState<OrdenesTab>('PENDIENTE')
  
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Filters state
  const [notasFilters, setNotasFilters] = useState<ProduccionFilters>(EMPTY_FILTERS)
  const [ordenesFilters, setOrdenesFilters] = useState<ProduccionFilters>(EMPTY_FILTERS)

  // Cache state
  const [notasCache, setNotasCache] = useState<NotasCache>(() => ({
    [buildCacheKey('SIN_ORDEN', EMPTY_FILTERS)]: initialNotasSinOrden,
  }))
  const [ordenesCache, setOrdenesCache] = useState<OrdenesCache>({})

  // Loading & Error state
  const [loadingNotas, setLoadingNotas] = useState(false)
  const [loadingOrdenes, setLoadingOrdenes] = useState(false)
  const [errorNotas, setErrorNotas] = useState<string | null>(null)
  const [errorOrdenes, setErrorOrdenes] = useState<string | null>(null)

  // Selection state
  const [selectedObra, setSelectedObra] = useState<Obra | null>(null)
  const [showCrearOrdenModal, setShowCrearOrdenModal] = useState(false)
  const [selectedOrden, setSelectedOrden] = useState<OrdenProduccion | null>(null)

  // Production actions state
  const [isIniciarModalOpen, setIsIniciarModalOpen] = useState(false)
  const [isFinalizarModalOpen, setIsFinalizarModalOpen] = useState(false)
  const [isProduccionLoading, setIsProduccionLoading] = useState(false)

  // Memoized keys and values
  const activeNotasKey = useMemo(() => buildCacheKey(activeNotasTab, notasFilters), [activeNotasTab, notasFilters])
  const activeOrdenesKey = useMemo(() => buildCacheKey(activeOrdenesTab, ordenesFilters), [activeOrdenesTab, ordenesFilters])

  const currentNotas = useMemo(() => notasCache[activeNotasKey] ?? [], [notasCache, activeNotasKey])
  const currentOrdenes = useMemo(() => ordenesCache[activeOrdenesKey] ?? [], [ordenesCache, activeOrdenesKey])

  // Counts for Display
  const notasSinOrdenCount = notasCache[buildCacheKey('SIN_ORDEN', EMPTY_FILTERS)]?.length ?? 0
  const notasEnProduccionCount = notasCache[buildCacheKey('EN_PRODUCCION', EMPTY_FILTERS)]?.length ?? 0
  const ordenesPendientesCount = ordenesCache[buildCacheKey('PENDIENTE', EMPTY_FILTERS)]?.length ?? 0
  const ordenesAprobadasCount = ordenesCache[buildCacheKey('APROBADA', EMPTY_FILTERS)]?.length ?? 0
  const ordenesEnProduccionCount = ordenesCache[buildCacheKey('EN PRODUCCION', EMPTY_FILTERS)]?.length ?? 0

  // Data Fetching: Notas
  useEffect(() => {
    if (activeTab !== 'notas' || notasCache[activeNotasKey]) return

    let cancelled = false
    const fetchNotas = async () => {
      setLoadingNotas(true)
      setErrorNotas(null)
      try {
        const notas = await getNotasFabricaProduccion({
          estado: activeNotasTab,
          ...getRequestFilters(notasFilters),
        })
        if (!cancelled) {
          setNotasCache((prev) => ({ ...prev, [activeNotasKey]: notas }))
        }
      } catch {
        if (!cancelled) setErrorNotas('No se pudieron cargar las notas de fábrica.')
      } finally {
        if (!cancelled) setLoadingNotas(false)
      }
    }
    void fetchNotas()
    return () => { cancelled = true }
  }, [activeTab, activeNotasKey, activeNotasTab, notasFilters, notasCache])

  // Data Fetching: Ordenes
  useEffect(() => {
    if (activeTab !== 'ordenes' || ordenesCache[activeOrdenesKey]) return

    let cancelled = false
    const fetchOrdenes = async () => {
      setLoadingOrdenes(true)
      setErrorOrdenes(null)
      try {
        const ordenes = await getOrdenesProduccionPorEstadoYFechas({
          estado: activeOrdenesTab,
          ...getRequestFilters(ordenesFilters),
        })
        if (!cancelled) {
          setOrdenesCache((prev) => ({ ...prev, [activeOrdenesKey]: ordenes }))
        }
      } catch {
        if (!cancelled) setErrorOrdenes('No se pudieron cargar las órdenes de producción.')
      } finally {
        if (!cancelled) setLoadingOrdenes(false)
      }
    }
    void fetchOrdenes()
    return () => { cancelled = true }
  }, [activeTab, activeOrdenesKey, activeOrdenesTab, ordenesFilters, ordenesCache])

  // Deselect if no longer visible
  useEffect(() => {
    if (activeTab === 'notas' && selectedObra) {
      if (!currentNotas.some(o => o.cod_obra === selectedObra.cod_obra)) setSelectedObra(null)
    }
    if (activeTab === 'ordenes' && selectedOrden) {
      if (!currentOrdenes.some(o => o.cod_op === selectedOrden.cod_op)) setSelectedOrden(null)
    }
  }, [activeTab, currentNotas, currentOrdenes, selectedObra, selectedOrden])

  // Handlers
  const handleTabChange = (tab: MainTab) => {
    setActiveTab(tab)
    setSelectedObra(null)
    setSelectedOrden(null)
  }

  const handleNotasTabChange = (status: NotasTab) => {
    setActiveNotasTab(status)
    setSelectedObra(null)
  }

  const handleOrdenesTabChange = (status: OrdenesTab) => {
    setActiveOrdenesTab(status)
    setSelectedOrden(null)
  }

  const handleRetryNotas = () => {
    setErrorNotas(null)
    setNotasCache(prev => {
      const next = { ...prev }; delete next[activeNotasKey]; return next
    })
  }

  const handleRetryOrdenes = () => {
    setErrorOrdenes(null)
    setOrdenesCache(prev => {
      const next = { ...prev }; delete next[activeOrdenesKey]; return next
    })
  }

  const handleConfirmIniciar = async () => {
    if (!selectedOrden) return
    setIsProduccionLoading(true)
    try {
      const result = await startProduccion(selectedOrden.cod_op)
      if (result.success) {
        setIsIniciarModalOpen(false)
        setSelectedOrden({
          ...selectedOrden,
          estado: 'EN PRODUCCION',
          obra: { ...selectedOrden.obra, estado: 'EN PRODUCCION' }
        } as OrdenProduccion)
        setOrdenesCache({}) // Clear cache to force refresh
        notify.success('Producción iniciada correctamente.')
        startTransition(() => { router.refresh() })
      } else {
        notify.error(result.error || 'Error al iniciar la producción')
      }
    } catch (error) {
      console.error('Error al iniciar producción:', error)
      notify.error('Error al iniciar la producción. Intente nuevamente.')
    } finally {
      setIsProduccionLoading(false)
    }
  }

  const handleConfirmFinalizar = async () => {
    if (!selectedOrden) return
    setIsProduccionLoading(true)
    try {
      const result = await finishProduccion(selectedOrden.cod_op)
      if (result.success) {
        setIsFinalizarModalOpen(false)
        setSelectedOrden(null)
        setNotasCache({}); setOrdenesCache({})
        notify.success('Producción finalizada correctamente.')
        startTransition(() => { router.refresh() })
      } else {
        notify.error(result.error || 'Error al finalizar la producción')
      }
    } catch (error) {
      console.error('Error al finalizar producción:', error)
      notify.error('Error al finalizar la producción. Intente nuevamente.')
    } finally {
      setIsProduccionLoading(false)
    }
  }

  const selectedOrdenSummary: ProduccionActionSummary | null = useMemo(() => {
    if (!selectedOrden) return null
    const cliente = selectedOrden.obra?.cliente
    return {
      entidadLabel: 'Orden de Producción',
      entidadValor: `#${selectedOrden.cod_op}`,
      cliente: cliente?.tipo_cliente === 'EMPRESA'
        ? cliente.razon_social?.trim() || 'N/A'
        : `${cliente?.nombre ?? ''} ${cliente?.apellido ?? ''}`.trim() || 'N/A',
      direccion: selectedOrden.obra?.direccion && selectedOrden.obra?.localidad
        ? `${selectedOrden.obra.direccion}, ${selectedOrden.obra.localidad.nombre_localidad}`
        : selectedOrden.obra?.direccion || 'Sin dirección',
      telefono: cliente?.telefono,
      mail: cliente?.mail,
      estadoActual: selectedOrden.estado,
    }
  }, [selectedOrden])

  return {
    activeTab,
    setActiveTab,
    activeNotasTab,
    activeOrdenesTab,
    sidebarOpen,
    setSidebarOpen,
    notasFilters,
    setNotasFilters,
    ordenesFilters,
    setOrdenesFilters,
    loadingNotas,
    loadingOrdenes,
    errorNotas,
    errorOrdenes,
    selectedObra,
    setSelectedObra,
    showCrearOrdenModal,
    setShowCrearOrdenModal,
    selectedOrden,
    setSelectedOrden,
    isIniciarModalOpen,
    setIsIniciarModalOpen,
    isFinalizarModalOpen,
    setIsFinalizarModalOpen,
    isProduccionLoading,
    currentNotas,
    currentOrdenes,
    notasSinOrdenCount,
    notasEnProduccionCount,
    ordenesPendientesCount,
    ordenesAprobadasCount,
    ordenesEnProduccionCount,
    selectedOrdenSummary,
    handleTabChange,
    handleNotasTabChange,
    handleOrdenesTabChange,
    handleRetryNotas,
    handleRetryOrdenes,
    handleConfirmIniciar,
    handleConfirmFinalizar,
    refreshAll: () => { setNotasCache({}); setOrdenesCache({}); startTransition(() => router.refresh()) }
  }
}
