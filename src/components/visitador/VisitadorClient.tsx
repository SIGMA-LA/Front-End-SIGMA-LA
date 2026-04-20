'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User as UserIcon, Package } from 'lucide-react'
import type {
  Visita,
  EntregaEmpleado,
  Empleado,
  PaginatedResponse,
} from '@/types'
import SidebarVisitas from '@/components/visitador/SidebarVisitas'
import SidebarEntregasVisitador from '@/components/visitador/SidebarEntregasVisitador'
import VisitaDetailsVisitador from '@/components/visitador/VisitaDetailsVisitador'
import EntregaDetails from '@/components/planta/EntregaDetails'
import ConfirmModal from '@/components/visitador/ConfirmModal'
import FinalizarEntregaModal from '@/components/planta/FinalizarEntregaModal'
import DashboardHeader from '@/components/shared/DashboardHeader'
import useEntregasPaginadas from '@/hooks/useEntregasPaginadas'
import useVisitasPaginadas from '@/hooks/useVisitasPaginadas'
import useVisitadorActions from '@/hooks/useVisitadorActions'

interface VisitadorClientProps {
  usuario: Empleado
  initialData: {
    visitasPendientes: PaginatedResponse<Visita>
    visitasRealizadas: PaginatedResponse<Visita>
    entregasPendientes: PaginatedResponse<EntregaEmpleado>
    entregasRealizadas: PaginatedResponse<EntregaEmpleado>
    error: string | null
  }
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

/**
 * Main dashboard for Visitadores.
 * Refactored to separate visual composition from business logic via useVisitadorActions hook.
 */
export default function VisitadorClient({
  usuario,
  initialData,
}: VisitadorClientProps) {
  const router = useRouter()
  const [categoryFilter, setCategoryFilter] = useState<'VISITAS' | 'ENTREGAS'>(
    'VISITAS'
  )

  const actions = useVisitadorActions()

  // Paginated visitas
  const {
    visitas,
    statusFilter: visitaStatusFilter,
    setStatusFilter: setVisitaStatusFilter,
    searchTerm: visitaSearch,
    setSearchTerm: setVisitaSearch,
    filterDate: visitaDate,
    setFilterDate: setVisitaDate,
    loading: loadingVisitas,
    loadingMore: loadingMoreVisitas,
    lastElementRef: visitaLastRef,
  } = useVisitasPaginadas({
    cuil: usuario.cuil,
    initialData: initialData.visitasPendientes,
  })

  // Paginated entregas
  const {
    entregas,
    estadoFiltro: entregaEstadoFiltro,
    setEstadoFiltro: setEntregaEstado,
    searchTerm: entregaSearch,
    setSearchTerm: setEntregaSearch,
    filterDate: entregaDate,
    setFilterDate: setEntregaDate,
    loading: loadingEntregas,
    loadingMore: loadingMoreEntregas,
    lastElementRef: entregaLastRef,
  } = useEntregasPaginadas({
    cuil: usuario.cuil,
    initialData: initialData.entregasPendientes,
  })

  const entregaStatusFilter =
    entregaEstadoFiltro === 'ENTREGADO'
      ? 'REALIZADA'
      : entregaEstadoFiltro === 'CANCELADO'
        ? 'CANCELADA'
        : 'PENDIENTE'

  const activeStatusFilter =
    categoryFilter === 'VISITAS' ? visitaStatusFilter : entregaStatusFilter

  const handleCategoryChange = (category: 'VISITAS' | 'ENTREGAS') => {
    setCategoryFilter(category)
    actions.setSelectedVisita(null)
    actions.setSelectedEntrega(null)
  }

  const badgeCount =
    categoryFilter === 'VISITAS' ? visitas.length : entregas.length
  const badgeLabel = `${categoryFilter === 'VISITAS' ? 'VISITAS' : 'ENTREGAS'} ${
    activeStatusFilter === 'PENDIENTE'
      ? 'PENDIENTES'
      : activeStatusFilter === 'REALIZADA'
        ? 'REALIZADAS'
        : 'CANCELADAS'
  } LISTADAS`

  return (
    <div className="flex h-screen flex-col">
      <DashboardHeader
        titulo="Dashboard del Visitador"
        subtitulo={`${usuario.nombre} ${usuario.apellido} - ${usuario.rol_actual}`}
        badgeCount={badgeCount}
        badgeLabel={badgeLabel}
        sidebarOpen={actions.sidebarOpen}
        onToggleSidebar={() => actions.setSidebarOpen(!actions.sidebarOpen)}
      />

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`${actions.sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 flex w-full transform flex-col border-r border-gray-100 bg-white transition-transform duration-300 ease-in-out lg:static lg:w-80 lg:translate-x-0 xl:w-96`}
        >
          {categoryFilter === 'VISITAS' ? (
            <SidebarVisitas
              activeCategory={categoryFilter}
              onCategoryChange={handleCategoryChange}
              statusFilter={visitaStatusFilter}
              onStatusChange={setVisitaStatusFilter}
              visitas={visitas}
              searchTerm={visitaSearch}
              onSearchTermChange={setVisitaSearch}
              filterDate={visitaDate}
              onFilterDateChange={setVisitaDate}
              selectedVisita={actions.selectedVisita}
              onSelectVisita={actions.handleSelectVisita}
              onRetry={() => router.refresh()}
              onClose={() => actions.setSidebarOpen(false)}
              lastElementRef={visitaLastRef}
              loadingMore={loadingMoreVisitas}
              loadingVisitas={loadingVisitas}
              errorVisitas={initialData.error}
            />
          ) : (
            <SidebarEntregasVisitador
              activeCategory={categoryFilter}
              onCategoryChange={handleCategoryChange}
              statusFilter={entregaStatusFilter}
              onStatusChange={(s) =>
                setEntregaEstado(
                  s === 'PENDIENTE'
                    ? 'PENDIENTE'
                    : s === 'REALIZADA'
                      ? 'ENTREGADO'
                      : 'CANCELADO'
                )
              }
              entregas={entregas}
              searchTerm={entregaSearch}
              onSearchTermChange={setEntregaSearch}
              filterDate={entregaDate}
              onFilterDateChange={setEntregaDate}
              selectedEntrega={actions.selectedEntrega}
              onSelectEntrega={actions.handleSelectEntrega}
              onRetry={() => router.refresh()}
              onClose={() => actions.setSidebarOpen(false)}
              lastElementRef={entregaLastRef}
              loadingMore={loadingMoreEntregas}
              loadingEntregas={loadingEntregas}
              errorEntregas={initialData.error}
            />
          )}
        </aside>

        {actions.sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-gray-900/20 backdrop-blur-sm lg:hidden"
            onClick={() => actions.setSidebarOpen(false)}
          />
        )}

