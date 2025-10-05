'use client'

import { useState, useEffect } from 'react'
import { FileText, Package, Menu, X } from 'lucide-react'
import type { Obra, OrdenProduccion } from '@/types'
import { useAuth } from '@/context/AuthContext'
import { getNotasConOrdenEnProceso, getNotasSinOrdenAprobada } from '@/services/obra.service'
import ordenProduccionService from '@/services/ordenProduccion.service'
import TabNavigation from './TabNavigation'
import SidebarNotasFabrica from './SidebarNotasFabrica'
import SidebarOrdenesProduccion from './SidebarOrdenesProduccion'
import NotaFabricaDetails from './NotaFabricaDetails'
import OrdenProduccionDetails from './OrdenProduccionDetails'
import CrearOrdenModal from './CrearOrdenModal'

export default function ProduccionDashboard() {
  const { usuario } = useAuth()

  // Tab activa
  const [activeTab, setActiveTab] = useState<'notas' | 'ordenes'>('notas')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Estados para Notas de Fábrica
  const [selectedObra, setSelectedObra] = useState<Obra | null>(null)
  const [obrasSinOrden, setObrasSinOrden] = useState<Obra[]>([])
  const [obrasEnProceso, setObrasEnProceso] = useState<Obra[]>([])
  const [loadingNotas, setLoadingNotas] = useState(true)
  const [errorNotas, setErrorNotas] = useState<string | null>(null)
  const [showCrearOrdenModal, setShowCrearOrdenModal] = useState(false)

  // Estados para Órdenes de Producción
  const [selectedOrden, setSelectedOrden] = useState<OrdenProduccion | null>(null)
  const [ordenesAprobadas, setOrdenesAprobadas] = useState<OrdenProduccion[]>([])
  const [ordenesEnProduccion, setOrdenesEnProduccion] = useState<OrdenProduccion[]>([])
  const [loadingOrdenes, setLoadingOrdenes] = useState(true)
  const [errorOrdenes, setErrorOrdenes] = useState<string | null>(null)

  // Cargar obras con nota de fábrica al montar el componente
  useEffect(() => {
    if (activeTab === 'notas') {
      loadObrasConNota()
    }
  }, [activeTab])

  // Cargar órdenes de producción al cambiar a la tab de órdenes
  useEffect(() => {
    if (activeTab === 'ordenes') {
      loadOrdenesProduccion()
    }
  }, [activeTab])

  const loadObrasConNota = async () => {
    try {
      setLoadingNotas(true)
      setErrorNotas(null)

      const [sinOrden, enProceso] = await Promise.all([
        getNotasSinOrdenAprobada(),
        getNotasConOrdenEnProceso(),
      ])

      setObrasSinOrden(sinOrden)
      setObrasEnProceso(enProceso)
    } catch (error) {
      console.error('Error al cargar obras con nota:', error)
      setErrorNotas('Error al cargar las obras con nota de fábrica')
    } finally {
      setLoadingNotas(false)
    }
  }

  const loadOrdenesProduccion = async () => {
    try {
      setLoadingOrdenes(true)
      setErrorOrdenes(null)

      const [aprobadas, enProduccion] = await Promise.all([
        ordenProduccionService.getOrdenesValidadas(),
        ordenProduccionService.getOrdenesEnProduccion(),
      ])

      setOrdenesAprobadas(aprobadas)
      setOrdenesEnProduccion(enProduccion)
    } catch (error) {
      console.error('Error al cargar órdenes:', error)
      setErrorOrdenes('Error al cargar las órdenes de producción')
    } finally {
      setLoadingOrdenes(false)
    }
  }

  const handleTabChange = (tab: 'notas' | 'ordenes') => {
    setActiveTab(tab)
    setSelectedObra(null)
    setSelectedOrden(null)
  }

  const handleSelectObra = (obra: Obra) => {
    setSelectedObra(obra)
    setSidebarOpen(false)
  }

  const handleSelectOrden = (orden: OrdenProduccion) => {
    setSelectedOrden(orden)
    setSidebarOpen(false)
  }

  const handleRetryNotas = async () => {
    await loadObrasConNota()
  }

  const handleRetryOrdenes = async () => {
    await loadOrdenesProduccion()
  }

  const handleCrearOrden = () => {
    setShowCrearOrdenModal(true)
  }

  const handleOrdenCreated = async () => {
    await loadObrasConNota()
    setSelectedObra(null)
  }

  const handleIniciarProduccion = async () => {
    if (!selectedOrden) return

    try {
      await ordenProduccionService.iniciarProduccion(selectedOrden.cod_op)
      
      await loadOrdenesProduccion()
      
      const ordenActualizada = {
        ...selectedOrden,
        estado: 'EN PRODUCCION' as const,
        obra: {
          ...selectedOrden.obra,
          estado: 'EN PRODUCCION' as const,
        },
      }
      setSelectedOrden(ordenActualizada)
    } catch (error) {
      console.error('Error al iniciar producción:', error)
      // TODO: Agregar notificación toast aquí
    }
  }

  const handleFinalizarProduccion = async () => {
    if (!selectedOrden) return

    try {
      await ordenProduccionService.finalizarProduccion(selectedOrden.cod_op)
      
      await loadOrdenesProduccion()
      
      setSelectedOrden(null)
    } catch (error) {
      console.error('Error al finalizar producción:', error)
      // TODO: Agregar notificación toast aquí
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
      {/* Header mejorado para móvil */}
      <div className="border-b bg-white px-5 py-5 lg:px-8 lg:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Botón hamburguesa para móvil */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
            >
              {sidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
                Dashboard de Producción
              </h1>
              <p className="mt-1 text-sm text-gray-600 lg:text-base">
                {usuario.nombre} {usuario.apellido} - {usuario.rol_actual}
              </p>
            </div>
          </div>
          <div className="flex space-x-4 text-sm lg:space-x-6 lg:text-base">
            <div className="rounded-lg bg-orange-50 px-4 py-2 text-center">
              <div className="text-lg font-semibold text-orange-600 lg:text-xl">
                {activeTab === 'notas' ? obrasSinOrden.length : ordenesAprobadas.length}
              </div>
              <div className="text-xs text-gray-600 lg:text-sm">
                {activeTab === 'notas' ? 'Sin Orden' : 'Por Iniciar'}
              </div>
            </div>
            <div className="rounded-lg bg-green-50 px-4 py-2 text-center">
              <div className="text-lg font-semibold text-green-600 lg:text-xl">
                {activeTab === 'notas' ? obrasEnProceso.length : ordenesEnProduccion.length}
              </div>
              <div className="text-xs text-gray-600 lg:text-sm">
                {activeTab === 'notas' ? 'En Proceso' : 'En Producción'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar responsivo */}
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
              {activeTab === 'notas' ? (
                <SidebarNotasFabrica
                  obrasSinOrden={obrasSinOrden}
                  obrasEnProceso={obrasEnProceso}
                  selectedObra={selectedObra}
                  onSelectObra={handleSelectObra}
                  loading={loadingNotas}
                  error={errorNotas}
                />
              ) : (
                <SidebarOrdenesProduccion
                  ordenesAprobadas={ordenesAprobadas}
                  ordenesEnProduccion={ordenesEnProduccion}
                  selectedOrden={selectedOrden}
                  onSelectOrden={handleSelectOrden}
                  loading={loadingOrdenes}
                  error={errorOrdenes}
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
          {activeTab === 'notas' ? (
            selectedObra ? (
              <NotaFabricaDetails
                obra={selectedObra}
                onCrearOrden={handleCrearOrden}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-center">
                <div className="px-4">
                  <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300 lg:h-16 lg:w-16" />
                  <p className="mb-4 text-base text-gray-500 lg:text-lg">
                    Selecciona una nota de fábrica para ver los detalles
                  </p>
                  {!loadingNotas && (
                    <div className="flex justify-center gap-4 text-sm lg:gap-6 lg:text-base">
                      <div className="rounded-lg bg-orange-50 px-4 py-2 text-center">
                        <div className="text-lg font-semibold text-orange-600 lg:text-xl">
                          {obrasSinOrden.length}
                        </div>
                        <div className="text-xs text-gray-600 lg:text-sm">
                          Sin Orden
                        </div>
                      </div>
                      <div className="rounded-lg bg-green-50 px-4 py-2 text-center">
                        <div className="text-lg font-semibold text-green-600 lg:text-xl">
                          {obrasEnProceso.length}
                        </div>
                        <div className="text-xs text-gray-600 lg:text-sm">
                          En Proceso
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          ) : selectedOrden ? (
            <OrdenProduccionDetails
              orden={selectedOrden}
              onIniciarProduccion={
                selectedOrden.estado === 'APROBADA'
                  ? handleIniciarProduccion
                  : undefined
              }
              onFinalizarProduccion={
                selectedOrden.estado === 'EN PRODUCCION'
                  ? handleFinalizarProduccion
                  : undefined
              }
            />
          ) : (
            <div className="flex h-full items-center justify-center text-center">
              <div className="px-4">
                <Package className="mx-auto mb-4 h-12 w-12 text-gray-300 lg:h-16 lg:w-16" />
                <p className="mb-4 text-base text-gray-500 lg:text-lg">
                  Selecciona una orden de producción para ver los detalles
                </p>
                {!loadingOrdenes && (
                  <div className="flex justify-center gap-4 text-sm lg:gap-6 lg:text-base">
                    <div className="rounded-lg bg-blue-50 px-4 py-2 text-center">
                      <div className="text-lg font-semibold text-blue-600 lg:text-xl">
                        {ordenesAprobadas.length}
                      </div>
                      <div className="text-xs text-gray-600 lg:text-sm">
                        Por Iniciar
                      </div>
                    </div>
                    <div className="rounded-lg bg-green-50 px-4 py-2 text-center">
                      <div className="text-lg font-semibold text-green-600 lg:text-xl">
                        {ordenesEnProduccion.length}
                      </div>
                      <div className="text-xs text-gray-600 lg:text-sm">
                        En Producción
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal para crear orden de producción */}
      <CrearOrdenModal
        isOpen={showCrearOrdenModal}
        onClose={() => setShowCrearOrdenModal(false)}
        obraCodigo={selectedObra?.cod_obra}
        onSuccess={handleOrdenCreated}
      />
    </div>
  )
}