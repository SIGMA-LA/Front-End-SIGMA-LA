'use server'

import { Empleado } from '@/types'
import { getAccessToken } from './auth'

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL + '/empleados'

export async function obtenerEmpleadoActual(): Promise<Empleado | null> {
  try {
    const token = await getAccessToken()
    const response = await fetch(`${baseUrl}/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const empleado: Empleado = await response.json()
    return empleado
  } catch (error) {
    console.error('Error obteniendo empleado actual:', error)
    return null
  }
}

export async function obtenerVisitadores(): Promise<Empleado[]> {
  try {
    const token = await getAccessToken()
    const response = await fetch(`${baseUrl}/visitadores`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    console.log(response)

    if (!response.ok) {
      return []
    }

    const visitadores: Empleado[] = await response.json()
    return visitadores
  } catch (error) {
    console.error('Error obteniendo visitadores:', error)
    return []
  }
}

export async function getDisponiblesParaEntrega(): Promise<Empleado[]> {
  try {
    const token = await getAccessToken()
    const response = await fetch(`${baseUrl}/disponibles-entrega`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return []
    }

    const empleados: Empleado[] = await response.json()
    return empleados
  } catch (error) {
    console.error('Error al obtener empleados disponibles para entrega:', error)
    throw error
  }
}

export async function buscarFiltrados(query: string): Promise<Empleado[]> {
  try {
    const token = await getAccessToken()
    const response = await fetch(`${baseUrl}/buscar?${query}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return []
    }

    const empleados: Empleado[] = await response.json()
    return empleados
  } catch (error) {
    console.error('Error al buscar acompañantes:', error)
    throw error
  }
}

export async function obtenerEmpleadoPorCuil(cuil: string): Promise<Empleado | null> {
  // Validamos que el CUIL no esté vacío para no hacer una llamada innecesaria.
  if (!cuil) {
    console.warn('Se intentó obtener un empleado sin CUIL.');
    return null;
  }

  try {
    const token = await getAccessToken();
    // La URL debe coincidir con tu endpoint de la API para obtener un solo empleado.
    // Usualmente sigue el patrón RESTful: /empleados/:cuil
    const response = await fetch(`${baseUrl}/${cuil}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      // Si el empleado no se encuentra (404) o hay otro error, devolvemos null.
      return null;
    }

    const empleado: Empleado = await response.json();
    return empleado;
  } catch (error) {
    console.error(`Error obteniendo empleado con CUIL ${cuil}:`, error);
    return null; // En caso de error de red, también devolvemos null.
  }
}
