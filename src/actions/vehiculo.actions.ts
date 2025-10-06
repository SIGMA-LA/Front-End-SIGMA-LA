"use server";

import { revalidatePath } from 'next/cache';
import { getValidAccessToken } from '@/lib/auth-server';
import type { VehiculoFormData } from '@/types';
import axios from 'axios'; // Usaremos Axios para un mejor manejo de errores
import { updateVehiculo } from '@/services/vehiculos.service';

// El tipo de estado que SIEMPRE devolveremos
type ActionState = {
  success: boolean;
  message: string;
};

export async function createVehiculoAction(data: VehiculoFormData): Promise<ActionState> {
  try {
    const token = await getValidAccessToken();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    // Usaremos axios para que el manejo de errores sea más sencillo y estándar
    await axios.post(`${baseUrl}/vehiculos`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Forzamos la revalidación de los datos en la página del dashboard
    revalidatePath('/dashboard');

    // ¡¡LA CORRECCIÓN CLAVE!!
    // Devolvemos explícitamente un objeto en el caso de éxito.
    return { success: true, message: 'Vehículo creado con éxito.' };

  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Mensaje del backend:', error.response.data.errors[0].issues);
    }
    let errorMessage = 'No se pudo crear el vehículo.';
    
    // Mejoramos el manejo de errores para dar mensajes más específicos desde el backend
    if (axios.isAxiosError(error) && error.response) {
      // Si el backend envía un mensaje de error específico, lo usamos
      errorMessage = error.response.data.message || 'Error de validación del servidor.';
    } else if (error instanceof Error) {
      // Si es otro tipo de error (ej: fallo de red, error en getValidAccessToken)
      errorMessage = error.message;
    }

    // Devolvemos el objeto de error, asegurando que la función nunca devuelve 'undefined'
    return { success: false, message: errorMessage };
  }
}

/**
 * Server Action para actualizar un vehículo existente.
 * @param patente - El identificador del vehículo a actualizar.
 * @param data - Los nuevos datos para el vehículo (pueden ser parciales).
 */
export async function updateVehiculoAction(
  patente: string,
  data: Partial<VehiculoFormData>
): Promise<ActionState> {
  if (!patente) {
    return { success: false, message: 'La patente del vehículo es requerida para actualizar.' };
  }

  try {
    const token = await getValidAccessToken();

    // Llama al servicio de actualización, pasándole el token
    await updateVehiculo(patente, data, token);

    revalidatePath('/dashboard');

    return { success: true, message: 'Vehículo actualizado con éxito.' };
  } catch (error) {
    console.error('Error en updateVehiculoAction:', error);

    let errorMessage = 'No se pudo actualizar el vehículo.';
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data.message || 'Error de validación del servidor.';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return { success: false, message: errorMessage };
  }
}