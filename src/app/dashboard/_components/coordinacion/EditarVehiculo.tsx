// src/components/Coord/EditarVehiculo.tsx
'use client'

import { useState, useEffect } from 'react'
import { Save, Info, AlertTriangle } from 'lucide-react'

import { Vehiculo, VehiculoFormData } from '@/types' // Asegúrate que tu tipo Vehiculo coincida con el nuevo esquema
import { useUpdateVehiculo } from '@/hooks/useUpdateVehiculo';

interface EditarVehiculoProps {
  vehiculo: Vehiculo;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function EditarVehiculo({ vehiculo, onCancel, onSubmit }: EditarVehiculoProps) {
  // --- ESTADO DEL FORMULARIO ---
  // Campos del modelo actual (editables)
  const [tipoVehiculo, setTipoVehiculo] = useState(vehiculo.tipo_vehiculo || '')
  const [estado, setEstado] = useState(vehiculo.estado || 'DISPONIBLE')

  // Campos para futuras versiones (no se envían al backend)
  // Los mantenemos en el estado para que la UI funcione y sea fácil de activar después.
  const [marca, setMarca] = useState((vehiculo as any).marca || '')
  const [modelo, setModelo] = useState((vehiculo as any).modelo || '')
  const [anio, setAnio] = useState((vehiculo as any).anio?.toString() || '')

  // La patente no es editable, es el identificador único.
  const patente = vehiculo.patente

  const [errors, setErrors] = useState<{
    tipoVehiculo?: string
    estado?: string
  }>({})

  const { isPending, error: apiError, handleUpdate, setError: setApiError } = useUpdateVehiculo({
    onSuccess: onSubmit, // Al tener éxito, simplemente llamamos a la prop onSubmit
  });

  // CORRECCIÓN: Definimos las opciones con sus tipos correctos
  const tiposVehiculo= ['CAMION CHICO', 'CAMIONETA', 'AUTOMOVIL', 'CAMION GRANDE'];
  const estadosVehiculo = ['DISPONIBLE', 'EN USO', 'REPARACION', 'FUERA DE SERVICIO', 'RESERVADO'];

  // --- LÓGICA DE VALIDACIÓN Y ENVÍO ---
  const validateForm = () => {
    const newErrors: any = {}
    if (!tipoVehiculo) newErrors.tipoVehiculo = 'El tipo de vehículo es obligatorio'
    if (!estado) newErrors.estado = 'El estado es obligatorio'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Limpiamos cualquier error previo de la API al intentar guardar de nuevo
    setApiError(null);

    if (!validateForm()) return;

    const vehiculoDataToUpdate: Partial<VehiculoFormData> = {
      tipo_vehiculo: tipoVehiculo,
      estado: estado,
    };

    handleUpdate(vehiculo.patente, vehiculoDataToUpdate);
  }
  
  // useEffect para sincronizar el estado (sin cambios)
  useEffect(() => {
    if (vehiculo) {
        setTipoVehiculo(vehiculo.tipo_vehiculo || '');
        setEstado(vehiculo.estado || 'DISPONIBLE');
    }
  }, [vehiculo]);


  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-xl relative animate-fade-in-up">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Editar Vehículo</h1>
          <p className="text-gray-600">
            Modificando datos del vehículo con patente:
            <span className="ml-2 font-mono font-bold text-blue-600">{patente}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fila 1: Campos Editables (Tipo y Estado) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="tipoVehiculo" className="mb-2 block text-sm font-medium text-gray-700">Tipo <span className="text-red-500">*</span></label>
              <select id="tipoVehiculo" value={tipoVehiculo} onChange={(e) => setTipoVehiculo(e.target.value)} className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${errors.tipoVehiculo ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}>
                <option value="">Seleccionar tipo</option>
                {tiposVehiculo.map((tipo) => <option key={tipo} value={tipo}>{tipo}</option>)}
              </select>
              {errors.tipoVehiculo && <p className="mt-1 text-sm text-red-600">{errors.tipoVehiculo}</p>}
            </div>
            <div>
              <label htmlFor="estado" className="mb-2 block text-sm font-medium text-gray-700">Estado <span className="text-red-500">*</span></label>
              <select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)} className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${errors.estado ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}>
                {estadosVehiculo.map((est) => <option key={est} value={est}>{est}</option>)}
              </select>
              {errors.estado && <p className="mt-1 text-sm text-red-600">{errors.estado}</p>}
            </div>
          </div>
          
          {/* Separador y aviso para campos futuros */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 mt-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 flex-shrink-0 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">Campos para futuras versiones</h4>
                <p className="text-sm text-blue-700">
                  Los siguientes campos se habilitarán en una próxima actualización del sistema.
                </p>
              </div>
            </div>
          </div>
          
          {/* Fila 2: Campos Deshabilitados (Marca y Modelo) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="marca" className="mb-2 block text-sm font-medium text-gray-400">Marca</label>
              <input type="text" id="marca" value={marca} onChange={(e) => setMarca(e.target.value)} disabled className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500 cursor-not-allowed" />
            </div>
            <div>
              <label htmlFor="modelo" className="mb-2 block text-sm font-medium text-gray-400">Modelo</label>
              <input type="text" id="modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} disabled className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500 cursor-not-allowed" />
            </div>
          </div>
          
          {/* Fila 3: Campos Deshabilitados y de solo lectura (Año y Patente) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
                <label htmlFor="anio" className="mb-2 block text-sm font-medium text-gray-400">Año</label>
                <input type="number" id="anio" value={anio} onChange={(e) => setAnio(e.target.value)} disabled className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500 cursor-not-allowed" />
            </div>
             <div>
                <label htmlFor="patente" className="mb-2 block text-sm font-medium text-gray-700">Patente (Identificador)</label>
                <input type="text" id="patente" value={patente} readOnly className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm font-mono text-gray-500 cursor-not-allowed" />
             </div>
          </div>

          {apiError && (
            <div className="rounded-lg border border-red-300 bg-red-50 p-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-600" />
                <div>
                  <h4 className="font-semibold text-red-800">Error al actualizar</h4>
                  <p className="text-sm text-red-700">{apiError}</p>
                </div>
              </div>
            </div>
          )}
          {/* Botones */}
          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <button type="button" onClick={onCancel} className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={isPending} className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400">
              <Save className="h-5 w-5" />
              {isPending ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}