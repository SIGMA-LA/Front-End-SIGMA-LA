"use client";
import { useState, useEffect, useCallback, useTransition } from 'react';
import { createVehiculoAction } from '@/actions/vehiculo.actions';
import type { Vehiculo, VehiculoFormData } from '@/types';

interface UseCreateVehiculoProps {
  // on success ahora es el lugar perfecto para poner la lógica de cierre de modal
  onSuccess: () => void;
}

export function useCreateVehiculo({ onSuccess }: UseCreateVehiculoProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleCreate = (vehiculoData: VehiculoFormData) => {
    setError(null); 
    
    startTransition(async () => {
      const result = await createVehiculoAction(vehiculoData);
      
      if (result.success) {
        onSuccess();
      } else {
        setError(result.message);
      }
    });
  };

  // --- ¡CAMBIO CLAVE AQUÍ! ---
  // Exponemos la función `setError` para que el componente pueda limpiarlo.
  return { isPending, error, handleCreate, setError };
}