        <main className="relative flex-1 overflow-y-auto p-4 lg:p-8">
          {actions.loadingDetails && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-sm font-bold text-gray-700">
                  Cargando detalles...
                </p>
              </div>
            </div>
          )}

          {categoryFilter === 'VISITAS' ? (
            actions.selectedVisita ? (
              <VisitaDetailsVisitador
                visita={actions.selectedVisita}
                onFinalizarVisita={() => actions.setShowVisitaModal(true)}
              />
            ) : (
              <EmptyState
                icon={<UserIcon className="h-16 w-16 text-gray-200" />}
                message="Selecciona una visita para ver detalles"
              />
            )
          ) : actions.selectedEntrega ? (
            <EntregaDetails
              entrega={actions.selectedEntrega}
              onFinalizarEntrega={() => actions.setShowEntregaModal(true)}
            />
          ) : (
            <EmptyState
              icon={<Package className="h-16 w-16 text-gray-200" />}
              message="Selecciona una entrega para ver detalles"
            />
          )}
        </main>
      </div>

      <ConfirmModal
        isOpen={actions.showVisitaModal}
        title="Finalizar Visita"
        observaciones={actions.observacionesVisita}
        onObservacionesChange={actions.setObservacionesVisita}
        onConfirm={actions.handleConfirmarFinalizacionVisita}
        onCancelVisit={actions.handleConfirmarCancelacionVisita}
        onCancel={() => {
          if (!actions.isPending) {
            actions.setShowVisitaModal(false)
            actions.setObservacionesVisita('')
          }
        }}
        loading={actions.isPending}
      />

      <FinalizarEntregaModal
        isOpen={actions.showEntregaModal}
        observaciones={actions.observacionesEntrega}
        onObservacionesChange={actions.setObservacionesEntrega}
        onConfirm={actions.handleFinalizarEntrega}
        onCancelDelivery={actions.handleCancelarEntrega}
        onCancel={() => {
          if (!actions.isPending) {
            actions.setShowEntregaModal(false)
            actions.setObservacionesEntrega('')
          }
        }}
        entregaSeleccionada={actions.selectedEntrega}
        loading={actions.isPending}
      />
    </div>
  )
}
