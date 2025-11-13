'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { User as UserIcon, Package, Menu, X } from 'lucide-react'
import type { Visita, EntregaEmpleado, Empleado } from '@/types'
import TabNavigation from '@/components/visitador/TabNavigation'
import SidebarVisitas from '@/components/visitador/SidebarVisitas'
import VisitaDetailsVisitador from '@/components/visitador/VisitaDetailsVisitador'
import EntregaDetails from '@/components/planta/EntregaDetails'
import ConfirmModal from '@/components/visitador/ConfirmModal'
import EntregasSidebar from '@/components/planta/EntregasSidebar'
import FinalizarEntregaModal from '@/components/planta/FinalizarEntregaModal'
import { finalizarVisita, cancelarVisita } from '@/actions/visitas'
import { finalizarEntrega, cancelarEntrega } from '@/actions/entregas'

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

  // Tab activa
  const [activeTab, setActiveTab] = useState<'visitas' | 'entregas'>('visitas')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Estados para Visitas
  const [selectedVisita, setSelectedVisita] = useState<Visita | null>(null)
  const [showVisitaModal, setShowVisitaModal] = useState(false)
  const [observacionesVisita, setObservacionesVisita] = useState('')

  // Estados para Entregas
  const [selectedEntrega, setSelectedEntrega] =
    useState<EntregaEmpleado | null>(null)
  const [showEntregaModal, setShowEntregaModal] = useState(false)
  const [observacionesEntrega, setObservacionesEntrega] = useState('')

  const handleTabChange = (tab: 'visitas' | 'entregas') => {
    setActiveTab(tab)
    setSelectedVisita(null)
    setSelectedEntrega(null)
  }

  const handleSelectVisita = (visita: Visita) => {
    setSelectedVisita(visita)
    setSidebarOpen(false)
  }

  const handleSelectEntrega = (entrega: EntregaEmpleado) => {
    setSelectedEntrega(entrega)
    setSidebarOpen(false)
  }

  const handleConfirmarFinalizacion = async () => {
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
        router.refresh()
      } else {
        alert(result.error || 'Error al finalizar la visita')
      }
    })
  }

  const handleConfirmarCancelacion = async () => {
    if (!selectedVisita || !observacionesVisita.trim()) {
      alert('Por favor, ingresa un motivo para la cancelación.')
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
        router.refresh()
      } else {
        alert(result.error || 'Error al cancelar la visita')
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
        router.refresh()
      } else {
        alert(result.error || 'Error al finalizar la entrega')
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
        router.refresh()
      } else {
        alert(result.error || 'Error al cancelar la entrega')
      }
    })
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
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
                  {activeTab === 'visitas'
                    ? initialData.visitasPendientes.length
                    : initialData.entregasPendientes.length}
                </div>
                <div className="text-xs text-gray-600">Pendientes</div>
              </div>
              <div className="rounded-lg bg-green-50 px-3 py-2 text-center">
                <div className="text-base font-semibold text-green-600">
                  {activeTab === 'visitas'
                    ? initialData.visitasRealizadas.length
                    : initialData.entregasRealizadas.length}
                </div>
                <div className="text-xs text-gray-600">
                  {activeTab === 'visitas' ? 'Realizadas' : 'Entregadas'}
                </div>
              </div>
            </div>
          </div>
          <div className="hidden gap-6 sm:flex">
            <div className="rounded-lg bg-blue-50 px-4 py-2 text-center">
              <div className="text-lg font-semibold text-blue-600 lg:text-xl">
                {activeTab === 'visitas'
                  ? initialData.visitasPendientes.length
                  : initialData.entregasPendientes.length}
              </div>
              <div className="text-sm text-gray-600 lg:text-base">
                Pendientes
              </div>
            </div>
            <div className="rounded-lg bg-green-50 px-4 py-2 text-center">
              <div className="text-lg font-semibold text-green-600 lg:text-xl">
                {activeTab === 'visitas'
                  ? initialData.visitasRealizadas.length
                  : initialData.entregasRealizadas.length}
              </div>
              <div className="text-sm text-gray-600 lg:text-base">
                {activeTab === 'visitas' ? 'Realizadas' : 'Entregadas'}
              </div>
            </div>
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
          <aside className="h-full w-full flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white">
            <TabNavigation
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />

            <div className="space-y-4 p-3 lg:space-y-6">
              {activeTab === 'visitas' ? (
                <SidebarVisitas
                  visitasPendientes={initialData.visitasPendientes}
                  visitasRealizadas={initialData.visitasRealizadas}
                  selectedVisita={selectedVisita}
                  onSelectVisita={handleSelectVisita}
                />
              ) : (
                <EntregasSidebar
                  entregasPendientes={initialData.entregasPendientes}
                  entregasRealizadas={initialData.entregasRealizadas}
                  selectedEntrega={selectedEntrega}
                  onSelectEntrega={handleSelectEntrega}
                  loadingEntregas={isPending}
                  errorEntregas={initialData.error}
                  onRetry={() => router.refresh()}
                />
              )}
            </div>
          </aside>
        </div>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-transparent backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 lg:p-8">
          {activeTab === 'visitas' ? (
            selectedVisita ? (
              <VisitaDetailsVisitador
                visita={selectedVisita}
                onFinalizarVisita={() => {
                  if (
                    selectedVisita.estado === 'PROGRAMADA' ||
                    selectedVisita.estado === 'EN CURSO'
                  ) {
                    setShowVisitaModal(true)
                  }
                }}
              />
            ) : (
              <EmptyStateVisitas
                totalPendientes={initialData.visitasPendientes.length}
                totalRealizadas={initialData.visitasRealizadas.length}
              />
            )
          ) : selectedEntrega ? (
            <EntregaDetails
              entrega={selectedEntrega}
              onFinalizarEntrega={() => {
                if (selectedEntrega.entrega.estado === 'PENDIENTE') {
                  setShowEntregaModal(true)
                }
              }}
            />
          ) : (
            <EmptyStateEntregas
              totalPendientes={initialData.entregasPendientes.length}
              totalEntregadas={initialData.entregasRealizadas.length}
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
        onConfirm={handleConfirmarFinalizacion}
        onCancelVisit={handleConfirmarCancelacion}
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

function EmptyStateVisitas({
  totalPendientes,
  totalRealizadas,
}: {
  totalPendientes: number
  totalRealizadas: number
}) {
  return (
    <div className="flex h-full items-center justify-center text-center">
      <div className="px-4">
        <UserIcon className="mx-auto mb-4 h-12 w-12 text-gray-300 lg:h-16 lg:w-16" />
        <p className="mb-4 text-base text-gray-500 lg:text-lg">
          Selecciona una visita para ver los detalles
        </p>
        <div className="flex justify-center gap-4 text-sm lg:gap-6 lg:text-base">
          <div className="rounded-lg bg-blue-50 px-4 py-2 text-center">
            <div className="text-lg font-semibold text-blue-600 lg:text-xl">
              {totalPendientes}
            </div>
            <div className="text-xs text-gray-600 lg:text-sm">Pendientes</div>
          </div>
          <div className="rounded-lg bg-green-50 px-4 py-2 text-center">
            <div className="text-lg font-semibold text-green-600 lg:text-xl">
              {totalRealizadas}
            </div>
            <div className="text-xs text-gray-600 lg:text-sm">Realizadas</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyStateEntregas({
  totalPendientes,
  totalEntregadas,
}: {
  totalPendientes: number
  totalEntregadas: number
}) {
  return (
    <div className="flex h-full items-center justify-center text-center">
      <div className="px-4">
        <Package className="mx-auto mb-4 h-12 w-12 text-gray-300 lg:h-16 lg:w-16" />
        <p className="mb-4 text-base text-gray-500 lg:text-lg">
          Selecciona una entrega para ver los detalles
        </p>
        <div className="flex justify-center gap-4 text-sm lg:gap-6 lg:text-base">
          <div className="rounded-lg bg-blue-50 px-4 py-2 text-center">
            <div className="text-lg font-semibold text-blue-600 lg:text-xl">
              {totalPendientes}
            </div>
            <div className="text-xs text-gray-600 lg:text-sm">Pendientes</div>
          </div>
          <div className="rounded-lg bg-green-50 px-4 py-2 text-center">
            <div className="text-lg font-semibold text-green-600 lg:text-xl">
              {totalEntregadas}
            </div>
            <div className="text-xs text-gray-600 lg:text-sm">Entregadas</div>
          </div>
        </div>
      </div>
    </div>
  )
}
