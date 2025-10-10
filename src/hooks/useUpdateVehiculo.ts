"use client";

import { useState, useTransition } from 'react';
// ... tus otras importaciones ...
import { updateVehiculoAction } from '@/actions/vehiculo.actions';
import type { VehiculoFormData } from '@/types';

// ... tus hooks useGetVehiculos y useCreateVehiculo ...

// ====================================================================
// HOOK PARA ACTUALIZAR UN VEHÍCULO (PUT)
// ====================================================================
interface UseUpdateVehiculoProps {
  onSuccess: () => void;
}

export function useUpdateVehiculo({ onSuccess }: UseUpdateVehiculoProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = (patente: string, vehiculoData: Partial<VehiculoFormData>) => {
    setError(null); // Limpiar errores previos
    
    startTransition(async () => {
      const result = await updateVehiculoAction(patente, vehiculoData);
      
      if (result.success) {
        onSuccess();
      } else {
        setError(result.message);
      }
    });
  };

  // Exponemos setError para que el componente pueda limpiar el error
  return { isPending, error, handleUpdate, setError };
}