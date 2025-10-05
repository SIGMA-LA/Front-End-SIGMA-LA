"use client";
import { useState, useEffect, useCallback, useTransition } from 'react';
import { createVehiculoAction } from '@/actions/vehiculo.actions';
import type { Vehiculo, VehiculoFormData } from '@/types';

interface UseCreateVehiculoProps {
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

  return { isPending, error, handleCreate };
}