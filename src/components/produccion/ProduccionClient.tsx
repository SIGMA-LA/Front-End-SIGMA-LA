'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Package, Menu, X } from 'lucide-react'
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
import TabNavigation from './TabNavigation'
import SidebarNotasFabrica from './SidebarNotasFabrica'
import SidebarOrdenesProduccion from './SidebarOrdenesProduccion'
import NotaFabricaDetails from './NotaFabricaDetails'
import OrdenProduccionDetails from './OrdenProduccionDetails'
import CrearOrdenModal from './CrearOrdenModal'
import IniciarProduccionModal from './IniciarProduccionModal'
import FinalizarProduccionModal from './FinalizarProduccionModal'
import { notify } from '@/lib/toast'

type MainTab = 'notas' | 'ordenes'
type NotasTab = EstadoNotaFabricaProduccion
type OrdenesTab = EstadoOrdenProduccion

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

interface ProduccionClientProps {
  usuario: Empleado
  initialNotasSinOrden: Obra[]
}

export default function ProduccionClient({
  usuario,
  initialNotasSinOrden,
}: ProduccionClientProps) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  // Tab activa
  const [activeTab, setActiveTab] = useState<MainTab>('notas')
  const [activeNotasTab, setActiveNotasTab] = useState<NotasTab>('SIN_ORDEN')
  const [activeOrdenesTab, setActiveOrdenesTab] =
    useState<OrdenesTab>('PENDIENTE')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [notasFilters, setNotasFilters] =
    useState<ProduccionFilters>(EMPTY_FILTERS)
  const [ordenesFilters, setOrdenesFilters] =
    useState<ProduccionFilters>(EMPTY_FILTERS)

  const [notasCache, setNotasCache] = useState<NotasCache>(() => ({
    [buildCacheKey('SIN_ORDEN', EMPTY_FILTERS)]: initialNotasSinOrden,
  }))
  const [ordenesCache, setOrdenesCache] = useState<OrdenesCache>({})

  const [loadingNotas, setLoadingNotas] = useState(false)
  const [loadingOrdenes, setLoadingOrdenes] = useState(false)
  const [errorNotas, setErrorNotas] = useState<string | null>(null)
  const [errorOrdenes, setErrorOrdenes] = useState<string | null>(null)

  // Estados para Notas de Fábrica
  const [selectedObra, setSelectedObra] = useState<Obra | null>(null)
  const [showCrearOrdenModal, setShowCrearOrdenModal] = useState(false)

  // Estados para Órdenes de Producción
  const [selectedOrden, setSelectedOrden] = useState<OrdenProduccion | null>(
    null
  )
  const [isIniciarModalOpen, setIsIniciarModalOpen] = useState(false)
  const [isFinalizarModalOpen, setIsFinalizarModalOpen] = useState(false)
  const [isProduccionLoading, setIsProduccionLoading] = useState(false)

  const activeNotasKey = useMemo(
    () => buildCacheKey(activeNotasTab, notasFilters),
    [activeNotasTab, notasFilters]
  )

  const activeOrdenesKey = useMemo(
    () => buildCacheKey(activeOrdenesTab, ordenesFilters),
    [activeOrdenesTab, ordenesFilters]
  )

  const currentNotas = useMemo(
    () => notasCache[activeNotasKey] ?? [],
    [notasCache, activeNotasKey]
  )

  const currentOrdenes = useMemo(
    () => ordenesCache[activeOrdenesKey] ?? [],
    [ordenesCache, activeOrdenesKey]
  )

  const notasSinOrdenCount =
    notasCache[buildCacheKey('SIN_ORDEN', EMPTY_FILTERS)]?.length ?? 0
  const notasEnProduccionCount =
    notasCache[buildCacheKey('EN_PRODUCCION', EMPTY_FILTERS)]?.length ?? 0
  const ordenesPendientesCount =
    ordenesCache[buildCacheKey('PENDIENTE', EMPTY_FILTERS)]?.length ?? 0
  const ordenesAprobadasCount =
    ordenesCache[buildCacheKey('APROBADA', EMPTY_FILTERS)]?.length ?? 0
  const ordenesEnProduccionCount =
    ordenesCache[buildCacheKey('EN PRODUCCION', EMPTY_FILTERS)]?.length ?? 0

  useEffect(() => {
    if (activeTab !== 'notas') {
      return
    }

    if (notasCache[activeNotasKey]) {
      return
    }

    let cancelled = false

    const fetchNotas = async () => {
      setLoadingNotas(true)
      setErrorNotas(null)

      try {
        const notas = await getNotasFabricaProduccion({
          estado: activeNotasTab,
          ...getRequestFilters(notasFilters),
        })

        if (cancelled) {
          return
        }

        setNotasCache((prev) => ({
          ...prev,
          [activeNotasKey]: notas,
        }))
      } catch {
        if (!cancelled) {
          setErrorNotas('No se pudieron cargar las notas de fabrica.')
        }
      } finally {
        if (!cancelled) {
          setLoadingNotas(false)
        }
      }
    }

    void fetchNotas()

    return () => {
      cancelled = true
    }
  }, [activeTab, activeNotasKey, activeNotasTab, notasFilters, notasCache])

  useEffect(() => {
    if (activeTab !== 'ordenes') {
      return
    }

    if (ordenesCache[activeOrdenesKey]) {
      return
    }

    let cancelled = false

    const fetchOrdenes = async () => {
      setLoadingOrdenes(true)
      setErrorOrdenes(null)

      try {
        const ordenes = await getOrdenesProduccionPorEstadoYFechas({
          estado: activeOrdenesTab,
          ...getRequestFilters(ordenesFilters),
        })

        if (cancelled) {
          return
        }

        setOrdenesCache((prev) => ({
          ...prev,
          [activeOrdenesKey]: ordenes,
        }))
      } catch {
        if (!cancelled) {
          setErrorOrdenes('No se pudieron cargar las ordenes de produccion.')
        }
      } finally {
        if (!cancelled) {
          setLoadingOrdenes(false)
        }
      }
    }

    void fetchOrdenes()

    return () => {
      cancelled = true
    }
  }, [
    activeTab,
    activeOrdenesKey,
    activeOrdenesTab,
    ordenesFilters,
    ordenesCache,
  ])

  useEffect(() => {
    if (activeTab !== 'notas' || !selectedObra) {
      return
    }

    const sigueVisible = currentNotas.some(
      (obra) => obra.cod_obra === selectedObra.cod_obra
    )

    if (!sigueVisible) {
      setSelectedObra(null)
    }
  }, [activeTab, currentNotas, selectedObra])

  useEffect(() => {
    if (activeTab !== 'ordenes' || !selectedOrden) {
      return
    }

    const sigueVisible = currentOrdenes.some(
      (orden) => orden.cod_op === selectedOrden.cod_op
    )

    if (!sigueVisible) {
      setSelectedOrden(null)
    }
  }, [activeTab, currentOrdenes, selectedOrden])

  const handleTabChange = (tab: MainTab) => {
    setActiveTab(tab)
    setSelectedObra(null)
    setSelectedOrden(null)
  }

  const handleNotasTabChange = (status: NotasTab) => {
    setActiveNotasTab(status)
    setSelectedObra(null)
  }

  const handleNotasFiltersChange = (filters: ProduccionFilters) => {
    setNotasFilters(filters)
    setSelectedObra(null)
  }

  const handleOrdenesTabChange = (status: OrdenesTab) => {
    setActiveOrdenesTab(status)
    setSelectedOrden(null)
  }

  const handleOrdenesFiltersChange = (filters: ProduccionFilters) => {
    setOrdenesFilters(filters)
    setSelectedOrden(null)
  }

  const handleRetryNotas = () => {
    setErrorNotas(null)
    setNotasCache((prev) => {
      const next: NotasCache = { ...prev }
      delete next[activeNotasKey]
      return next
    })
  }

  const handleRetryOrdenes = () => {
    setErrorOrdenes(null)
    setOrdenesCache((prev) => {
      const next: OrdenesCache = { ...prev }
      delete next[activeOrdenesKey]
      return next
    })
  }

  const handleSelectObra = (obra: Obra) => {
    setSelectedObra(obra)
    setSidebarOpen(false)
  }

  const handleSelectOrden = (orden: OrdenProduccion) => {
    setSelectedOrden(orden)
    setSidebarOpen(false)
  }

  const handleCrearOrden = () => {
    setShowCrearOrdenModal(true)
  }

  const handleOrdenCreated = () => {
    setSelectedObra(null)
    setShowCrearOrdenModal(false)
    setNotasCache({})
    setOrdenesCache({})
    startTransition(() => {
      router.refresh()
    })
  }

  const handleIniciarProduccion = () => {
    setIsIniciarModalOpen(true)
  }

  const handleFinalizarProduccion = () => {
    setIsFinalizarModalOpen(true)
  }

  const handleConfirmIniciar = async () => {
    if (!selectedOrden) return

    setIsProduccionLoading(true)
    try {
      const result = await startProduccion(selectedOrden.cod_op)

      if (result.success) {
        setIsIniciarModalOpen(false)
        // Actualizar estado optimista
        const ordenActualizada = {
          ...selectedOrden,
          estado: 'EN PRODUCCION' as const,
          obra: {
            ...selectedOrden.obra,
            estado: 'EN PRODUCCION' as const,
          },
        }
        setSelectedOrden(ordenActualizada)
        setOrdenesCache({})
        notify.success('Produccion iniciada correctamente.')

        // Recargar datos del servidor
        startTransition(() => {
          router.refresh()
        })
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
        setNotasCache({})
        setOrdenesCache({})
        notify.success('Produccion finalizada correctamente.')

        // Recargar datos del servidor
        startTransition(() => {
          router.refresh()
        })
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

  return (
    <div className="flex h-screen flex-col">
      {/* Header mejorado para móvil */}
      <div className="border-b bg-white px-5 py-5 lg:px-8 lg:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Botón hamburguesa para móvil */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
            >
              {sidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
                Dashboard de Producción
              </h1>
              <p className="mt-1 text-sm text-gray-600 lg:text-base">
                {usuario.nombre} {usuario.apellido} - {usuario.rol_actual}
              </p>
            </div>
          </div>
          {activeTab === 'notas' ? (
            <div className="flex space-x-4 text-sm lg:space-x-6 lg:text-base">
              <div className="rounded-lg bg-orange-50 px-4 py-2 text-center">
                <div className="text-lg font-semibold text-orange-600 lg:text-xl">
                  {notasSinOrdenCount}
                </div>
                <div className="text-xs text-gray-600 lg:text-sm">
                  Sin Orden
                </div>
              </div>
              <div className="rounded-lg bg-green-50 px-4 py-2 text-center">
                <div className="text-lg font-semibold text-green-600 lg:text-xl">
                  {notasEnProduccionCount}
                </div>
                <div className="text-xs text-gray-600 lg:text-sm">
                  En Producción
                </div>
              </div>
            </div>
          ) : (
            <div className="flex space-x-3 text-sm lg:space-x-4 lg:text-base">
              <div className="rounded-lg bg-amber-50 px-3 py-2 text-center lg:px-4">
                <div className="text-lg font-semibold text-amber-600 lg:text-xl">
                  {ordenesPendientesCount}
                </div>
                <div className="text-xs text-gray-600 lg:text-sm">
                  Pendientes
                </div>
              </div>
              <div className="rounded-lg bg-blue-50 px-3 py-2 text-center lg:px-4">
                <div className="text-lg font-semibold text-blue-600 lg:text-xl">
                  {ordenesAprobadasCount}
                </div>
                <div className="text-xs text-gray-600 lg:text-sm">
                  Aprobadas
                </div>
              </div>
              <div className="rounded-lg bg-green-50 px-3 py-2 text-center lg:px-4">
                <div className="text-lg font-semibold text-green-600 lg:text-xl">
                  {ordenesEnProduccionCount}
                </div>
                <div className="text-xs text-gray-600 lg:text-sm">
                  En Producción
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar responsivo */}
        <div
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed inset-y-0 left-0 z-50 w-96 transform transition-transform duration-300 ease-in-out lg:relative lg:w-[28rem] lg:translate-x-0`}
        >
          <aside className="flex h-full w-full flex-shrink-0 flex-col border-r border-gray-200 bg-white">
            <TabNavigation
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />

            <div className="flex-1 overflow-hidden">
              {activeTab === 'notas' ? (
                <SidebarNotasFabrica
                  obras={currentNotas}
                  statusFilter={activeNotasTab}
                  onStatusChange={handleNotasTabChange}
                  filters={notasFilters}
                  onFiltersChange={handleNotasFiltersChange}
                  selectedObra={selectedObra}
                  onSelectObra={handleSelectObra}
                  loading={loadingNotas}
                  error={errorNotas}
                  onRetry={handleRetryNotas}
                />
              ) : (
                <SidebarOrdenesProduccion
                  ordenes={currentOrdenes}
                  statusFilter={activeOrdenesTab}
                  onStatusChange={handleOrdenesTabChange}
                  filters={ordenesFilters}
                  onFiltersChange={handleOrdenesFiltersChange}
                  selectedOrden={selectedOrden}
                  onSelectOrden={handleSelectOrden}
                  loading={loadingOrdenes}
                  error={errorOrdenes}
                  onRetry={handleRetryOrdenes}
                />
              )}
            </div>
          </aside>
        </div>

        {/* Overlay para móvil */}
        {sidebarOpen && (
          <div
            className="bg-opacity-50 fixed inset-0 z-40 bg-transparent backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Contenido principal */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 lg:p-8">
          {activeTab === 'notas' ? (
            selectedObra ? (
              <NotaFabricaDetails
                obra={selectedObra}
                onCrearOrden={handleCrearOrden}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-center">
                <div className="px-4">
                  <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300 lg:h-16 lg:w-16" />
                  <p className="mb-4 text-base text-gray-500 lg:text-lg">
                    Selecciona una nota de fábrica para ver los detalles
                  </p>
                  <div className="flex justify-center gap-4 text-sm lg:gap-6 lg:text-base">
                    <div className="rounded-lg bg-orange-50 px-4 py-2 text-center">
                      <div className="text-lg font-semibold text-orange-600 lg:text-xl">
                        {notasSinOrdenCount}
                      </div>
                      <div className="text-xs text-gray-600 lg:text-sm">
                        Sin Orden
                      </div>
                    </div>
                    <div className="rounded-lg bg-green-50 px-4 py-2 text-center">
                      <div className="text-lg font-semibold text-green-600 lg:text-xl">
                        {notasEnProduccionCount}
                      </div>
                      <div className="text-xs text-gray-600 lg:text-sm">
                        En Producción
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : selectedOrden ? (
            <OrdenProduccionDetails
              orden={selectedOrden}
              onIniciarProduccion={
                selectedOrden.estado === 'APROBADA'
                  ? handleIniciarProduccion
                  : undefined
              }
              onFinalizarProduccion={
                selectedOrden.estado === 'EN PRODUCCION'
                  ? handleFinalizarProduccion
                  : undefined
              }
            />
          ) : (
            <div className="flex h-full items-center justify-center text-center">
              <div className="px-4">
                <Package className="mx-auto mb-4 h-12 w-12 text-gray-300 lg:h-16 lg:w-16" />
                <p className="mb-4 text-base text-gray-500 lg:text-lg">
                  Selecciona una orden de producción para ver los detalles
                </p>
                <div className="flex justify-center gap-4 text-sm lg:gap-6 lg:text-base">
                  <div className="rounded-lg bg-blue-50 px-4 py-2 text-center">
                    <div className="text-lg font-semibold text-blue-600 lg:text-xl">
                      {ordenesAprobadasCount}
                    </div>
                    <div className="text-xs text-gray-600 lg:text-sm">
                      Por Iniciar
                    </div>
                  </div>
                  <div className="rounded-lg bg-green-50 px-4 py-2 text-center">
                    <div className="text-lg font-semibold text-green-600 lg:text-xl">
                      {ordenesEnProduccionCount}
                    </div>
                    <div className="text-xs text-gray-600 lg:text-sm">
                      En Producción
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal para crear orden de producción */}
      <CrearOrdenModal
        isOpen={showCrearOrdenModal}
        onClose={() => setShowCrearOrdenModal(false)}
        obraCodigo={selectedObra?.cod_obra}
        onSuccess={handleOrdenCreated}
      />

      {/* Modal para iniciar producción */}
      <IniciarProduccionModal
        isOpen={isIniciarModalOpen}
        orden={selectedOrden}
        onConfirm={handleConfirmIniciar}
        onCancel={() => setIsIniciarModalOpen(false)}
        loading={isProduccionLoading}
      />

      {/* Modal para finalizar producción */}
      <FinalizarProduccionModal
        isOpen={isFinalizarModalOpen}
        orden={selectedOrden}
        onConfirm={handleConfirmFinalizar}
        onCancel={() => setIsFinalizarModalOpen(false)}
        loading={isProduccionLoading}
      />
    </div>
  )
}
