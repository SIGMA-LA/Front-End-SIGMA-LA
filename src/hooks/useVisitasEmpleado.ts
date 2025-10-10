"use client";

import { useState, useEffect, useCallback } from 'react';
import { Visita } from '@/types';
import visitasService from '@/services/visitas.service';

export function useVisitasEmpleado(cuil: string | null | undefined) {
  const [visitasPendientes, setVisitasPendientes] = useState<Visita[]>([]);
  const [visitasRealizadas, setVisitasRealizadas] = useState<Visita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVisitas = useCallback(async () => {
    if (!cuil) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Usamos Promise.allSettled en lugar de Promise.all
    // allSettled espera a que todas las promesas terminen, sin importar si fallan o no.
    const results = await Promise.allSettled([
      visitasService.getVisitasByEmpleadoAndEstado(cuil, 'PROGRAMADA'),
      visitasService.getVisitasByEmpleadoAndEstado(cuil, 'COMPLETADA'),
    ]);

    const [pendientesResult, completadasResult] = results;

    // Verificamos el resultado de cada promesa individualmente
    if (pendientesResult.status === 'fulfilled') {
      setVisitasPendientes(pendientesResult.value);
    } else {
      console.error("Error al cargar visitas pendientes:", pendientesResult.reason);
      setError('No se pudieron cargar las visitas pendientes.');
      // Opcional: podrías querer dejar la lista vacía o mantener la anterior
      setVisitasPendientes([]); 
    }

    if (completadasResult.status === 'fulfilled') {
      setVisitasRealizadas(completadasResult.value);
    } else {
      console.error("Error al cargar visitas completadas:", completadasResult.reason);
      // Si ya hay un error, podrías concatenarlo o decidir cuál es más importante
      setError(prevError => prevError ? `${prevError} Y tampoco las completadas.` : 'No se pudieron cargar las visitas completadas.');
      setVisitasRealizadas([]);
    }

    setIsLoading(false);

  }, [cuil]);

  useEffect(() => {
    loadVisitas();
  }, [loadVisitas]);

  return { 
    visitasPendientes, 
    setVisitasPendientes, // Exponemos los setters para actualizaciones optimistas
    visitasRealizadas, 
    setVisitasRealizadas,
    isLoading, 
    error, 
    reloadVisitas: loadVisitas // Función para refrescar
  };
}