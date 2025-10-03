'use client'

import { useState, useEffect } from 'react'
import type { Visita, Entrega } from '@/types'
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
  const [selectedEntrega, setSelectedEntrega] = useState<Entrega | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [observacionesFinal, setObservacionesFinal] = useState('')
  const [activeTab, setActiveTab] = useState<'visitas' | 'entregas'>('visitas')

  // Estados para entregas cargadas desde la API
  const [entregasPendientesAPI, setEntregasPendientesAPI] = useState<Entrega[]>(
    []
  )
  const [entregasEntregadasAPI, setEntregasEntregadasAPI] = useState<Entrega[]>(
    []
  )
  const [loadingEntregas, setLoadingEntregas] = useState(false)
  const [errorEntregas, setErrorEntregas] = useState<string | null>(null)

  const { visitas, entregas, finalizarVisita, finalizarEntrega } =
    useGlobalContext()

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
      finalizarVisita(selectedVisita.id, observacionesFinal)
      setShowConfirmModal(false)
      setSelectedVisita({ ...selectedVisita, estado: 'completada' })
      setObservacionesFinal('')
    }
  }

  const handleFinalizarEntrega = async () => {
    if (selectedEntrega) {
      try {
        await entregasService.finalizarEntrega(
          selectedEntrega.id,
          observacionesFinal
        )
        finalizarEntrega(selectedEntrega.id, observacionesFinal)

        const entregaFinalizada = {
          ...selectedEntrega,
          estado: 'ENTREGADA' as const,
        }
        setSelectedEntrega(entregaFinalizada)

        await cargarEntregasDesdeAPI()

        setShowConfirmModal(false)
        setObservacionesFinal('')
      } catch (error) {
        console.error('Error al finalizar entrega:', error)
        setErrorEntregas('Error al finalizar la entrega')
      }
    }
  }

  if (!usuario) {
    return <div>Cargando datos del usuario...</div>
  }

  const visitasAsignadas = visitas.filter(
    (v) => v.visitadorAsignado === `${usuario.nombre} ${usuario.apellido}`
  )
  const visitasPendientes = visitasAsignadas.filter(
    (v) => v.estado === 'programada'
  )
  const visitasRealizadas = visitasAsignadas.filter(
    (v) => v.estado === 'completada'
  )

  const entregasAsignadas =
    entregasPendientesAPI.length > 0 || entregasEntregadasAPI.length > 0
      ? [...entregasPendientesAPI, ...entregasEntregadasAPI]
      : entregas.filter(
          (e) => e.encargadoAsignado === `${usuario.nombre} ${usuario.apellido}`
        )

  const entregasPendientes =
    entregasPendientesAPI.length > 0
      ? entregasPendientesAPI
      : entregasAsignadas.filter(
          (e) => e.estado === 'PENDIENTE' || e.estado === 'EN CURSO'
        )

  const entregasRealizadas =
    entregasEntregadasAPI.length > 0
      ? entregasEntregadasAPI
      : entregasAsignadas.filter((e) => e.estado === 'ENTREGADA')

  return (
    <div className="flex h-screen flex-col">
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
                entregasPendientes={entregasPendientes}
                entregasRealizadas={entregasRealizadas}
                selectedEntrega={selectedEntrega}
                onSelectEntrega={setSelectedEntrega}
                loadingEntregas={loadingEntregas}
                errorEntregas={errorEntregas}
                onRetry={cargarEntregasDesdeAPI}
              />
            )}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-6">
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
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  )
}
