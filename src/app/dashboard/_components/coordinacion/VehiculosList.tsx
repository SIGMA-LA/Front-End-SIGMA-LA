import { Car, Plus, CheckCircle, AlertTriangle, Clock, XCircle } from 'lucide-react'
import { mockVehiculos } from '@/data/mockData'
import { VehiculosListProps } from '@/types'
import { useVehiculos } from '@/hooks/useVehiculos';


// Mock data de vehículos

export default function VehiculosList({ onCreateClick }: VehiculosListProps) {
  /* const vehiculos = mockVehiculos */

  const { vehiculos, isLoading, error } = useVehiculos();
  /* const vehiculos = await getVehiculos(); */ // Llama a la función para obtener los vehículos

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'DISPONIBLE':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'EN USO':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'REPARACION':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'DISPONIBLE':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'EN USO':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'REPARACION':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'disponible':
        return 'Disponible'
      case 'en-uso':
        return 'En Uso'
      case 'reparacion':
        return 'Reparación'
      default:
        return estado
    }
  }

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'DISPONIBLE':
        return 'bg-green-100 text-green-800'
      case 'EN USO':
        return 'bg-blue-100 text-blue-800'
      case 'REPARACION':
        return 'bg-yellow-100 text-yellow-800'
      case 'FUERA DE SERVICIO':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }



  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Vehículos
              </h1>
              <p className="text-sm text-gray-600">
                Gestión de flota vehicular para visitas y entregas
              </p>
            </div>
          </div>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Nuevo Vehículo
          </button>
        </div>

        {/* Estadísticas rápidas */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Disponibles</span>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {vehiculos.filter(v => v.estado === 'DISPONIBLE').length}
            </p>
          </div>
          
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">En Uso</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {vehiculos.filter(v => v.estado === 'EN USO').length}
            </p>
          </div>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Reparación</span>
            </div>
            <p className="text-2xl font-bold text-yellow-900">
              {vehiculos.filter(v => v.estado === 'REPARACION').length}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-800">Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {vehiculos.length}
            </p>
          </div>
        </div>

        {vehiculos.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <Car className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay vehículos registrados
            </h3>
            <p className="text-gray-600 mb-4">
              Comienza agregando el primer vehículo a la flota
            </p>
            <button
              onClick={onCreateClick}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              Nuevo Vehículo
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vehiculos.map((vehiculo) => (
              <div
                key={vehiculo.patente}
                className={`rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md ${getEstadoColor(vehiculo.estado)}`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getEstadoIcon(vehiculo.estado)}
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${getEstadoBadgeColor(vehiculo.estado)}`}>
                    {getEstadoText(vehiculo.estado)}
                  </span>
                </div>
                
                <div className="mb-4">
                  <span className='text-sm text-gray-600'>{vehiculo.tipoVehiculo}</span>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {vehiculo.marca} {vehiculo.modelo} {vehiculo.anio}
                  </h3>
                  <p className="text-2xl font-mono font-bold text-gray-800">
                    {vehiculo.patente}
                  </p>
                </div>
                
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