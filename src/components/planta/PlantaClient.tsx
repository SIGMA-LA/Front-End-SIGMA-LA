'use client'

import { useState } from 'react'
import type { Empleado, EntregaEmpleado, PaginatedResponse } from '@/types'
import EntregasSidebar from '@/components/planta/EntregasSidebar'
import EntregaDetails from '@/components/planta/EntregaDetails'
import FinalizarEntregaModal from '@/components/planta/FinalizarEntregaModal'
import EmptyState from '@/components/planta/EmptyState'
import DashboardHeader from '@/components/shared/DashboardHeader'
import { finalizarEntrega, cancelarEntrega } from '@/actions/entregas'
import { notify } from '@/lib/toast'
import useEntregasPaginadas from '@/hooks/useEntregasPaginadas'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PlantaClientProps {
  usuario: Empleado
  responseInitial: PaginatedResponse<EntregaEmpleado>
  errorInitial: string | null
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PlantaClient({
  usuario,
  responseInitial,
  errorInitial,
}: PlantaClientProps) {
  // UI state
  const [selectedEntrega, setSelectedEntrega] = useState<EntregaEmpleado | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [observacionesFinal, setObservacionesFinal] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [finalizandoEntrega, setFinalizandoEntrega] = useState(false)

  // Paginated list — extracted into reusable hook
  const {
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
    lastElementRef,
    handleRetry,
  } = useEntregasPaginadas({
    cuil: usuario.cuil,
    initialData: responseInitial,
  })

  // Merge errorInitial so the first paint can show SSR errors
  const displayError = error ?? errorInitial

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleSelectEntrega = (entrega: EntregaEmpleado) => {
    setSelectedEntrega(entrega)
    setSidebarOpen(false)
  }

  const handleFinalizarEntrega = async () => {
    if (!selectedEntrega || finalizandoEntrega) return
    try {
      setFinalizandoEntrega(true)
      finalizarEntrega(selectedEntrega.cod_entrega, observacionesFinal || undefined)
      setSelectedEntrega({
        ...selectedEntrega,
        entrega: {
          ...selectedEntrega.entrega,
          estado: 'ENTREGADO',
          observaciones: observacionesFinal || selectedEntrega.entrega.observaciones,
        },
      })
      setShowConfirmModal(false)
      setObservacionesFinal('')
      notify.success('Entrega finalizada correctamente.')
    } catch (err) {
      console.error('Error al finalizar entrega:', err)
      notify.error('Error al finalizar la entrega. Inténtalo de nuevo.')
    } finally {
      setFinalizandoEntrega(false)
    }
  }

  const handleCancelarEntrega = async () => {
    if (!selectedEntrega || finalizandoEntrega) return
    try {
      setFinalizandoEntrega(true)
      cancelarEntrega(selectedEntrega.cod_entrega, observacionesFinal || 'No se especificó motivo.')
      setSelectedEntrega(null)
      setShowConfirmModal(false)
      setObservacionesFinal('')
      notify.success('Entrega cancelada correctamente.')
    } catch (err) {
      console.error('Error al cancelar entrega:', err)
      notify.error('Error al cancelar la entrega. Inténtalo de nuevo.')
    } finally {
      setFinalizandoEntrega(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const badgeLabel = `ENTREGAS ${
    estadoFiltro === 'PENDIENTE' ? 'PENDIENTES' : estadoFiltro === 'ENTREGADO' ? 'ENTREGADAS' : 'CANCELADAS'
  } LISTADAS`

  return (
    <div className="flex h-screen flex-col">
      <DashboardHeader
        titulo="Dashboard de Entregas"
        subtitulo={`${usuario.nombre} ${usuario.apellido} - ${usuario.rol_actual}`}
        badgeCount={entregas.length}
        badgeLabel={badgeLabel}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 overflow-hidden">
        <div
          className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-full transform transition-transform duration-300 ease-in-out sm:w-96 lg:relative lg:w-[28rem] lg:translate-x-0`}
        >
          <EntregasSidebar
            entregas={entregas}
            estadoFiltro={estadoFiltro}
            onEstadoFiltroChange={setEstadoFiltro}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            filterDate={filterDate}
            onFilterDateChange={setFilterDate}
            selectedEntrega={selectedEntrega}
            onSelectEntrega={handleSelectEntrega}
            loadingEntregas={loading}
            errorEntregas={displayError}
            onRetry={handleRetry}
            onClose={() => setSidebarOpen(false)}
            lastElementRef={lastElementRef}
            loadingMore={loadingMore}
          />
        </div>

        {sidebarOpen && (
          <div
            className="bg-opacity-50 fixed inset-0 z-40 bg-transparent backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 lg:p-8">
          {selectedEntrega ? (
            <EntregaDetails
              entrega={selectedEntrega}
              onFinalizarEntrega={() => setShowConfirmModal(true)}
            />
          ) : (
            <EmptyState message="Selecciona una entrega del panel lateral para ver los detalles" />
          )}
        </main>
      </div>

      <FinalizarEntregaModal
        isOpen={showConfirmModal}
        observaciones={observacionesFinal}
        onObservacionesChange={setObservacionesFinal}
        onConfirm={handleFinalizarEntrega}
        onCancelDelivery={handleCancelarEntrega}
        onCancel={() => {
          if (!finalizandoEntrega) {
            setShowConfirmModal(false)
            setObservacionesFinal('')
          }
        }}
        entregaSeleccionada={selectedEntrega}
        loading={finalizandoEntrega}
      />
    </div>
  )
}
