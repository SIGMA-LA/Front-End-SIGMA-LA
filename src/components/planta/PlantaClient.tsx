'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Empleado, EntregaEmpleado } from '@/types'
import EntregasSidebar from '@/components/planta/EntregasSidebar'
import EntregaDetails from '@/components/planta/EntregaDetails'
import FinalizarEntregaModal from '@/components/planta/FinalizarEntregaModal'
import EmptyState from '@/components/planta/EmptyState'
import { Menu, X } from 'lucide-react'
import {
  getEntregasByEmpleado,
  finalizarEntrega,
  cancelarEntrega,
} from '@/actions/entregas'
import { notify } from '@/lib/toast'

interface PlantaClientProps {
  usuario: Empleado
  entregasInitial: EntregaEmpleado[]
  errorInitial: string | null
}

export default function PlantaClient({
  usuario,
  entregasInitial,
  errorInitial,
}: PlantaClientProps) {
  const [selectedEntrega, setSelectedEntrega] =
    useState<EntregaEmpleado | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [observacionesFinal, setObservacionesFinal] = useState('')
  const [entregas, setEntregas] = useState<EntregaEmpleado[]>(entregasInitial)
  const [estadoFiltro, setEstadoFiltro] = useState<
    'PENDIENTE' | 'ENTREGADO' | 'CANCELADO'
  >('PENDIENTE')

  const [searchTerm, setSearchTerm] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [debouncedDate, setDebouncedDate] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(errorInitial)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [finalizandoEntrega, setFinalizandoEntrega] = useState(false)

  // 3-second debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setDebouncedDate(filterDate)
    }, 2000)
    return () => clearTimeout(timer)
  }, [searchTerm, filterDate])

  const loadEntregas = useCallback(
    async (
      estado: 'PENDIENTE' | 'ENTREGADO' | 'CANCELADO',
      search: string,
      date: string
    ) => {
      if (!usuario?.cuil) return

      try {
        setLoading(true)
        setError(null)
        const data = await getEntregasByEmpleado(
          usuario.cuil,
          estado,
          search,
          date
        )
        setEntregas(data)
      } catch (err) {
        console.error('Error al cargar entregas:', err)
        setError('Error al cargar las entregas')
      } finally {
        setLoading(false)
      }
    },
    [usuario?.cuil]
  )

  // Refetch when debounced params or status filter change
  useEffect(() => {
    loadEntregas(estadoFiltro, debouncedSearch, debouncedDate)
  }, [estadoFiltro, debouncedSearch, debouncedDate, loadEntregas])

  const handleRetry = async () => {
    await loadEntregas(estadoFiltro, debouncedSearch, debouncedDate)
  }

  const handleSelectEntrega = (entrega: EntregaEmpleado) => {
    setSelectedEntrega(entrega)
    setSidebarOpen(false)
  }

  const handleFinalizarEntrega = async () => {
    if (selectedEntrega && usuario?.cuil && !finalizandoEntrega) {
      try {
        setFinalizandoEntrega(true)

        finalizarEntrega(
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
        if (estadoFiltro === 'PENDIENTE') {
          setEntregas((prev) =>
            prev.filter((e) => e.cod_entrega !== selectedEntrega.cod_entrega)
          )
        } else {
          setEntregas((prev) => [...prev, entregaActualizada])
        }
        setShowConfirmModal(false)
        setObservacionesFinal('')
        notify.success('Entrega finalizada correctamente.')
      } catch (error) {
        console.error('Error al finalizar entrega:', error)
        notify.error('Error al finalizar la entrega. Inténtalo de nuevo.')
      } finally {
        setFinalizandoEntrega(false)
      }
    }
  }

  const handleCancelarEntrega = async () => {
    if (selectedEntrega && !finalizandoEntrega) {
      try {
        setFinalizandoEntrega(true)
        cancelarEntrega(
          selectedEntrega.cod_entrega,
          observacionesFinal || 'No se especificó motivo.'
        )

        setEntregas((prev) =>
          prev.filter((e) => e.cod_entrega !== selectedEntrega.cod_entrega)
        )
        setSelectedEntrega(null)
        setShowConfirmModal(false)
        setObservacionesFinal('')
        notify.success('Entrega cancelada correctamente.')
      } catch (error) {
        console.error('Error al cancelar entrega:', error)
        notify.error('Error al cancelar la entrega. Inténtalo de nuevo.')
      } finally {
        setFinalizandoEntrega(false)
      }
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="border-b bg-white px-2 py-4 sm:px-5 lg:px-8 lg:py-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full items-center justify-between sm:justify-start">
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
            <div className="flex flex-1 flex-col items-center sm:ml-3 sm:items-start">
              <h1 className="text-center text-base font-bold text-gray-900 sm:text-left sm:text-2xl lg:text-3xl">
                Dashboard de Entregas
              </h1>
              <span className="mt-1 text-center text-xs text-gray-600 sm:text-left sm:text-base lg:text-base">
                {usuario.nombre} {usuario.apellido} - {usuario.rol_actual}
              </span>
            </div>
            <div className="flex gap-2 sm:hidden">
              <div className="rounded-lg bg-blue-50 px-3 py-2 text-center">
                <div className="text-base font-semibold text-blue-600">
                  {entregas.length}
                </div>
                <div className="text-xs font-bold text-gray-600">
                  ENTREGAS LISTADAS
                </div>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex">
            <div className="rounded-lg bg-blue-50 px-4 py-2 text-center">
              <div className="text-lg font-semibold text-blue-600 lg:text-xl">
                {entregas.length}
              </div>
              <div className="text-sm font-bold text-gray-600 lg:text-base">
                ENTREGAS LISTADAS
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
          className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-full transform transition-transform duration-300 ease-in-out sm:w-96 lg:relative lg:w-[28rem] lg:translate-x-0`}
        >
          <EntregasSidebar
            entregas={entregas}
            estadoFiltro={estadoFiltro}
            onEstadoFiltroChange={(estado) => {
              setEstadoFiltro(estado)
              loadEntregas(estado, debouncedSearch, debouncedDate)
            }}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            filterDate={filterDate}
            onFilterDateChange={setFilterDate}
            selectedEntrega={selectedEntrega}
            onSelectEntrega={handleSelectEntrega}
            loadingEntregas={loading}
            errorEntregas={error}
            onRetry={handleRetry}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {sidebarOpen && (
          <div
            className="bg-opacity-50 fixed inset-0 z-40 bg-transparent backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 lg:p-8">
          {selectedEntrega ? (
            <EntregaDetails
              entrega={selectedEntrega}
              onFinalizarEntrega={() => setShowConfirmModal(true)}
            />
          ) : (
            <EmptyState message="Selecciona una entrega del panel lateral para ver los detalles" />
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
  )
}
