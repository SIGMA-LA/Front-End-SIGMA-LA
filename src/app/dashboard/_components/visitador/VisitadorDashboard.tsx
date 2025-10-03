'use client'

import { useState, useEffect } from 'react'
import type { Visita, EntregaEmpleado } from '@/types'
import { useGlobalContext } from '@/context/GlobalContext'
import { useAuth } from '@/context/AuthContext'
import entregasService from '@/services/entregas.service'
import { User as UserIcon, Package } from 'lucide-react'

// Componentes existentes
import TabNavigation from './TabNavigation'
import SidebarVisitas from './SidebarVisitas'
import SidebarEntregas from './SidebarEntregas'
import VisitaDetails from './VisitaDetails'
import EntregaDetails from './EntregaDetails'
import ConfirmModal from './ConfirmModal'

export default function VisitadorDashboard() {
  const { usuario } = useAuth()
  const { visitas, finalizarVisita } = useGlobalContext()

  // Tab activa
  const [activeTab, setActiveTab] = useState<'visitas' | 'entregas'>('visitas')

  // Estados para Visitas
  const [selectedVisita, setSelectedVisita] = useState<Visita | null>(null)
  const [showVisitaModal, setShowVisitaModal] = useState(false)
  const [observacionesVisita, setObservacionesVisita] = useState('')

  // Estados para Entregas (solo lectura)
  const [selectedEntrega, setSelectedEntrega] = useState<EntregaEmpleado | null>(null)
  const [entregasPendientes, setEntregasPendientes] = useState<EntregaEmpleado[]>([])
  const [entregasRealizadas, setEntregasRealizadas] = useState<EntregaEmpleado[]>([])
  const [loadingEntregas, setLoadingEntregas] = useState(true)
  const [errorEntregas, setErrorEntregas] = useState<string | null>(null)

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
          entregasService.getEntregasByEmpleadoAndEstado(usuario.cuil, 'PENDIENTE'),
          entregasService.getEntregasByEmpleadoAndEstado(usuario.cuil, 'ENTREGADO'),
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

  const handleFinalizarVisita = () => {
    if (selectedVisita) {
      finalizarVisita(selectedVisita.cod_visita, observacionesVisita)
      setShowVisitaModal(false)
      setSelectedVisita({ ...selectedVisita, estado: 'COMPLETADA' })
      setObservacionesVisita('')
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
    v.empleados_asignados?.some((emp) => emp.cuil === usuario.cuil)
  )

  const visitasPendientes = visitasAsignadas.filter(
    (v) => v.estado === 'PROGRAMADA'
  )
  const visitasRealizadas = visitasAsignadas.filter(
    (v) => v.estado === 'COMPLETADA'
  )

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
              <SidebarVisitas
                visitasPendientes={visitasPendientes}
                visitasRealizadas={visitasRealizadas}
                selectedVisita={selectedVisita}
                onSelectVisita={handleSelectVisita}
              />
            ) : (
              <SidebarEntregas
                entregasPendientes={entregasPendientes}
                entregasRealizadas={entregasRealizadas}
                selectedEntrega={selectedEntrega}
                onSelectEntrega={handleSelectEntrega}
                loadingEntregas={loadingEntregas}
                errorEntregas={errorEntregas}
                onRetry={() => {}}
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
                onFinalizarVisita={() => setShowVisitaModal(true)}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-center">
                <div>
                  <UserIcon className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                  <p className="mb-4 text-lg text-gray-500">
                    Selecciona una visita para ver los detalles
                  </p>
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
                </div>
              </div>
            )
          ) : selectedEntrega ? (
            <div className="space-y-4">
              {/* Banner informativo para entregas */}
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <Package className="mt-0.5 h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Solo lectura</p>
                    <p className="text-sm text-blue-700">
                      Como visitador, puedes ver las entregas pero no finalizarlas.
                      Las entregas solo pueden ser finalizadas por el personal de planta.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Usar EntregaDetails existente pero sin el onFinalizarEntrega */}
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