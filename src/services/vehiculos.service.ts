import axios from 'axios'; // <-- CAMBIO 1: Importamos axios directamente
import api from './api/api'; // Mantenemos la instancia global para el cliente
import type { Vehiculo, VehiculoFormData, BackendVehiculo, VehiculoEstado } from '@/types';

// Tus funciones de mapeo no cambian, son perfectas como están.
const mapToFrontend = (backendVehiculo: BackendVehiculo): Vehiculo => ({
  patente: backendVehiculo.patente,
  tipo_vehiculo: backendVehiculo.tipo_vehiculo as any, // Podrías añadir validación aquí
  estado: backendVehiculo.estado as VehiculoEstado,
});

const mapToBackend = (vehiculoData: Partial<VehiculoFormData>): any => {
  // 1. Creamos un objeto 'payload' vacío.
  const payload: any = {};

  // 2. Añadimos cada propiedad al payload SOLO SI existe en el objeto de entrada.
  if (vehiculoData.patente !== undefined) {
    payload.patente = vehiculoData.patente;
  }
  if (vehiculoData.tipo_vehiculo !== undefined) {
    payload.tipo_vehiculo = vehiculoData.tipo_vehiculo;
  }
  if (vehiculoData.estado !== undefined) {
    payload.estado = vehiculoData.estado;
  }

  // 3. Devolvemos el payload construido dinámicamente.
  return payload;
};
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
 * @param vehiculoData - Datos completos del formulario para el nuevo vehículo.
 * @param token - (Opcional) Token de autenticación para llamadas desde el servidor.
 * @returns El nuevo vehículo creado.
 */
export const createVehiculo = async (
  vehiculoData: VehiculoFormData,
  token?: string
): Promise<Vehiculo> => {
  // La nueva función mapToBackend funciona perfectamente aquí,
  // ya que todas las propiedades de vehiculoData estarán definidas.
  const payload = mapToBackend(vehiculoData);
  let nuevoVehiculoBackend: BackendVehiculo;

  try {
    if (token) {
      // --- MODO SERVIDOR ---
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
      // --- MODO CLIENTE ---
      // Usa la instancia 'api' que tiene el interceptor que funciona en el cliente.
      const response = await api.post<BackendVehiculo>('/vehiculos', payload);
      nuevoVehiculoBackend = response.data;
    }
    
    // Si la petición fue exitosa, mapea y devuelve los datos.
    return mapToFrontend(nuevoVehiculoBackend);

  } catch (error) {
    // --- MANEJO DE ERRORES MEJORADO ---
    // Este bloque se ejecutará si axios rechaza la promesa (ej: por un status 4xx o 5xx)
    console.error("Error al crear el vehículo:", error);

    // Si es un error de Axios, podemos intentar obtener más detalles.
    if (axios.isAxiosError(error) && error.response) {
      // Re-lanzamos un error con el mensaje del backend para que la Server Action pueda capturarlo.
      throw new Error(error.response.data.message || 'Ocurrió un error en el servidor.');
    }

    // Si es otro tipo de error, lo re-lanzamos.
    throw error;
  }
};

/**
 * Actualiza un vehículo. Seguro para cliente y servidor.
 */
export const updateVehiculo = async (
  patente: string,
  vehiculoData: Partial<VehiculoFormData>,
  token?: string
): Promise<Vehiculo> => {
  // El payload ahora solo contiene los campos que se van a actualizar.
  const payload = mapToBackend(vehiculoData); 
  let vehiculoActualizado: BackendVehiculo;

  if (token) {
    // ...
    const response = await axios.put<BackendVehiculo>(
      `${process.env.NEXT_PUBLIC_API_URL}/vehiculos/${patente}`,
      payload, // <-- 'payload' ya está correctamente formado
      { /* ... headers ... */ }
    );
    vehiculoActualizado = response.data;
  } else {
    // ...
    const response = await api.put<BackendVehiculo>(`/vehiculos/${patente}`, payload);
    vehiculoActualizado = response.data;
  }

  return mapToFrontend(vehiculoActualizado);
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