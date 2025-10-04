'use client'

import { useState, useEffect } from 'react'
import type { EntregaEmpleado } from '@/types'
import entregasService from '@/services/entregas.service'
import { useAuth } from '@/context/AuthContext'
import EntregasSidebar from './EntregasSidebar'
import EntregaDetails from './EntregaDetails'
import FinalizarEntregaModal from './FinalizarEntregaModal'
import EmptyState from './EmptyState'
import { Menu, X } from 'lucide-react'

export default function PlantaDashboardClient() {
  const { usuario } = useAuth()
  const [selectedEntrega, setSelectedEntrega] =
    useState<EntregaEmpleado | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [observacionesFinal, setObservacionesFinal] = useState('')
  const [entregasPendientes, setEntregasPendientes] = useState<
    EntregaEmpleado[]
  >([])
  const [entregasRealizadas, setEntregasRealizadas] = useState<
    EntregaEmpleado[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [finalizandoEntrega, setFinalizandoEntrega] = useState(false)

  useEffect(() => {
    if (usuario?.cuil) {
      loadEntregas()
    }
  }, [usuario?.cuil])

  const loadEntregas = async () => {
    if (!usuario?.cuil) return

    try {
      setLoading(true)
      setError(null)

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
      setError('Error al cargar las entregas')
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = async () => {
    await loadEntregas()
  }

  const handleSelectEntrega = (entrega: EntregaEmpleado) => {
    setSelectedEntrega(entrega)
    setSidebarOpen(false) // Cerrar sidebar en móvil al seleccionar
  }

  const handleFinalizarEntrega = async () => {
    if (selectedEntrega && usuario?.cuil && !finalizandoEntrega) {
      try {
        setFinalizandoEntrega(true)

        // Llamar al servicio para actualizar en la base de datos
        await entregasService.finalizarEntrega(
          selectedEntrega.cod_entrega,
          observacionesFinal || undefined
        )

        // Actualizar el estado local después de la actualización exitosa
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

        // Mover de pendientes a realizadas
        setEntregasPendientes((prev) =>
          prev.filter((e) => e.cod_entrega !== selectedEntrega.cod_entrega)
        )
        setEntregasRealizadas((prev) => [...prev, entregaActualizada])

        // Cerrar modal
        setShowConfirmModal(false)
        setObservacionesFinal('')

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
                Dashboard de Entregas
              </h1>
              <p className="mt-1 text-sm text-gray-600 lg:text-base">
                {usuario.nombre} {usuario.apellido} - {usuario.rol_actual}
              </p>
            </div>
          </div>
          <div className="flex space-x-4 text-sm lg:space-x-6 lg:text-base">
            <div className="rounded-lg bg-blue-50 px-4 py-2 text-center">
              <div className="text-lg font-semibold text-blue-600 lg:text-xl">
                {entregasPendientes.length}
              </div>
              <div className="text-xs text-gray-600 lg:text-sm">Pendientes</div>
            </div>
            <div className="rounded-lg bg-green-50 px-4 py-2 text-center">
              <div className="text-lg font-semibold text-green-600 lg:text-xl">
                {entregasRealizadas.length}
              </div>
              <div className="text-xs text-gray-600 lg:text-sm">Entregadas</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar responsivo */}
        <div
          className={` ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-96 transform transition-transform duration-300 ease-in-out lg:relative lg:w-[28rem] lg:translate-x-0`}
        >
          <EntregasSidebar
            entregasPendientes={entregasPendientes}
            entregasRealizadas={entregasRealizadas}
            selectedEntrega={selectedEntrega}
            onSelectEntrega={handleSelectEntrega}
            loadingEntregas={loading}
            errorEntregas={error}
            onRetry={handleRetry}
          />
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
          {selectedEntrega ? (
            <EntregaDetails
              entrega={selectedEntrega}
              onFinalizarEntrega={() => setShowConfirmModal(true)}
            />
          ) : (
            <EmptyState
              message="Selecciona una entrega del panel lateral para ver los detalles"
              totalPendientes={entregasPendientes.length}
              totalRealizadas={entregasRealizadas.length}
            />
          )}
        </main>
      </div>

      <FinalizarEntregaModal
        isOpen={showConfirmModal}
        observaciones={observacionesFinal}
        onObservacionesChange={setObservacionesFinal}
        onConfirm={handleFinalizarEntrega}
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
