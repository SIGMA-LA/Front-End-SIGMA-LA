'use client'

import { useEffect, useState } from 'react'
import { Building2, Plus, Calendar, Edit, Trash2 } from 'lucide-react'
import type { ObrasListProps } from '@/types'
import { useGlobalContext } from '@/context/GlobalContext'
import { useAuth } from '@/context/AuthContext'

const { usuario } = useAuth()

export default function ObrasList({
  onCreateClick,
  onScheduleVisit,
  onScheduleEntrega,
  onEditClick,
}: ObrasListProps) {
  const { obras, fetchObras, deleteObra } = useGlobalContext()
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cargarObras = async () => {
      try {
        await fetchObras()
      } catch (err) {
        setError('No se pudieron cargar las obras. Intente de nuevo más tarde.')
        console.error(err);
      } finally {
        setCargando(false)
      }
    }
    cargarObras()
  }, [])

  const handleEliminar = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta obra? Esta acción no se puede deshacer.')) {
      try {
        await deleteObra(id)
        alert('Obra eliminada con éxito.')
      } catch (err) {
        console.error('Error al eliminar la obra:', err)
        alert('Ocurrió un error al intentar eliminar la obra.')
      }
    }
  }

  if (cargando) {
    return <div className="p-8 text-center text-lg text-gray-600">Cargando obras...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-lg text-red-600">{error}</div>
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Obras</h1>
          {usuario?.rol_actual === 'VENTAS' && (
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Nueva Obra
          </button>
          )}
        </div>

        <div className="grid gap-4 sm:gap-6">
          {obras.length > 0 ? (
            obras.map((obra) => (
              <div
                key={obra.id} 
                className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{obra.direccion}</h3>
                    <p className="text-gray-600">
                      Cliente: {obra.cliente?.razon_social || 'No asignado'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Inicio: {new Date(obra.fechaInicio).toLocaleDateString('es-AR', { timeZone: 'UTC' })}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        obra.estado === 'en_progreso'
                          ? 'bg-yellow-100 text-yellow-800'
                          : obra.estado === 'finalizada'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {obra.estado.replace('_', ' ')}
                    </span>
                    <div className="flex flex-wrap gap-2 sm:gap-4">
                      {onScheduleVisit && (
                        <button onClick={() => onScheduleVisit(obra)} className="flex items-center gap-1 font-medium text-green-600 hover:text-green-800">
                          <Calendar className="h-4 w-4" /> Agendar Visita
                        </button>
                      )}
                      {onScheduleEntrega && (
                        <button onClick={() => onScheduleEntrega(obra)} className="flex items-center gap-1 font-medium text-red-600 hover:text-red-800">
                          <Calendar className="h-4 w-4" /> Agendar Entrega
                        </button>
                      )}
                      <button onClick={() => onEditClick(obra)} className="flex items-center gap-1 font-medium text-blue-600 hover:text-blue-800">
                        <Edit className="h-4 w-4" /> Editar
                      </button>
                      <button onClick={() => handleEliminar(obra.id)} className="flex items-center gap-1 font-medium text-red-600 hover:text-red-800">
                        <Trash2 className="h-4 w-4" /> Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="mt-8 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay obras</h3>
              <p className="mt-1 text-sm text-gray-500">Comienza creando una nueva obra.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}