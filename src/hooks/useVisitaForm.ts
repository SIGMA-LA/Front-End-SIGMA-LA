'use client'

import { useState, useEffect, useMemo } from 'react'
import { Empleado, Localidad, Provincia, Vehiculo, Visita } from '@/types'
// Importa los hooks que crearías para los otros datos
// import { useEmpleados } from './useEmpleados';
// import { useUbicaciones } from './useUbicaciones';
import { useVehiculos } from './useVehiculos' // ¡Usamos el nuevo hook!
import { getActualViatico } from '@/actions/parametros'

interface UseVisitaFormProps {
  visitaEditar?: Visita | null
  preloadedObra?: any // Define un tipo más específico si es posible
}

export function useVisitaForm({
  visitaEditar,
  preloadedObra,
}: UseVisitaFormProps) {
  // 1. Centralizamos el fetching de datos con nuestros nuevos hooks
  const { vehiculos, isLoading: isLoadingVehiculos } = useVehiculos()
  // ... aquí usarías los otros hooks:
  // const { visitadores, acompañantes, isLoading: isLoadingEmpleados } = useEmpleados();
  // const { provincias, localidades, fetchLocalidades, isLoading: isLoadingUbicaciones } = useUbicaciones();

  // 2. Centralizamos todo el estado del formulario
  const [formData, setFormData] = useState({
    /* ... tu estado inicial ... */
  })
  const [visitadorPrincipal, setVisitadorPrincipal] = useState('')
  const [selectedAcompanantes, setSelectedAcompanantes] = useState<string[]>([])
  // ... otros estados ...

  // 3. Unificamos el estado de carga
  const isLoading = isLoadingVehiculos // || isLoadingEmpleados || isLoadingUbicaciones;

  // 4. Toda la lógica y los `useEffect` se mueven aquí
  useEffect(() => {
    // Lógica para precargar el formulario si es una edición
    if (visitaEditar && vehiculos.length > 0) {
      // Tu lógica de `useEffect` para `visitaEditar` va aquí.
      // Ahora puedes estar seguro de que `vehiculos` ya está cargado.
      const patenteSeleccionada = vehiculos.some(
        (v) => v.patente === visitaEditar.uso_vehiculo_visita?.patente
      )
        ? visitaEditar.uso_vehiculo_visita.patente
        : ''

      setFormData((prev) => ({ ...prev, vehiculo: patenteSeleccionada }))
      // ... resto de la lógica de precarga
    }
  }, [visitaEditar, vehiculos])

  // ... mueve todos los otros `useEffect` y funciones handler aquí ...

  // 5. Devolvemos un objeto limpio con todo lo que el componente necesita
  return {
    formData,
    setFormData,
    visitadorPrincipal,
    setVisitadorPrincipal,
    // ... otros estados y setters ...
    vehiculos,
    // ... otros datos ...
    isLoading,
    // ... todas tus funciones handler (handleObraSelect, etc.) ...
  }
}
