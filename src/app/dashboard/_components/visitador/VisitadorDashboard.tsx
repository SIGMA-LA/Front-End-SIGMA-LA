'use client'

import { useState, useEffect } from 'react'
import type { Visita, EntregaEmpleado } from '@/types'
import { useGlobalContext } from '@/context/GlobalContext'
import { useAuth } from '@/context/AuthContext'
import entregasService from '@/services/entregas.service'
import visitasService from '@/services/visitas.service'
import { User as UserIcon, Package, Menu, X } from 'lucide-react'

// Componentes existentes
import TabNavigation from './TabNavigation'
import SidebarVisitas from './SidebarVisitas'
import VisitaDetails from './VisitaDetails'
import EntregaDetails from '../planta/EntregaDetails'
import ConfirmModal from './ConfirmModal'
import EntregasSidebar from '../planta/EntregasSidebar'
import FinalizarEntregaModal from '../planta/FinalizarEntregaModal'

export default function VisitadorDashboard() {
  const { usuario } = useAuth()
  const { finalizarVisita: finalizarVisitaContext } = useGlobalContext()

  // Tab activa
  const [activeTab, setActiveTab] = useState<'visitas' | 'entregas'>('visitas')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Estados para Visitas
  const [selectedVisita, setSelectedVisita] = useState<Visita | null>(null)
  const [showVisitaModal, setShowVisitaModal] = useState(false)
  const [observacionesVisita, setObservacionesVisita] = useState('')
  const [visitasPendientes, setVisitasPendientes] = useState<Visita[]>([])
  const [visitasRealizadas, setVisitasRealizadas] = useState<Visita[]>([])
  const [loadingVisitas, setLoadingVisitas] = useState(true)
  const [errorVisitas, setErrorVisitas] = useState<string | null>(null)
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

  // Cargar visitas al montar el componente
  useEffect(() => {
    if (usuario?.cuil && activeTab === 'visitas') {
      loadVisitas()
    }
  }, [usuario?.cuil, activeTab])

  // Cargar entregas al cambiar a la tab de entregas
  useEffect(() => {
    if (usuario?.cuil && activeTab === 'entregas') {
      loadEntregas()
    }
  }, [usuario?.cuil, activeTab])

  const loadVisitas = async () => {
    if (!usuario?.cuil) return

    try {
      setLoadingVisitas(true)
      setErrorVisitas(null)

      const [pendientes, completadas] = await Promise.all([
        visitasService.getVisitasByEmpleadoAndEstado(
          usuario.cuil,
          'PROGRAMADA'
        ),
        visitasService.getVisitasByEmpleadoAndEstado(
          usuario.cuil,
          'COMPLETADA'
        ),
      ])

      setVisitasPendientes(pendientes)
      setVisitasRealizadas(completadas)
    } catch (error) {
      console.error('Error al cargar visitas:', error)
      setErrorVisitas('Error al cargar las visitas')
    } finally {
      setLoadingVisitas(false)
    }
  }

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

  const handleRetryVisitas = async () => {
    await loadVisitas()
  }

  const handleRetryEntregas = async () => {
    await loadEntregas()
  }

  const handleFinalizarVisita = async () => {
    if (selectedVisita && usuario?.cuil && !finalizandoVisita) {
      try {
        setFinalizandoVisita(true)

        // Llamar al contexto global para finalizar la visita
        await finalizarVisitaContext(
          selectedVisita.cod_visita,
          observacionesVisita
        )

        // Actualizar el estado local
        const visitaActualizada = {
          ...selectedVisita,
          estado: 'COMPLETADA' as const,
          observaciones: observacionesVisita || selectedVisita.observaciones,
        }

        setSelectedVisita(visitaActualizada)

        // Mover de pendientes a realizadas
        setVisitasPendientes((prev) =>
          prev.filter((v) => v.cod_visita !== selectedVisita.cod_visita)
        )
        setVisitasRealizadas((prev) => [...prev, visitaActualizada])

        // Cerrar modal
        setShowVisitaModal(false)
        setObservacionesVisita('')

        console.log('Visita finalizada exitosamente')
      } catch (error) {
        console.error('Error al finalizar visita:', error)
        alert('Error al finalizar la visita. Inténtalo de nuevo.')
      } finally {
        setFinalizandoVisita(false)
      }
    }
  }

  const handleFinalizarEntrega = async () => {
    if (selectedEntrega && usuario?.cuil && !finalizandoEntrega) {
      try {
        setFinalizandoEntrega(true)

        // Llamar al servicio para actualizar en la base de datos
        await entregasService.finalizarEntrega(
          selectedEntrega.cod_entrega,
          observacionesEntrega || undefined
        )

        // Actualizar el estado local después de la actualización exitosa
        const entregaActualizada = {
          ...selectedEntrega,
          entrega: {
            ...selectedEntrega.entrega,
            estado: 'ENTREGADO' as const,
            observaciones:
              observacionesEntrega || selectedEntrega.entrega.observaciones,
          },
        }

        setSelectedEntrega(entregaActualizada)

        // Mover de pendientes a realizadas
        setEntregasPendientes((prev) =>
          prev.filter((e) => e.cod_entrega !== selectedEntrega.cod_entrega)
        )
        setEntregasRealizadas((prev) => [...prev, entregaActualizada])

        // Cerrar modal
        setShowEntregaModal(false)
        setObservacionesEntrega('')

        console.log('Entrega finalizada exitosamente')
      } catch (error) {
        console.error('Error al finalizar entrega:', error)
        alert('Error al finalizar la entrega. Inténtalo de nuevo.')
      } finally {
        setFinalizandoEntrega(false)
      }
    }
  }

  if (!usuario) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Cargando datos del usuario...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header responsivo */}
      <div className="border-b bg-white px-4 py-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Botón hamburguesa para móvil */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 text-gray-600 hover:text-gray-900 lg:hidden"
            >
              {sidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 lg:text-2xl">
                Dashboard del Visitador
              </h1>
              <p className="text-xs text-gray-600 lg:text-sm">
                {usuario.nombre} {usuario.apellido} - {usuario.rol_actual}
              </p>
            </div>
          </div>
          <div className="flex space-x-2 text-xs lg:space-x-4 lg:text-sm">
            <div className="text-center">
              <div className="font-semibold text-blue-600">
                {activeTab === 'visitas'
                  ? visitasPendientes.length
                  : entregasPendientes.length}
              </div>
              <div className="text-gray-500">Pendientes</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-600">
                {activeTab === 'visitas'
                  ? visitasRealizadas.length
                  : entregasRealizadas.length}
              </div>
              <div className="text-gray-500">
                {activeTab === 'visitas' ? 'Realizadas' : 'Entregadas'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar responsivo */}
        <div
          className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out lg:relative lg:w-96 lg:translate-x-0`}
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
                      <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600 lg:h-8 lg:w-8"></div>
                      <p className="text-xs text-gray-500 lg:text-sm">
                        Cargando visitas...
                      </p>
                    </div>
                  </div>
                ) : errorVisitas ? (
                  <div className="flex h-64 items-center justify-center">
                    <div className="px-4 text-center">
                      <div className="mb-2 text-red-500">
                        <svg
                          className="mx-auto h-10 w-10 lg:h-12 lg:w-12"
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
                      <p className="mb-2 text-sm font-medium text-red-600 lg:text-base">
                        Error al cargar visitas
                      </p>
                      <p className="mb-4 text-xs text-gray-500 lg:text-sm">
                        {errorVisitas}
                      </p>
                      <button
                        onClick={handleRetryVisitas}
                        className="rounded-md bg-blue-600 px-3 py-2 text-xs text-white transition-colors hover:bg-blue-700 lg:px-4 lg:text-sm"
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
            className="bg-opacity-50 fixed inset-0 z-40 bg-black lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Contenido principal */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-3 lg:p-6">
          {activeTab === 'visitas' ? (
            selectedVisita ? (
              <VisitaDetails
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
                    <div className="flex justify-center gap-3 text-xs lg:gap-4 lg:text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-blue-600">
                          {visitasPendientes.length}
                        </div>
                        <div className="text-gray-500">Pendientes</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-green-600">
                          {visitasRealizadas.length}
                        </div>
                        <div className="text-gray-500">Realizadas</div>
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
                  <div className="flex justify-center gap-3 text-xs lg:gap-4 lg:text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">
                        {entregasPendientes.length}
                      </div>
                      <div className="text-gray-500">Pendientes</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600">
                        {entregasRealizadas.length}
                      </div>
                      <div className="text-gray-500">Entregadas</div>
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
        onConfirm={handleFinalizarVisita}
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
