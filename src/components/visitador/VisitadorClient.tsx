'use client'

import React, { useState, useTransition, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { User as UserIcon, Package, Menu, X } from 'lucide-react'
import type { Visita, EntregaEmpleado, Empleado } from '@/types'
import SidebarVisitas from '@/components/visitador/SidebarVisitas'
import SidebarEntregasVisitador from '@/components/visitador/SidebarEntregasVisitador'
import VisitaDetailsVisitador from '@/components/visitador/VisitaDetailsVisitador'
import EntregaDetails from '@/components/planta/EntregaDetails'
import ConfirmModal from '@/components/visitador/ConfirmModal'
import FinalizarEntregaModal from '@/components/planta/FinalizarEntregaModal'
import {
  finalizarVisita,
  cancelarVisita,
  getVisitasByEmpleado,
} from '@/actions/visitas'
import {
  finalizarEntrega,
  cancelarEntrega,
  getEntregasByEmpleado,
} from '@/actions/entregas'
import { notify } from '@/lib/toast'

interface VisitadorClientProps {
  usuario: Empleado
  initialData: {
    visitasPendientes: Visita[]
    visitasRealizadas: Visita[]
    entregasPendientes: EntregaEmpleado[]
    entregasRealizadas: EntregaEmpleado[]
    error: string | null
  }
}

export default function VisitadorClient({
  usuario,
  initialData,
}: VisitadorClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Navigation state
  const [statusFilter, setStatusFilter] = useState<
    'PENDIENTE' | 'REALIZADA' | 'CANCELADA'
  >('PENDIENTE')
  const [categoryFilter, setCategoryFilter] = useState<'VISITAS' | 'ENTREGAS'>(
    'VISITAS'
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [debouncedDate, setDebouncedDate] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setDebouncedDate(filterDate)
    }, 1000)
    return () => clearTimeout(timer)
  }, [searchTerm, filterDate])

  // Data state (starts with initialData)
  const [visitas, setVisitas] = useState<Visita[]>(
    initialData.visitasPendientes
  )
  const [entregas, setEntregas] = useState<EntregaEmpleado[]>(
    initialData.entregasPendientes
  )
  const [loadingList, setLoadingList] = useState(false)

  // Selection state
  const [selectedVisita, setSelectedVisita] = useState<Visita | null>(null)
  const [selectedEntrega, setSelectedEntrega] =
    useState<EntregaEmpleado | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  // Modal state
  const [showVisitaModal, setShowVisitaModal] = useState(false)
  const [showEntregaModal, setShowEntregaModal] = useState(false)
  const [observacionesVisita, setObservacionesVisita] = useState('')
  const [observacionesEntrega, setObservacionesEntrega] = useState('')

  // Backend Filtering Logic
  const loadData = useCallback(async () => {
    setLoadingList(true)
    try {
      if (categoryFilter === 'VISITAS') {
        let estados: string[] = []
        if (statusFilter === 'PENDIENTE') estados = ['PROGRAMADA', 'EN CURSO']
        else if (statusFilter === 'REALIZADA') estados = ['COMPLETADA']
        else if (statusFilter === 'CANCELADA') estados = ['CANCELADA']

        const data = await getVisitasByEmpleado(
          usuario.cuil,
          estados,
          debouncedSearch,
          debouncedDate
        )
        setVisitas(data)
      } else {
        let status: 'PENDIENTE' | 'ENTREGADO' | 'CANCELADO' = 'PENDIENTE'
        if (statusFilter === 'PENDIENTE') status = 'PENDIENTE'
        else if (statusFilter === 'REALIZADA') status = 'ENTREGADO'
        else if (statusFilter === 'CANCELADA') status = 'CANCELADO'

        const data = await getEntregasByEmpleado(
          usuario.cuil,
          status,
          debouncedSearch,
          debouncedDate
        )
        setEntregas(data)
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      notify.error('Error al actualizar el listado')
    } finally {
      setLoadingList(false)
    }
  }, [
    categoryFilter,
    statusFilter,
    usuario.cuil,
    debouncedSearch,
    debouncedDate,
  ])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Handlers
  const handleCategoryChange = (category: 'VISITAS' | 'ENTREGAS') => {
    setCategoryFilter(category)
    setSelectedVisita(null)
    setSelectedEntrega(null)
  }

  const handleStatusChange = (
    status: 'PENDIENTE' | 'REALIZADA' | 'CANCELADA'
  ) => {
    setStatusFilter(status)
    setSelectedVisita(null)
    setSelectedEntrega(null)
  }

  const handleSelectVisita = (visita: Visita) => {
    if (selectedVisita?.cod_visita === visita.cod_visita) return
    setLoadingDetails(true)
    setSelectedVisita(visita)
    setSidebarOpen(false)
    setTimeout(() => setLoadingDetails(false), 400)
  }

  const handleSelectEntrega = (entrega: EntregaEmpleado) => {
    if (selectedEntrega?.cod_entrega === entrega.cod_entrega) return
    setLoadingDetails(true)
    setSelectedEntrega(entrega)
    setSidebarOpen(false)
    setTimeout(() => setLoadingDetails(false), 400)
  }

  const handleConfirmarFinalizacionVisita = async () => {
    if (!selectedVisita) return
    startTransition(async () => {
      const result = await finalizarVisita(
        selectedVisita.cod_visita,
        observacionesVisita
      )
      if (result.success) {
        setShowVisitaModal(false)
        setObservacionesVisita('')
        setSelectedVisita(null)
        notify.success('Visita finalizada correctamente.')
        loadData()
        router.refresh()
      } else {
        notify.error(result.error || 'Error al finalizar la visita')
      }
    })
  }

  const handleConfirmarCancelacionVisita = async () => {
    if (!selectedVisita || !observacionesVisita.trim()) {
      notify.warning('Por favor, ingresa un motivo para la cancelación.')
      return
    }
    startTransition(async () => {
      const result = await cancelarVisita(
        selectedVisita.cod_visita,
        observacionesVisita
      )
      if (result.success) {
        setShowVisitaModal(false)
        setObservacionesVisita('')
        setSelectedVisita(null)
        notify.success('Visita cancelada correctamente.')
        loadData()
        router.refresh()
      } else {
        notify.error(result.error || 'Error al cancelar la visita')
      }
    })
  }

  const handleFinalizarEntrega = async () => {
    if (!selectedEntrega) return
    startTransition(async () => {
      const result = await finalizarEntrega(
        selectedEntrega.cod_entrega,
        observacionesEntrega || undefined
      )
      if (result.success) {
        setShowEntregaModal(false)
        setObservacionesEntrega('')
        setSelectedEntrega(null)
        notify.success('Entrega finalizada correctamente.')
        loadData()
        router.refresh()
      } else {
        notify.error(result.error || 'Error al finalizar la entrega')
      }
    })
  }

  const handleCancelarEntrega = async () => {
    if (!selectedEntrega) return
    startTransition(async () => {
      const result = await cancelarEntrega(
        selectedEntrega.cod_entrega,
        observacionesEntrega || 'No se especificó motivo.'
      )
      if (result.success) {
        setShowEntregaModal(false)
        setObservacionesEntrega('')
        setSelectedEntrega(null)
        notify.success('Entrega cancelada correctamente.')
        loadData()
        router.refresh()
      } else {
        notify.error(result.error || 'Error al cancelar la entrega')
      }
    })
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header aligned with PlantaClient */}
      <div className="border-b bg-white px-2 py-4 sm:px-5 lg:px-8 lg:py-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full items-center justify-between sm:justify-start">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
            >
              {sidebarOpen ? (
                <X className="h-8 w-8" />
              ) : (
                <Menu className="h-8 w-8" />
              )}
            </button>
            <div className="flex flex-1 flex-col items-center sm:ml-3 sm:items-start">
              <h1 className="text-center text-base font-bold text-gray-900 sm:text-left sm:text-2xl lg:text-3xl">
                Dashboard del Visitador
              </h1>
              <span className="mt-1 text-center text-xs text-gray-600 sm:text-left sm:text-base lg:text-base">
                {usuario.nombre} {usuario.apellido} - {usuario.rol_actual}
              </span>
            </div>
            <div className="flex gap-2 sm:hidden">
              <div className="rounded-lg bg-blue-50 px-3 py-2 text-center">
                <div className="text-base font-semibold text-blue-600">
                  {categoryFilter === 'VISITAS'
                    ? visitas.length
                    : entregas.length}
                </div>
                <div className="text-[10px] font-bold text-gray-600">
                  {categoryFilter === 'VISITAS' ? 'VISITAS' : 'ENTREGAS'}{' '}
                  {statusFilter === 'PENDIENTE'
                    ? 'PEND.'
                    : statusFilter === 'REALIZADA'
                      ? 'REAL.'
                      : 'CANC.'}
                </div>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex">
            <div className="rounded-lg bg-blue-50 px-4 py-2 text-center">
              <div className="text-lg font-semibold text-blue-600 lg:text-xl">
                {categoryFilter === 'VISITAS'
                  ? visitas.length
                  : entregas.length}
              </div>
              <div className="text-sm font-bold text-gray-600 lg:text-base">
                {categoryFilter === 'VISITAS' ? 'VISITAS' : 'ENTREGAS'}{' '}
                {statusFilter === 'PENDIENTE'
                  ? 'PENDIENTES'
                  : statusFilter === 'REALIZADA'
                    ? 'REALIZADAS'
                    : 'CANCELADAS'}{' '}
                LISTADAS
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed inset-y-0 left-0 z-40 flex w-full transform flex-col border-r border-gray-100 bg-white transition-transform duration-300 ease-in-out lg:static lg:w-80 lg:translate-x-0 xl:w-96`}
        >
          {categoryFilter === 'VISITAS' ? (
            <SidebarVisitas
              activeCategory={categoryFilter}
              onCategoryChange={handleCategoryChange}
              statusFilter={statusFilter}
              onStatusChange={handleStatusChange}
              visitas={visitas}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              filterDate={filterDate}
              onFilterDateChange={setFilterDate}
              selectedVisita={selectedVisita}
              onSelectVisita={handleSelectVisita}
              loadingVisitas={loadingList}
              errorVisitas={initialData.error}
              onRetry={() => router.refresh()}
              onClose={() => setSidebarOpen(false)}
            />
          ) : (
            <SidebarEntregasVisitador
              activeCategory={categoryFilter}
              onCategoryChange={handleCategoryChange}
              statusFilter={statusFilter}
              onStatusChange={handleStatusChange}
              entregas={entregas}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              filterDate={filterDate}
              onFilterDateChange={setFilterDate}
              selectedEntrega={selectedEntrega}
              onSelectEntrega={handleSelectEntrega}
              loadingEntregas={loadingList}
              errorEntregas={initialData.error}
              onRetry={() => router.refresh()}
              onClose={() => setSidebarOpen(false)}
            />
          )}
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-gray-900/20 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="relative flex-1 overflow-y-auto p-4 lg:p-8">
          {loadingDetails && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-sm font-bold text-gray-700">
                  Cargando detalles de{' '}
                  {categoryFilter === 'VISITAS' ? 'visita' : 'entrega'}...
                </p>
              </div>
            </div>
          )}

          {categoryFilter === 'VISITAS' ? (
            selectedVisita ? (
              <VisitaDetailsVisitador
                visita={selectedVisita}
                onFinalizarVisita={() => setShowVisitaModal(true)}
              />
            ) : (
              <EmptyState
                icon={<UserIcon className="h-16 w-16 text-gray-200" />}
                message="Selecciona una visita para ver detalles"
              />
            )
          ) : selectedEntrega ? (
            <EntregaDetails
              entrega={selectedEntrega}
              onFinalizarEntrega={() => setShowEntregaModal(true)}
            />
          ) : (
            <EmptyState
              icon={<Package className="h-16 w-16 text-gray-200" />}
              message="Selecciona una entrega para ver detalles"
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={showVisitaModal}
        title="Finalizar Visita"
        observaciones={observacionesVisita}
        onObservacionesChange={setObservacionesVisita}
        onConfirm={handleConfirmarFinalizacionVisita}
        onCancelVisit={handleConfirmarCancelacionVisita}
        onCancel={() => {
          if (!isPending) {
            setShowVisitaModal(false)
            setObservacionesVisita('')
          }
        }}
        loading={isPending}
      />

      <FinalizarEntregaModal
        isOpen={showEntregaModal}
        observaciones={observacionesEntrega}
        onObservacionesChange={setObservacionesEntrega}
        onConfirm={handleFinalizarEntrega}
        onCancelDelivery={handleCancelarEntrega}
        onCancel={() => {
          if (!isPending) {
            setShowEntregaModal(false)
            setObservacionesEntrega('')
          }
        }}
        entregaSeleccionada={selectedEntrega}
        loading={isPending}
      />
    </div>
  )
}

function EmptyState({
  icon,
  message,
}: {
  icon: React.ReactNode
  message: string
}) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mb-4 flex justify-center">{icon}</div>
        <p className="text-xl font-medium text-gray-500">{message}</p>
      </div>
    </div>
  )
}
