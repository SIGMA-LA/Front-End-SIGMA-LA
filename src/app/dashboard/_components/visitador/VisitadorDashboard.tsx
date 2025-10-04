'use client'

import { useState, useEffect } from 'react'
import type { Visita, EntregaEmpleado } from '@/types'
import { useGlobalContext } from '@/context/GlobalContext'
import { useAuth } from '@/context/AuthContext'
import entregasService from '@/services/entregas.service'
import visitasService from '@/services/visitas.service'
import { User as UserIcon, Package } from 'lucide-react'

// Componentes existentes
import TabNavigation from './TabNavigation'
import SidebarVisitas from './SidebarVisitas'
import VisitaDetails from './VisitaDetails'
import EntregaDetails from '../planta/EntregaDetails'
import ConfirmModal from './ConfirmModal'
import EntregasSidebar from '../planta/EntregasSidebar'

export default function VisitadorDashboard() {
  const { usuario } = useAuth()
  const { finalizarVisita: finalizarVisitaContext } = useGlobalContext()

  // Tab activa
  const [activeTab, setActiveTab] = useState<'visitas' | 'entregas'>('visitas')

  // Estados para Visitas
  const [selectedVisita, setSelectedVisita] = useState<Visita | null>(null)
  const [showVisitaModal, setShowVisitaModal] = useState(false)
  const [observacionesVisita, setObservacionesVisita] = useState('')
  const [visitasPendientes, setVisitasPendientes] = useState<Visita[]>([])
  const [visitasRealizadas, setVisitasRealizadas] = useState<Visita[]>([])
  const [loadingVisitas, setLoadingVisitas] = useState(true)
  const [errorVisitas, setErrorVisitas] = useState<string | null>(null)

  // Estados para Entregas
  const [selectedEntrega, setSelectedEntrega] =
    useState<EntregaEmpleado | null>(null)
  const [entregasPendientes, setEntregasPendientes] = useState<
    EntregaEmpleado[]
  >([])
  const [entregasRealizadas, setEntregasRealizadas] = useState<
    EntregaEmpleado[]
  >([])
  const [loadingEntregas, setLoadingEntregas] = useState(true)
  const [errorEntregas, setErrorEntregas] = useState<string | null>(null)

  // Cargar visitas desde la API
  useEffect(() => {
    const loadVisitas = async () => {
      if (!usuario?.cuil) {
        return
      }
      try {
        setLoadingVisitas(true)
        setErrorVisitas(null)

        // Cargar visitas programadas y en curso como pendientes
        const [programadas, enCurso, realizadas] = await Promise.all([
          visitasService.getVisitasByEmpleadoAndEstado(
            usuario.cuil,
            'PROGRAMADA'
          ),
          visitasService.getVisitasByEmpleadoAndEstado(
            usuario.cuil,
            'EN CURSO'
          ),
          visitasService.getVisitasByEmpleadoAndEstado(
            usuario.cuil,
            'COMPLETADA'
          ),
        ])

        // Combinar programadas y en curso como pendientes
        setVisitasPendientes([...programadas, ...enCurso])
        setVisitasRealizadas(realizadas)
      } catch (err) {
        console.error('Error al cargar visitas:', err)
        setErrorVisitas('Error al cargar las visitas')
      } finally {
        setLoadingVisitas(false)
      }
    }

    loadVisitas()
  }, [usuario?.cuil])

  // Cargar entregas desde la API
  useEffect(() => {
    const loadEntregas = async () => {
      if (!usuario?.cuil) {
        return
      }
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
      } catch (err) {
        console.error('Error al cargar entregas:', err)
        setErrorEntregas('Error al cargar las entregas')
      } finally {
        setLoadingEntregas(false)
      }
    }

    loadEntregas()
  }, [usuario?.cuil])

  // Handlers
  const handleTabChange = (tab: 'visitas' | 'entregas') => {
    setActiveTab(tab)
    setSelectedVisita(null)
    setSelectedEntrega(null)
  }

  const handleSelectVisita = (visita: Visita) => {
    setSelectedVisita(visita)
  }

  const handleSelectEntrega = (entrega: EntregaEmpleado) => {
    setSelectedEntrega(entrega)
  }

  const handleFinalizarVisita = async () => {
    if (!selectedVisita) return

    try {
      // Llamar al servicio para finalizar la visita
      const visitaActualizada = await visitasService.finalizarVisita(
        selectedVisita.cod_visita,
        observacionesVisita
      )

      // Actualizar el estado local
      setVisitasPendientes((prev) =>
        prev.filter((v) => v.cod_visita !== selectedVisita.cod_visita)
      )
      setVisitasRealizadas((prev) => [visitaActualizada, ...prev])

      // Si existe el contexto global, también actualizarlo
      if (finalizarVisitaContext) {
        finalizarVisitaContext(
          selectedVisita.cod_visita,
          observacionesVisita
        )
      }

      // Actualizar la visita seleccionada
      setSelectedVisita(visitaActualizada)

      // Cerrar el modal y limpiar observaciones
      setShowVisitaModal(false)
      setObservacionesVisita('')
    } catch (error) {
      console.error('Error al finalizar visita:', error)
      alert('Error al finalizar la visita. Por favor, intenta nuevamente.')
    }
  }

  const handleRetryVisitas = () => {
    // Recargar visitas
    if (usuario?.cuil) {
      setLoadingVisitas(true)
      Promise.all([
        visitasService.getVisitasByEmpleadoAndEstado(usuario.cuil, 'PROGRAMADA'),
        visitasService.getVisitasByEmpleadoAndEstado(usuario.cuil, 'EN CURSO'),
        visitasService.getVisitasByEmpleadoAndEstado(usuario.cuil, 'COMPLETADA'),
      ])
        .then(([programadas, enCurso, realizadas]) => {
          setVisitasPendientes([...programadas, ...enCurso])
          setVisitasRealizadas(realizadas)
          setErrorVisitas(null)
        })
        .catch((err) => {
          console.error('Error al recargar visitas:', err)
          setErrorVisitas('Error al cargar las visitas')
        })
        .finally(() => {
          setLoadingVisitas(false)
        })
    }
  }

  const handleRetryEntregas = () => {
    // Recargar entregas
    if (usuario?.cuil) {
      setLoadingEntregas(true)
      entregasService
        .getEntregasByEmpleadoAndEstado(usuario.cuil, 'PENDIENTE')
        .then((pendientes) => {
          setEntregasPendientes(pendientes)
          return entregasService.getEntregasByEmpleadoAndEstado(
            usuario.cuil,
            'ENTREGADO'
          )
        })
        .then((entregadas) => {
          setEntregasRealizadas(entregadas)
          setErrorEntregas(null)
        })
        .catch((err) => {
          console.error('Error al recargar entregas:', err)
          setErrorEntregas('Error al cargar las entregas')
        })
        .finally(() => {
          setLoadingEntregas(false)
        })
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
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard del Visitador
            </h1>
            <p className="text-sm text-gray-600">
              {usuario.nombre} {usuario.apellido} - {usuario.rol_actual}
            </p>
          </div>
          <div className="flex space-x-4 text-sm">
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

      {/* Contenido Principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-96 flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white">
          <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

          <div className="space-y-6 p-3">
            {activeTab === 'visitas' ? (
              loadingVisitas ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-sm text-gray-500">
                    Cargando visitas...
                  </div>
                </div>
              ) : errorVisitas ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="mb-2 text-sm text-red-600">{errorVisitas}</p>
                  <button
                    onClick={handleRetryVisitas}
                    className="text-sm font-medium text-red-700 hover:text-red-800"
                  >
                    Reintentar
                  </button>
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

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          {activeTab === 'visitas' ? (
            selectedVisita ? (
              <VisitaDetails
                visita={selectedVisita}
                onFinalizarVisita={() => {
                  // Solo mostrar modal si la visita está PROGRAMADA o EN CURSO
                  if (selectedVisita.estado === 'PROGRAMADA' || selectedVisita.estado === 'EN CURSO') {
                    setShowVisitaModal(true)
                  }
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-center">
                <div>
                  <UserIcon className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                  <p className="mb-4 text-lg text-gray-500">
                    Selecciona una visita para ver los detalles
                  </p>
                  {!loadingVisitas && (
                    <div className="flex justify-center gap-4 text-sm">
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
            <div className="space-y-4">
              <EntregaDetails
                entrega={selectedEntrega}
                onFinalizarEntrega={() => {}}
              />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <Package className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                <p className="mb-4 text-lg text-gray-500">
                  Selecciona una entrega para ver los detalles
                </p>
                {!loadingEntregas && (
                  <div className="flex justify-center gap-4 text-sm">
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

      {/* Modal solo para visitas */}
      <ConfirmModal
        isOpen={showVisitaModal}
        title="Finalizar Visita"
        observaciones={observacionesVisita}
        onObservacionesChange={setObservacionesVisita}
        onConfirm={handleFinalizarVisita}
        onCancel={() => {
          setShowVisitaModal(false)
          setObservacionesVisita('')
        }}
      />
    </div>
  )
}