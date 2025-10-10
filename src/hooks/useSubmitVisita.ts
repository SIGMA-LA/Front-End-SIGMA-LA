"use client";

import { useState, useTransition } from 'react';
import { crearVisita, actualizarVisita } from '@/actions/visitas';
import { Visita } from '@/types';

interface UseSubmitVisitaProps {
  onSuccess: (visita: Visita) => void;
}

export function useSubmitVisita({ onSuccess }: UseSubmitVisitaProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const submit = (visitaData: any, visitaId?: number) => {
    setError(null);
    startTransition(async () => {
      try {
        const result = visitaId
          ? await actualizarVisita(visitaId, visitaData)
          : await crearVisita(visitaData);

        if (result) {
          onSuccess(result);
        } else {
          // Asumimos que la acción devuelve null o undefined en caso de error conocido
          setError('No se pudo guardar la visita. Verifique los datos.');
        }
      } catch (err: any) {
        // Captura errores inesperados
        setError(err.message || 'Ocurrió un error inesperado.');
      }
    });
  };

  return { isPending, error, submit, setError };
}