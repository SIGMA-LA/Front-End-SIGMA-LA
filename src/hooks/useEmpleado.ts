"use client";

import { useState, useEffect } from 'react';
import { obtenerEmpleadoPorCuil } from '@/actions/empleado';
import { Empleado } from '@/types';

/**
 * Hook para obtener los datos de un empleado específico por su CUIL.
 * @param cuil - El CUIL del empleado a buscar.
 */
export function useEmpleado(cuil: string | null | undefined) {
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si el CUIL no es válido o es nulo, no hacemos nada.
    if (!cuil) {
      setEmpleado(null);
      setIsLoading(false);
      return;
    }

    async function fetchEmpleado() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await obtenerEmpleadoPorCuil(cuil as string);
        if (data) {
          setEmpleado(data);
        } else {
          // Si la API devuelve null (ej. 404), lo manejamos como un error.
          setError(`No se encontró el empleado con CUIL: ${cuil}`);
        }
      } catch (err: any) {
        setError(err.message || 'Error al cargar los datos del empleado.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchEmpleado();
  }, [cuil]); // El hook se re-ejecutará cada vez que el CUIL cambie.

  return { empleado, isLoading, error };
}