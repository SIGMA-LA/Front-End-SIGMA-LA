import { Wrench, Plus, CheckCircle, AlertTriangle } from 'lucide-react'
import { mockMaquinarias } from '@/data/mockData'
import { MaquinariaListProps } from '@/types'


export default function MaquinariaList({ onCreateClick }: MaquinariaListProps) {
  const maquinarias = mockMaquinarias

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'disponible':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'inhabilitada':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'fuera-servicio':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'disponible':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'inhabilitada':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'fuera-servicio':
        return 'bg-red-50 border-red-200 text-red-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
              <Wrench className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Maquinaria
              </h1>
              <p className="text-sm text-gray-600">
                Gestión de equipos y maquinaria de obra
              </p>
            </div>
          </div>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-700"
          >
            <Plus className="h-5 w-5" />
            Nueva Máquina
          </button>
        </div>

        {maquinarias.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <Wrench className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay máquinas registradas
            </h3>
            <p className="text-gray-600 mb-4">
              Comienza agregando la primera máquina al sistema
            </p>
            <button
              onClick={onCreateClick}
              className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-700"
            >
              <Plus className="h-5 w-5" />
              Nueva Máquina
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {maquinarias.map((maquinaria) => (
              <div
                key={maquinaria.id}
                className={`rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md ${getEstadoColor(maquinaria.estado)}`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500">
                      {maquinaria.id}
                    </span>
                    {getEstadoIcon(maquinaria.estado)}
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                    maquinaria.estado === 'disponible' 
                      ? 'bg-green-100 text-green-800'
                      : maquinaria.estado === 'inhabilitada'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {maquinaria.estado}
                  </span>
                </div>
                
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  {maquinaria.descripcion}
                </h3>
                
                
                <div className="flex gap-2">
                  <button className="flex-1 rounded-lg border border-current px-3 py-2 text-sm font-medium transition-colors hover:bg-current hover:bg-opacity-10">
                    Ver Detalles
                  </button>
                  <button className="flex-1 rounded-lg border border-current px-3 py-2 text-sm font-medium transition-colors hover:bg-current hover:bg-opacity-10">
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}