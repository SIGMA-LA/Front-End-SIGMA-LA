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

  useEffect(() => {
    const loadEntregas = async () => {
      if (!usuario?.cuil) {
        return
      }
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

    loadEntregas()
  }, [usuario?.cuil])

  const handleFinalizarEntrega = async () => {
    if (selectedEntrega && usuario?.cuil) {
      try {
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

        setEntregasPendientes((prev) =>
          prev.filter((e) => e.cod_entrega !== selectedEntrega.cod_entrega)
        )
        setEntregasRealizadas((prev) => [...prev, entregaActualizada])

        setShowConfirmModal(false)
        setObservacionesFinal('')

        // TODO: Implementar llamada al backend para actualizar el estado
      } catch (error) {
        console.error('Error al finalizar entrega:', error)
        alert('Error al finalizar la entrega')
      }
    }
  }
  const handleRetry = async () => {
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

  const handleSelectEntrega = (entrega: EntregaEmpleado) => {
    setSelectedEntrega(entrega)
    setSidebarOpen(false) // Cerrar sidebar en móvil al seleccionar
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
      {/* Header mejorado para móvil */}
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
                Dashboard de Entregas
              </h1>
              <p className="text-xs text-gray-600 lg:text-sm">
                {usuario.nombre} {usuario.apellido} - {usuario.rol_actual}
              </p>
            </div>
          </div>
          <div className="flex space-x-2 text-xs lg:space-x-4 lg:text-sm">
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

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar responsivo */}
        <div
          className={` ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out lg:relative lg:w-96 lg:translate-x-0`}
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
        <main className="flex-1 overflow-y-auto bg-gray-100 p-3 lg:p-6">
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
          setShowConfirmModal(false)
          setObservacionesFinal('')
        }}
        entregaSeleccionada={selectedEntrega}
      />
    </div>
  )
}
