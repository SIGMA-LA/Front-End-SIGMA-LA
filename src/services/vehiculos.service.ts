import axios from 'axios'; // <-- CAMBIO 1: Importamos axios directamente
import api from './api/api'; // Mantenemos la instancia global para el cliente
import type { Vehiculo, VehiculoFormData, BackendVehiculo, VehiculoEstado } from '@/types';

// Tus funciones de mapeo no cambian, son perfectas como están.
const mapToFrontend = (backendVehiculo: BackendVehiculo): Vehiculo => ({
  patente: backendVehiculo.patente,
  tipo_vehiculo: backendVehiculo.tipo_vehiculo as any, // Podrías añadir validación aquí
  estado: backendVehiculo.estado as VehiculoEstado,
});

const mapToBackend = (vehiculoData: VehiculoFormData): any => ({
  patente: vehiculoData.patente,
  tipo_vehiculo: vehiculoData.tipo_vehiculo,
  estado: vehiculoData.estado,
});

// --- FUNCIONES DE SERVICIO ADAPTADAS ---

/**
 * Obtiene todos los vehículos. Seguro para cliente y servidor.
 */
export const getVehiculos = async (token?: string): Promise<Vehiculo[]> => {
  try {
    let data: BackendVehiculo[];
    
    if (token) {
      // MODO SERVIDOR: Usa axios directamente con el token
      const response = await axios.get<BackendVehiculo[]>(`${process.env.NEXT_PUBLIC_API_URL}/vehiculos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      data = response.data;
    } else {
      // MODO CLIENTE: Usa la instancia 'api' con el interceptor de localStorage
      const response = await api.get<BackendVehiculo[]>('/vehiculos');
      data = response.data;
    }

    return data.map(mapToFrontend);
  } catch (error) {
    console.error("Error al obtener vehículos:", error);
    // Lanza el error para que sea manejado por el hook o la acción que lo llamó
    throw error;
  }
};

/**
 * Crea un nuevo vehículo. Seguro para cliente y servidor.
 */
export const createVehiculo = async (
  vehiculoData: VehiculoFormData,
  token?: string // <-- CAMBIO 2: Añadimos el parámetro opcional 'token'
): Promise<Vehiculo> => {
  const payload = mapToBackend(vehiculoData);
  let nuevoVehiculoBackend: BackendVehiculo;

  if (token) {
    // --- MODO SERVIDOR ---
    // <-- CAMBIO 3: Lógica específica para el servidor
    // Usa axios directamente para evitar el interceptor de localStorage.
    const response = await axios.post<BackendVehiculo>(
      `${process.env.NEXT_PUBLIC_API_URL}/vehiculos`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    nuevoVehiculoBackend = response.data;
  } else {
    // --- MODO CLIENTE (tu código original) ---
    // <-- CAMBIO 4: Tu lógica original ahora está en el 'else'
    // Usa la instancia 'api' que tiene el interceptor que funciona en el cliente.
    const response = await api.post<BackendVehiculo>('/vehiculos', payload);
    nuevoVehiculoBackend = response.data;
  }
  
  return mapToFrontend(nuevoVehiculoBackend);
};

/**
 * Actualiza un vehículo. Seguro para cliente y servidor.
 */
export const updateVehiculo = async (
  patente: string,
  vehiculoData: Omit<VehiculoFormData, 'patente'>,
  token?: string
): Promise<Vehiculo> => {
  const payload = mapToBackend({ ...vehiculoData, patente });
  let obraActualizadaBackend: BackendVehiculo;

  if (token) {
    // MODO SERVIDOR
    const response = await axios.put<BackendVehiculo>(`${process.env.NEXT_PUBLIC_API_URL}/vehiculos/${patente}`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    obraActualizadaBackend = response.data;
  } else {
    // MODO CLIENTE
    const response = await api.put<BackendVehiculo>(`/vehiculos/${patente}`, payload);
    obraActualizadaBackend = response.data;
  }

  return mapToFrontend(obraActualizadaBackend);
};

/**
 * Elimina un vehículo. Seguro para cliente y servidor.
 */
export const deleteVehiculo = async (patente: string, token?: string): Promise<void> => {
  if (token) {
    // MODO SERVIDOR
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/vehiculos/${patente}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } else {
    // MODO CLIENTE
    await api.delete(`/vehiculos/${patente}`);
  }
};