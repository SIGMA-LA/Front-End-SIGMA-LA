"use server";

import { revalidatePath } from 'next/cache';
import { getValidAccessToken } from '@/lib/auth-server';
import type { VehiculoFormData } from '@/types';
import axios from 'axios'; // Usaremos Axios para un mejor manejo de errores
import { createVehiculo, updateVehiculo } from '@/services/vehiculos.service';

// El tipo de estado que SIEMPRE devolveremos
type ActionState = {
  success: boolean;
  message: string;
};

// Define un tipo para la respuesta de la acción para mayor claridad
type ActionResult = {
  success: boolean
  message: string
  data?: any
}

export async function createVehiculoAction(
  vehiculoData: VehiculoFormData,
): Promise<ActionResult> {
  try {
    // Obtenemos el token DENTRO de la acción para seguridad
    const token = await getValidAccessToken()
    if (!token) {
      return { success: false, message: 'No autenticado' }
    }

    const nuevoVehiculo = await createVehiculo(vehiculoData, token)

    return {
      success: true,
      message: 'Vehículo creado exitosamente',
      data: nuevoVehiculo,
    }
  } catch (error) {
    // --- ¡AQUÍ ESTÁ LA LÓGICA ANTI-CRASH! ---
    let errorMessage = 'No se pudo crear el vehículo. Intente más tarde.'

    // 1. Comprobamos si es un error de Axios con una respuesta del servidor
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data
      console.error('Error Response Data:', errorData)

      // 2. Buscamos un mensaje de error en diferentes lugares comunes
      if (errorData.message) {
        errorMessage = errorData.message
      } else if (
        Array.isArray(errorData.errors) &&
        errorData.errors.length > 0
      ) {
        // Si hay un array de errores, los unimos en un solo mensaje.
        errorMessage = errorData.errors
          .map((err: any) => err.message || JSON.stringify(err.issues))
          .join(', ')
      }
    } else if (error instanceof Error) {
      // Para errores genéricos (ej. de red)
      errorMessage = error.message
    }
    
    // 3. Devolvemos SIEMPRE un objeto de error estructurado. La acción NUNCA crashea.
    return { success: false, message: errorMessage }
  }
}

/**
 * Server Action para actualizar un vehículo existente.
 * @param patente - El identificador del vehículo a actualizar.
 * @param data - Los nuevos datos para el vehículo (pueden ser parciales).
 */
export async function updateVehiculoAction(
  patente: string,
  vehiculoData: Partial<VehiculoFormData>,
): Promise<ActionResult> {
  try {
    const token = await getValidAccessToken()
    if (!token) {
      return { success: false, message: 'No autenticado' }
    }

    const vehiculoActualizado = await updateVehiculo(patente, vehiculoData, token)

    return {
      success: true,
      message: 'Vehículo actualizado exitosamente',
      data: vehiculoActualizado,
    }
  } catch (error) {
    // Reutilizamos la misma lógica de manejo de errores "a prueba de balas"
    let errorMessage = 'No se pudo actualizar el vehículo. Intente más tarde.'

    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data
      console.error('Error Response Data:', errorData)

      if (errorData.message) {
        errorMessage = errorData.message
      } else if (
        Array.isArray(errorData.errors) &&
        errorData.errors.length > 0
      ) {
        errorMessage = errorData.errors
          .map((err: any) => err.message || JSON.stringify(err.issues))
          .join(', ')
      }
    } else if (error instanceof Error) {
      errorMessage = error.message
    }
    
    return { success: false, message: errorMessage }
  }
}