'use client'

import { useState, useEffect } from 'react'
import type { EntregaEmpleado } from '@/types'
import entregasService from '@/services/entregas.service'
import { useAuth } from '@/context/AuthContext'
import EntregasSidebar from '@/components/planta/EntregasSidebar'
import EntregaDetails from '@/components/planta/EntregaDetails'
import FinalizarEntregaModal from '@/components/planta/FinalizarEntregaModal'
import EmptyState from '@/components/planta/EmptyState'
import { Menu, X } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'

export default function Page() {
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
    setSidebarOpen(false)
  }

  const handleFinalizarEntrega = async () => {
    if (selectedEntrega && usuario?.cuil && !finalizandoEntrega) {
      try {
        setFinalizandoEntrega(true)

        await entregasService.finalizarEntrega(
          selectedEntrega.cod_entrega,
          observacionesFinal || undefined
        )

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
          observacionesFinal || 'No se especificó motivo.'
        )

        setEntregasPendientes((prev) =>
          prev.filter((e) => e.cod_entrega !== selectedEntrega.cod_entrega)
        )
        setSelectedEntrega(null)

        setShowConfirmModal(false)
        setObservacionesFinal('')
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
    <>
      <Navbar usuario={usuario} />
      <div className="flex h-screen flex-col">
        {/* Header mejorado para móvil y desktop */}
        <div className="border-b bg-white px-2 py-4 sm:px-5 lg:px-8 lg:py-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
                  Dashboard de Entregas
                </h1>
                <span className="mt-1 text-center text-xs text-gray-600 sm:text-left sm:text-base lg:text-base">
                  {usuario.nombre} {usuario.apellido} - {usuario.rol_actual}
                </span>
              </div>
              {/* Contadores en mobile */}
              <div className="flex gap-2 sm:hidden">
                <div className="rounded-lg bg-blue-50 px-3 py-2 text-center">
                  <div className="text-base font-semibold text-blue-600">
                    {entregasPendientes.length}
                  </div>
                  <div className="text-xs text-gray-600">Pendientes</div>
                </div>
                <div className="rounded-lg bg-green-50 px-3 py-2 text-center">
                  <div className="text-base font-semibold text-green-600">
                    {entregasRealizadas.length}
                  </div>
                  <div className="text-xs text-gray-600">Entregadas</div>
                </div>
              </div>
            </div>
            {/* Contadores en desktop */}
            <div className="hidden gap-6 sm:flex">
              <div className="rounded-lg bg-blue-50 px-4 py-2 text-center">
                <div className="text-lg font-semibold text-blue-600 lg:text-xl">
                  {entregasPendientes.length}
                </div>
                <div className="text-sm text-gray-600 lg:text-base">
                  Pendientes
                </div>
              </div>
              <div className="rounded-lg bg-green-50 px-4 py-2 text-center">
                <div className="text-lg font-semibold text-green-600 lg:text-xl">
                  {entregasRealizadas.length}
                </div>
                <div className="text-sm text-gray-600 lg:text-base">
                  Entregadas
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
          onCancelDelivery={handleCancelarEntrega}
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
    </>
  )
}
