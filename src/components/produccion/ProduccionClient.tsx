'use client'

import { FileText, Package, Menu, X, Play, CheckCircle } from 'lucide-react'
import type { Obra, OrdenProduccion, Empleado } from '@/types'
import TabNavigation from './TabNavigation'
import SidebarNotasFabrica from './SidebarNotasFabrica'
import SidebarOrdenesProduccion from './SidebarOrdenesProduccion'
import NotaFabricaDetails from './NotaFabricaDetails'
import OrdenProduccionDetails from './OrdenProduccionDetails'
import CrearOrdenModal from './CrearOrdenModal'
import ProduccionActionModal from './ProduccionActionModal'
import ProduccionEmptyState from './ProduccionEmptyState'
import useProduccionClient from '@/hooks/useProduccionClient'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProduccionClientProps {
  usuario: Empleado
  initialNotasSinOrden: Obra[]
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Main production dashboard.
 * Manages production orders and factory notes through two main tabs.
 * Refactored to use useProduccionClient hook and ProduccionEmptyState component.
 */
export default function ProduccionClient({
  usuario,
  initialNotasSinOrden,
}: ProduccionClientProps) {
  const {
    activeTab,
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
    refreshAll,
  } = useProduccionClient(usuario, initialNotasSinOrden)

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b bg-white px-5 py-5 lg:px-8 lg:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">Dashboard de Producción</h1>
              <p className="mt-1 text-sm text-gray-600 lg:text-base">
                {usuario.nombre} {usuario.apellido} - {usuario.rol_actual}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3 text-sm lg:space-x-4 lg:text-base">
            {activeTab === 'notas' ? (
              <>
                <StatBadge count={notasSinOrdenCount} label="Sin Orden" color="orange" />
                <StatBadge count={notasEnProduccionCount} label="En Producción" color="green" />
              </>
            ) : (
              <>
                <StatBadge count={ordenesPendientesCount} label="Pendientes" color="amber" />
                <StatBadge count={ordenesAprobadasCount} label="Aprobadas" color="blue" />
                <StatBadge count={ordenesEnProduccionCount} label="En Producción" color="green" />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed inset-y-0 left-0 z-50 w-96 transform transition-transform duration-300 ease-in-out lg:relative lg:w-[28rem] lg:translate-x-0`}
        >
          <aside className="flex h-full w-full flex-shrink-0 flex-col border-r border-gray-200 bg-white">
            <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
            <div className="flex-1 overflow-hidden">
              {activeTab === 'notas' ? (
                <SidebarNotasFabrica
                  obras={currentNotas}
                  statusFilter={activeNotasTab}
                  onStatusChange={handleNotasTabChange}
                  filters={notasFilters}
                  onFiltersChange={setNotasFilters}
                  selectedObra={selectedObra}
                  onSelectObra={(o) => { setSelectedObra(o); setSidebarOpen(false) }}
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
                  onFiltersChange={setOrdenesFilters}
                  selectedOrden={selectedOrden}
                  onSelectOrden={(o) => { setSelectedOrden(o); setSidebarOpen(false) }}
                  loading={loadingOrdenes}
                  error={errorOrdenes}
                  onRetry={handleRetryOrdenes}
                />
              )}
            </div>
          </aside>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 lg:p-8">
          {activeTab === 'notas' ? (
            selectedObra ? (
              <NotaFabricaDetails
                obra={selectedObra}
                onCrearOrden={() => setShowCrearOrdenModal(true)}
                onProduccionFinalizada={refreshAll}
              />
            ) : (
              <ProduccionEmptyState
                icon={FileText}
                message="Selecciona una nota de fábrica para ver los detalles"
                stats={[
                  { count: notasSinOrdenCount, label: 'Sin Orden', colorTheme: 'orange' },
                  { count: notasEnProduccionCount, label: 'En Producción', colorTheme: 'green' },
                ]}
              />
            )
          ) : selectedOrden ? (
            <OrdenProduccionDetails
              orden={selectedOrden}
              onIniciarProduccion={selectedOrden.estado === 'APROBADA' ? () => setIsIniciarModalOpen(true) : undefined}
              onFinalizarProduccion={selectedOrden.estado === 'EN PRODUCCION' ? () => setIsFinalizarModalOpen(true) : undefined}
            />
          ) : (
            <ProduccionEmptyState
              icon={Package}
              message="Selecciona una orden de producción para ver los detalles"
              stats={[
                { count: ordenesPendientesCount, label: 'Pendientes', colorTheme: 'amber' },
                { count: ordenesAprobadasCount, label: 'Aprobadas', colorTheme: 'blue' },
                { count: ordenesEnProduccionCount, label: 'En Producción', colorTheme: 'green' },
              ]}
            />
          )}
        </main>
      </div>

      <CrearOrdenModal
        isOpen={showCrearOrdenModal}
        onClose={() => setShowCrearOrdenModal(false)}
        obraCodigo={selectedObra?.cod_obra}
        onSuccess={refreshAll}
      />

      {selectedOrdenSummary && (
        <>
          <ProduccionActionModal
            isOpen={isIniciarModalOpen}
            title="Iniciar Producción"
            message="¿Está seguro que desea iniciar la producción de esta orden?"
            description="Esta acción cambiará el estado de la orden a EN PRODUCCIÓN y actualizará el estado de la obra asociada."
            confirmLabel="Iniciar Producción"
            loadingLabel="Iniciando..."
            tone="green"
            icon={<Play className="h-6 w-6" />}
            summary={selectedOrdenSummary}
            onConfirm={handleConfirmIniciar}
            onCancel={() => setIsIniciarModalOpen(false)}
            loading={isProduccionLoading}
          />
          <ProduccionActionModal
            isOpen={isFinalizarModalOpen}
            title="Finalizar Producción"
            message="¿Está seguro que desea finalizar la producción de esta orden?"
            description="Esta acción marcará la orden como FINALIZADA."
            confirmLabel="Finalizar Producción"
            loadingLabel="Finalizando..."
            tone="amber"
            icon={<CheckCircle className="h-6 w-6" />}
            summary={selectedOrdenSummary}
            warningTitle="Advertencia"
            warningText="Asegúrese de que todos los productos fueron completados antes de finalizar la producción."
            onConfirm={handleConfirmFinalizar}
            onCancel={() => setIsFinalizarModalOpen(false)}
            loading={isProduccionLoading}
          />
        </>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Internal Helper Components
// ---------------------------------------------------------------------------

function StatBadge({ count, label, color }: { count: number; label: string; color: 'orange' | 'green' | 'amber' | 'blue' }) {
  const themes = {
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
  }
  return (
    <div className={`rounded-lg px-3 py-2 text-center lg:px-4 ${themes[color]}`}>
      <div className="text-lg font-semibold lg:text-xl">{count}</div>
      <div className="text-xs text-gray-600 lg:text-sm">{label}</div>
    </div>
  )
}
