'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  Building2,
  Plus,
  Calendar,
  Edit,
  Trash2,
  DollarSign,
  Search,
  Filter,
  FileText,
} from 'lucide-react'
import type { ObrasListProps, Obra } from '@/types'
import { useGlobalContext } from '@/context/GlobalContext'
import { useAuth } from '@/context/AuthContext'
import EstadoObraBadge from './EstadoObraBadge'
import PagosObra from '../ventas/PagosObra'
import { deleteObra } from '@/actions/obras'
import NotaFabricaModal from '../ventas/NotaFabricaModal'

const ESTADOS_OBRA: Obra['estado'][] = [
  'EN ESPERA DE PAGO',
  'PAGADA PARCIALMENTE',
  'EN ESPERA DE STOCK',
  'EN PRODUCCION',
  'PRODUCCION FINALIZADA',
  'PAGADA TOTALMENTE',
  'ENTREGADA',
  'CANCELADA',
]

export default function ObrasList({
  onCreateClick,
  onScheduleVisit,
  onScheduleEntrega,
  onEditClick,
}: ObrasListProps) {
  const { obras, fetchObras, localidades, fetchLocalidades } =
    useGlobalContext()
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [obraPagos, setObraPagos] = useState<Obra | null>(null)
  const [notaFabricaObra, setNotaFabricaObra] = useState<Obra | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroLocalidad, setFiltroLocalidad] = useState('')

  const { usuario } = useAuth()

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        await fetchObras()
        await fetchLocalidades()
      } catch (err) {
        setError('No se pudieron cargar las obras. Intente de nuevo más tarde.')
        console.error(err)
      } finally {
        setCargando(false)
      }
    }
    cargarDatos()
  }, [fetchObras, fetchLocalidades])

  const handleEliminar = async (id: number) => {
    if (
      window.confirm(
        '¿Estás seguro de que deseas cancelar esta obra? El estado cambiará a "CANCELADA".'
      )
    ) {
      const result = await deleteObra(id)
      if (result.success) {
        alert('Obra cancelada con éxito.')
        await fetchObras()
      } else {
        console.error('Error al cancelar la obra:', result.error)
        alert(`Ocurrió un error: ${result.error}`)
      }
    }
  }

  const obrasFiltradas = useMemo(() => {
    return obras.filter((obra) => {
      const matchDireccion =
        searchTerm === '' ||
        obra.direccion.toLowerCase().includes(searchTerm.toLowerCase())

      let matchEstado = true
      if (filtroEstado === '') {
        matchEstado = obra.estado !== 'CANCELADA'
      } else {
        matchEstado = obra.estado === filtroEstado
      }

      const matchLocalidad =
        filtroLocalidad === '' ||
        obra.localidad?.cod_localidad === parseInt(filtroLocalidad)

      return matchDireccion && matchEstado && matchLocalidad
    })
  }, [obras, searchTerm, filtroEstado, filtroLocalidad])

  if (obraPagos) {
    return <PagosObra obra={obraPagos} onClose={() => setObraPagos(null)} />
  }

  if (cargando) {
    return (
      <div className="p-8 text-center text-lg text-gray-600">
        Cargando obras...
      </div>
    )
  }

  if (error) {
    return <div className="p-8 text-center text-lg text-red-600">{error}</div>
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Obras
              </h1>
              <p className="text-sm text-gray-600">
                Visualiza, filtra y gestiona todas las obras.
              </p>
            </div>
          </div>
          {usuario?.rol_actual === 'VENTAS' && (
            <button
              onClick={onCreateClick}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-700 sm:w-auto"
            >
              <Plus className="h-5 w-5" />
              Nueva Obra
            </button>
          )}
        </div>

        <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative">
              <label
                htmlFor="search-direccion"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Buscar por Dirección
              </label>
              <Search className="absolute bottom-3 left-3 h-5 w-5 text-gray-400" />
              <input
                id="search-direccion"
                type="text"
                placeholder="Ej: Calle 44..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border-gray-300 py-2 pr-4 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="filtro-estado"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Estado
              </label>
              <select
                id="filtro-estado"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Todos los estados</option>
                {ESTADOS_OBRA.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="filtro-localidad"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Localidad
              </label>
              <select
                id="filtro-localidad"
                value={filtroLocalidad}
                onChange={(e) => setFiltroLocalidad(e.target.value)}
                className="w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Todas las localidades</option>
                {localidades.map((loc) => (
                  <option key={loc.cod_localidad} value={loc.cod_localidad}>
                    {loc.nombre_localidad}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6">
          {obrasFiltradas.length > 0 ? (
            obrasFiltradas.map((obra) => (
              <div
                key={obra.cod_obra}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {obra.direccion}
                    </h3>
                    <p className="text-gray-600">
                      Cliente:{' '}
                      {obra.cliente
                        ? obra.cliente.tipo_cliente === 'EMPRESA'
                          ? obra.cliente.razon_social
                          : `${obra.cliente.nombre ?? ''} ${obra.cliente.apellido ?? ''}`.trim() ||
                            'No asignado'
                        : 'No asignado'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Inicio:{' '}
                      {new Date(obra.fecha_ini).toLocaleDateString('es-AR', {
                        timeZone: 'UTC',
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    <EstadoObraBadge estado={obra.estado} />
                    <div className="flex flex-wrap gap-2 sm:gap-4">
                      {/* SOLO mostrar si NO es VENTAS */}
                      {usuario?.rol_actual !== 'VENTAS' && onScheduleVisit && (
                        <button
                          onClick={() => setObraPagos(obra)}
                          className="flex items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-800 disabled:cursor-not-allowed disabled:text-gray-400"
                          disabled={isCancelada}
                          title={
                            isCancelada
                              ? 'No se pueden gestionar pagos de una obra cancelada'
                              : 'Gestionar pagos'
                          }
                        >
                          <DollarSign className="h-4 w-4" /> Pagos
                        </button>
                        <button
                          onClick={() => setNotaFabricaObra(obra)}
                          className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 disabled:cursor-not-allowed disabled:text-gray-400"
                          disabled={isCancelada}
                          title={
                            isCancelada
                              ? 'No se pueden gestionar Notas de Fábrica de una obra cancelada'
                              : 'Gestionar Nota de Fábrica'
                          }
                        >
                          <FileText className="h-4 w-4" /> Nota de Fábrica
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="mt-8 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <Filter className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No se encontraron obras
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Intenta ajustar los filtros o crea una nueva obra.
              </p>
            </div>
          )}
        </div>
      </div>
      {notaFabricaObra && (
        <NotaFabricaModal
          isOpen={!!notaFabricaObra}
          onClose={() => setNotaFabricaObra(null)}
          notaUrl={notaFabricaObra.nota_fabrica || null}
          codObra={notaFabricaObra.cod_obra}
          onUploadSuccess={(url: string) => {
            setNotaFabricaObra((prev) =>
              prev ? { ...prev, nota_fabrica: url } : prev
            )
            fetchObras()
          }}
          rolActual={usuario?.rol_actual}
        />
      )}
    </div>
  )
}
