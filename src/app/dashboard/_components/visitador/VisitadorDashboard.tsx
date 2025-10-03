'use client'

import { useState, useEffect } from 'react'
import type { Visita, EntregaEmpleado } from '@/types'
import { useGlobalContext } from '@/context/GlobalContext'
import { useAuth } from '@/context/AuthContext'
import { entregasService } from '@/services/entregas.service'

// Componentes
import TabNavigation from './TabNavigation'
import SidebarVisitas from './SidebarVisitas'
import SidebarEntregas from './SidebarEntregas'
import VisitaDetails from './VisitaDetails'
import EntregaDetails from './EntregaDetails'
import EmptyState from './EmptyState'
import ConfirmModal from './ConfirmModal'

export default function VisitadorDashboard() {
  const { usuario } = useAuth()
  const [selectedVisita, setSelectedVisita] = useState<Visita | null>(null)
  const [selectedEntrega, setSelectedEntrega] =
    useState<EntregaEmpleado | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [observacionesFinal, setObservacionesFinal] = useState('')
  const [activeTab, setActiveTab] = useState<'visitas' | 'entregas'>('visitas')

  // Estados para entregas cargadas desde la API - CAMBIADO A EntregaEmpleado[]
  const [entregasPendientesAPI, setEntregasPendientesAPI] = useState<
    EntregaEmpleado[]
  >([])
  const [entregasEntregadasAPI, setEntregasEntregadasAPI] = useState<
    EntregaEmpleado[]
  >([])
  const [loadingEntregas, setLoadingEntregas] = useState(false)
  const [errorEntregas, setErrorEntregas] = useState<string | null>(null)

  const { visitas, finalizarVisita } = useGlobalContext()

  // Función para cargar entregas desde la API
  const cargarEntregasDesdeAPI = async () => {
    if (!usuario?.cuil) return

    setLoadingEntregas(true)
    setErrorEntregas(null)

    try {
      const [pendientes, entregadas] = await Promise.all([
        entregasService.getEntregasPendientes(usuario.cuil),
        entregasService.getEntregasEntregadas(usuario.cuil),
      ])

      setEntregasPendientesAPI(pendientes)
      setEntregasEntregadasAPI(entregadas)
    } catch (error) {
      console.error('Error al cargar entregas desde la API:', error)
      setErrorEntregas('Error al cargar las entregas')
    } finally {
      setLoadingEntregas(false)
    }
  }

  useEffect(() => {
    if (usuario?.cuil) {
      cargarEntregasDesdeAPI()
    }
  }, [usuario?.cuil])

  const handleTabChange = (tab: 'visitas' | 'entregas') => {
    setActiveTab(tab)
    setSelectedVisita(null)
    setSelectedEntrega(null)
  }

  const handleFinalizarVisita = () => {
    if (selectedVisita) {
      finalizarVisita(selectedVisita.cod_visita, observacionesFinal)
      setShowConfirmModal(false)
      setSelectedVisita({ ...selectedVisita, estado: 'COMPLETADA' })
      setObservacionesFinal('')
    }
  }

  const handleFinalizarEntrega = async () => {
    if (selectedEntrega && usuario?.cuil) {
      try {
        // Actualizar la entrega localmente
        const entregaActualizada = {
          ...selectedEntrega,
          entrega: {
            ...selectedEntrega.entrega,
            estado: 'ENTREGADO' as const,
            observaciones:
              observacionesFinal || selectedEntrega.entrega.observaciones,
          },
        }

        setSelectedEntrega(entregaActualizada)

        // Mover de pendientes a entregadas
        setEntregasPendientesAPI((prev) =>
          prev.filter((e) => e.cod_entrega !== selectedEntrega.cod_entrega)
        )
        setEntregasEntregadasAPI((prev) => [...prev, entregaActualizada])

        setShowConfirmModal(false)
        setObservacionesFinal('')

        // TODO: Implementar llamada al backend para actualizar el estado
      } catch (error) {
        console.error('Error al finalizar entrega:', error)
        setErrorEntregas('Error al finalizar la entrega')
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

  // Filtrar visitas asignadas al usuario
  const visitasAsignadas = visitas.filter((v) =>
    v.empleados_asignados.some((emp) => emp.cuil === usuario.cuil)
  )

  const visitasPendientes = visitasAsignadas.filter(
    (v) => v.estado === 'PROGRAMADA'
  )
  const visitasRealizadas = visitasAsignadas.filter(
    (v) => v.estado === 'COMPLETADA'
  )

  return (
    <div className="flex h-screen flex-col">
      {/* Header con información del usuario */}
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
                  : entregasPendientesAPI.length}
              </div>
              <div className="text-gray-500">Pendientes</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-600">
                {activeTab === 'visitas'
                  ? visitasRealizadas.length
                  : entregasEntregadasAPI.length}
              </div>
              <div className="text-gray-500">
                {activeTab === 'visitas' ? 'Realizadas' : 'Entregadas'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex flex-1 overflow-hidden"
        style={{ height: 'calc(100vh - 80px)' }}
      >
        <aside className="w-96 flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white">
          <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

          <div className="space-y-6 p-3">
            {activeTab === 'visitas' ? (
              <SidebarVisitas
                visitasPendientes={visitasPendientes}
                visitasRealizadas={visitasRealizadas}
                selectedVisita={selectedVisita}
                onSelectVisita={setSelectedVisita}
              />
            ) : (
              <SidebarEntregas
                entregasPendientes={entregasPendientesAPI}
                entregasRealizadas={entregasEntregadasAPI}
                selectedEntrega={selectedEntrega}
                onSelectEntrega={setSelectedEntrega}
                loadingEntregas={loadingEntregas}
                errorEntregas={errorEntregas}
                onRetry={cargarEntregasDesdeAPI}
              />
            )}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          {selectedVisita ? (
            <VisitaDetails
              visita={selectedVisita}
              onFinalizarVisita={() => setShowConfirmModal(true)}
            />
          ) : selectedEntrega ? (
            <EntregaDetails
              entrega={selectedEntrega}
              onFinalizarEntrega={() => setShowConfirmModal(true)}
            />
          ) : (
            <EmptyState type={activeTab} />
          )}
        </main>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        title={selectedVisita ? 'Finalizar Visita' : 'Finalizar Entrega'}
        observaciones={observacionesFinal}
        onObservacionesChange={setObservacionesFinal}
        onConfirm={
          selectedVisita ? handleFinalizarVisita : handleFinalizarEntrega
        }
        onCancel={() => {
          setShowConfirmModal(false)
          setObservacionesFinal('')
        }}
      />
    </div>
  )
}
