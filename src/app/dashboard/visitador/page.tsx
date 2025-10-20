'use client'

import { useState, useEffect } from 'react'
import type { Visita, EntregaEmpleado } from '@/types'
import { useAuth } from '@/context/AuthContext'
import entregasService from '@/services/entregas.service'
import visitasService from '@/services/visitas.service'
import { User as UserIcon, Package, Menu, X } from 'lucide-react'

// Componentes existentes
import TabNavigation from '@/components/visitador/TabNavigation'
import SidebarVisitas from '@/components/visitador/SidebarVisitas'
import VisitaDetailsVisitador from '@/components/visitador/VisitaDetailsVisitador'
import EntregaDetails from '@/components/planta/EntregaDetails'
import ConfirmModal from '@/components/visitador/ConfirmModal'
import EntregasSidebar from '@/components/planta/EntregasSidebar'
import FinalizarEntregaModal from '@/components/planta/FinalizarEntregaModal'
import { useVisitasEmpleado } from '@/hooks/useVisitasEmpleado'

export default function Page() {
  const { usuario } = useAuth()

  // Tab activa
  const [activeTab, setActiveTab] = useState<'visitas' | 'entregas'>('visitas')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const {
    visitasPendientes,
    setVisitasPendientes,
    visitasRealizadas,
    setVisitasRealizadas,
    isLoading: loadingVisitas,
    error: errorVisitas,
    reloadVisitas,
  } = useVisitasEmpleado(usuario?.cuil)
  // Estados para Visitas
  const [selectedVisita, setSelectedVisita] = useState<Visita | null>(null)
  const [showVisitaModal, setShowVisitaModal] = useState(false)
  const [observacionesVisita, setObservacionesVisita] = useState('')

  const [finalizandoVisita, setFinalizandoVisita] = useState(false)

  // Estados para Entregas
  const [selectedEntrega, setSelectedEntrega] =
    useState<EntregaEmpleado | null>(null)
  const [showEntregaModal, setShowEntregaModal] = useState(false)
  const [observacionesEntrega, setObservacionesEntrega] = useState('')
  const [entregasPendientes, setEntregasPendientes] = useState<
    EntregaEmpleado[]
  >([])
  const [entregasRealizadas, setEntregasRealizadas] = useState<
    EntregaEmpleado[]
  >([])
  const [loadingEntregas, setLoadingEntregas] = useState(true)
  const [errorEntregas, setErrorEntregas] = useState<string | null>(null)
  const [finalizandoEntrega, setFinalizandoEntrega] = useState(false)

  // Cargar entregas al cambiar a la tab de entregas
  useEffect(() => {
    if (usuario?.cuil && activeTab === 'entregas') {
      loadEntregas()
    }
  }, [usuario?.cuil, activeTab])

  const loadEntregas = async () => {
    if (!usuario?.cuil) return

    try {
      setLoadingEntregas(true)
      setErrorEntregas(null)

      const [pendientes, entregadas] = await Promise.all([
        entregasService.getEntregasByEmpleadoAndEstado(
          usuario.cuil,
          'PENDIENTE'
        ),
        entregasService.getEntregasByEmpleadoAndEstado(
          usuario.cuil,
          'ENTREGADO'
        ),
      ])

      setEntregasPendientes(pendientes)
      setEntregasRealizadas(entregadas)
    } catch (error) {
      console.error('Error al cargar entregas:', error)
      setErrorEntregas('Error al cargar las entregas')
    } finally {
      setLoadingEntregas(false)
    }
  }

  // Handlers
  const handleTabChange = (tab: 'visitas' | 'entregas') => {
    setActiveTab(tab)
    setSelectedVisita(null)
    setSelectedEntrega(null)
    // No cerrar sidebar al cambiar tab
  }

  const handleSelectVisita = (visita: Visita) => {
    setSelectedVisita(visita)
    setSidebarOpen(false) // Cerrar sidebar en móvil al seleccionar
  }

  const handleSelectEntrega = (entrega: EntregaEmpleado) => {
    setSelectedEntrega(entrega)
    setSidebarOpen(false) // Cerrar sidebar en móvil al seleccionar
  }

  const handleRetryEntregas = async () => {
    await loadEntregas()
  }

  const handleConfirmarFinalizacion = async () => {
    if (selectedVisita && !finalizandoVisita) {
      try {
        setFinalizandoVisita(true)
        const visitaActualizada = await visitasService.finalizarVisita(
          selectedVisita.cod_visita,
          observacionesVisita
        )

        setSelectedVisita(visitaActualizada)
        setVisitasPendientes((prev) =>
          prev.filter((v) => v.cod_visita !== selectedVisita.cod_visita)
        )
        setVisitasRealizadas((prev) => [...prev, visitaActualizada])

        setShowVisitaModal(false)
        setObservacionesVisita('')
      } catch (error) {
        alert('Error al finalizar la visita. Inténtalo de nuevo.')
      } finally {
        setFinalizandoVisita(false)
      }
    }
  }

  const handleConfirmarCancelacion = async () => {
    if (selectedVisita && !finalizandoVisita) {
      if (!observacionesVisita.trim()) {
        alert('Por favor, ingresa un motivo para la cancelación.')
        return
      }
      try {
        setFinalizandoVisita(true)
        const visitaCancelada = await visitasService.cancelarVisita(
          selectedVisita.cod_visita,
          observacionesVisita
        )

        // Quitar de pendientes y opcionalmente agregar a una lista de canceladas
        setVisitasPendientes((prev) =>
          prev.filter((v) => v.cod_visita !== selectedVisita.cod_visita)
        )
        // Por ahora, la sacamos de la vista. Se podría crear un nuevo estado para 'visitasCanceladas'.

        setSelectedVisita(null) // De-seleccionar la visita
        setShowVisitaModal(false)
        setObservacionesVisita('')
      } catch (error) {
        alert('Error al cancelar la visita. Inténtalo de nuevo.')
      } finally {
        setFinalizandoVisita(false)
      }
    }
  }

  const handleFinalizarEntrega = async () => {
    if (selectedEntrega && !finalizandoEntrega) {
      try {
        setFinalizandoEntrega(true)
        const entregaActualizadaBackend =
          await entregasService.finalizarEntrega(
            selectedEntrega.cod_entrega,
            observacionesEntrega || undefined
          )

        const entregaActualizada = {
          ...selectedEntrega,
          entrega: {
            ...selectedEntrega.entrega,
            estado: entregaActualizadaBackend.estado,
            observaciones: entregaActualizadaBackend.observaciones,
          },
        }

        setEntregasPendientes((prev) =>
          prev.filter((e) => e.cod_entrega !== selectedEntrega.cod_entrega)
        )
        setEntregasRealizadas((prev) => [entregaActualizada, ...prev])
        setSelectedEntrega(entregaActualizada)

        setShowEntregaModal(false)
        setObservacionesEntrega('')
      } catch (error) {
        console.error('Error al finalizar entrega:', error)
        alert('Error al finalizar la entrega. Inténtalo de nuevo.')
      } finally {
        setFinalizandoEntrega(false)
      }
    }
  }

  const handleCancelarEntrega = async () => {
    if (selectedEntrega && !finalizandoEntrega) {
      try {
        setFinalizandoEntrega(true)
        await entregasService.cancelarEntrega(
          selectedEntrega.cod_entrega,
          observacionesEntrega || 'No se especificó motivo.'
        )

        setEntregasPendientes((prev) =>
          prev.filter((e) => e.cod_entrega !== selectedEntrega.cod_entrega)
        )
        setSelectedEntrega(null)

        setShowEntregaModal(false)
        setObservacionesEntrega('')
      } catch (error) {
        console.error('Error al cancelar entrega:', error)
        alert('Error al cancelar la entrega. Inténtalo de nuevo.')
      } finally {
        setFinalizandoEntrega(false)
      }
    }
  }

  if (!usuario) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl lg:text-2xl">Cargando datos del usuario...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header mejorado para móvil y desktop */}
      <div className="border-b bg-white px-2 py-4 sm:px-5 lg:px-8 lg:py-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* MOBILE: todo en una fila, nombre debajo del título */}
          {/* DESKTOP: dashboard info a la izquierda, contadores a la derecha */}
          <div className="flex w-full items-center justify-between sm:justify-start">
            {/* Botón hamburguesa para móvil */}
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
            {/* Info dashboard + nombre */}
            <div className="flex flex-1 flex-col items-center sm:ml-3 sm:items-start">
              <h1 className="text-center text-base font-bold text-gray-900 sm:text-left sm:text-2xl lg:text-3xl">
                Dashboard del Visitador
              </h1>
              <span className="mt-1 text-center text-xs text-gray-600 sm:text-left sm:text-base lg:text-base">
                {usuario.nombre} {usuario.apellido} - {usuario.rol_actual}
              </span>
            </div>
            {/* Contadores en mobile */}
            <div className="flex gap-2 sm:hidden">
              <div className="rounded-lg bg-blue-50 px-3 py-2 text-center">
                <div className="text-base font-semibold text-blue-600">
                  {activeTab === 'visitas'
                    ? visitasPendientes.length
                    : entregasPendientes.length}
                </div>
                <div className="text-xs text-gray-600">Pendientes</div>
              </div>
              <div className="rounded-lg bg-green-50 px-3 py-2 text-center">
                <div className="text-base font-semibold text-green-600">
                  {activeTab === 'visitas'
                    ? visitasRealizadas.length
                    : entregasRealizadas.length}
                </div>
                <div className="text-xs text-gray-600">
                  {activeTab === 'visitas' ? 'Realizadas' : 'Entregadas'}
                </div>
              </div>
            </div>
          </div>
          {/* Contadores en desktop */}
          <div className="hidden gap-6 sm:flex">
            <div className="rounded-lg bg-blue-50 px-4 py-2 text-center">
              <div className="text-lg font-semibold text-blue-600 lg:text-xl">
                {activeTab === 'visitas'
                  ? visitasPendientes.length
                  : entregasPendientes.length}
              </div>
              <div className="text-sm text-gray-600 lg:text-base">
                Pendientes
              </div>
            </div>
            <div className="rounded-lg bg-green-50 px-4 py-2 text-center">
              <div className="text-lg font-semibold text-green-600 lg:text-xl">
                {activeTab === 'visitas'
                  ? visitasRealizadas.length
                  : entregasRealizadas.length}
              </div>
              <div className="text-sm text-gray-600 lg:text-base">
                {activeTab === 'visitas' ? 'Realizadas' : 'Entregadas'}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar responsivo */}
        <div
          className={` ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-96 transform transition-transform duration-300 ease-in-out lg:relative lg:w-[28rem] lg:translate-x-0`}
        >
          <aside className="h-full w-full flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white">
            <TabNavigation
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />

            <div className="space-y-4 p-3 lg:space-y-6">
              {activeTab === 'visitas' ? (
                loadingVisitas ? (
                  <div className="flex h-64 items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600 lg:h-10 lg:w-10"></div>
                      <p className="text-sm text-gray-500 lg:text-base">
                        Cargando visitas...
                      </p>
                    </div>
                  </div>
                ) : errorVisitas ? (
                  <div className="flex h-64 items-center justify-center">
                    <div className="px-4 text-center sm:px-6">
                      <div className="mb-4 text-red-500">
                        <svg
                          className="mx-auto h-12 w-12 lg:h-16 lg:w-16"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                      </div>
                      <p className="mb-3 text-base font-medium text-red-600 lg:text-lg">
                        Error al cargar visitas
                      </p>
                      <p className="mb-6 text-sm text-gray-500 lg:text-base">
                        {errorVisitas}
                      </p>
                      <button
                        onClick={reloadVisitas}
                        className="rounded-md bg-blue-600 px-4 py-3 text-sm text-white transition-colors hover:bg-blue-700 lg:px-6 lg:text-base"
                      >
                        Reintentar
                      </button>
                    </div>
                  </div>
                ) : (
                  <SidebarVisitas
                    visitasPendientes={visitasPendientes}
                    visitasRealizadas={visitasRealizadas}
                    selectedVisita={selectedVisita}
                    onSelectVisita={handleSelectVisita}
                  />
                )
              ) : (
                <EntregasSidebar
                  entregasPendientes={entregasPendientes}
                  entregasRealizadas={entregasRealizadas}
                  selectedEntrega={selectedEntrega}
                  onSelectEntrega={handleSelectEntrega}
                  loadingEntregas={loadingEntregas}
                  errorEntregas={errorEntregas}
                  onRetry={handleRetryEntregas}
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
              <div className="flex h-full items-center justify-center text-center">
                <div className="px-4">
                  <UserIcon className="mx-auto mb-4 h-12 w-12 text-gray-300 lg:h-16 lg:w-16" />
                  <p className="mb-4 text-base text-gray-500 lg:text-lg">
                    Selecciona una visita para ver los detalles
                  </p>
                  {!loadingVisitas && (
                    <div className="flex justify-center gap-4 text-sm lg:gap-6 lg:text-base">
                      <div className="rounded-lg bg-blue-50 px-4 py-2 text-center">
                        <div className="text-lg font-semibold text-blue-600 lg:text-xl">
                          {visitasPendientes.length}
                        </div>
                        <div className="text-xs text-gray-600 lg:text-sm">
                          Pendientes
                        </div>
                      </div>
                      <div className="rounded-lg bg-green-50 px-4 py-2 text-center">
                        <div className="text-lg font-semibold text-green-600 lg:text-xl">
                          {visitasRealizadas.length}
                        </div>
                        <div className="text-xs text-gray-600 lg:text-sm">
                          Realizadas
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          ) : selectedEntrega ? (
            <EntregaDetails
              entrega={selectedEntrega}
              onFinalizarEntrega={() => {
                if (
                  selectedEntrega.entrega.estado === 'PENDIENTE' &&
                  selectedEntrega.rol_entrega === 'ENCARGADO'
                ) {
                  setShowEntregaModal(true)
                }
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-center">
              <div className="px-4">
                <Package className="mx-auto mb-4 h-12 w-12 text-gray-300 lg:h-16 lg:w-16" />
                <p className="mb-4 text-base text-gray-500 lg:text-lg">
                  Selecciona una entrega para ver los detalles
                </p>
                {!loadingEntregas && (
                  <div className="flex justify-center gap-4 text-sm lg:gap-6 lg:text-base">
                    <div className="rounded-lg bg-blue-50 px-4 py-2 text-center">
                      <div className="text-lg font-semibold text-blue-600 lg:text-xl">
                        {entregasPendientes.length}
                      </div>
                      <div className="text-xs text-gray-600 lg:text-sm">
                        Pendientes
                      </div>
                    </div>
                    <div className="rounded-lg bg-green-50 px-4 py-2 text-center">
                      <div className="text-lg font-semibold text-green-600 lg:text-xl">
                        {entregasRealizadas.length}
                      </div>
                      <div className="text-xs text-gray-600 lg:text-sm">
                        Entregadas
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal para visitas */}
      <ConfirmModal
        isOpen={showVisitaModal}
        title="Finalizar Visita"
        observaciones={observacionesVisita}
        onObservacionesChange={setObservacionesVisita}
        onConfirm={handleConfirmarFinalizacion}
        onCancelVisit={handleConfirmarCancelacion}
        onCancel={() => {
          if (!finalizandoVisita) {
            setShowVisitaModal(false)
            setObservacionesVisita('')
          }
        }}
        loading={finalizandoVisita}
      />

      {/* Modal para entregas */}
      <FinalizarEntregaModal
        isOpen={showEntregaModal}
        observaciones={observacionesEntrega}
        onObservacionesChange={setObservacionesEntrega}
        onConfirm={handleFinalizarEntrega}
        onCancelDelivery={handleCancelarEntrega}
        onCancel={() => {
          if (!finalizandoEntrega) {
            setShowEntregaModal(false)
            setObservacionesEntrega('')
          }
        }}
        entregaSeleccionada={selectedEntrega}
        loading={finalizandoEntrega}
      />
    </div>
  )
}
