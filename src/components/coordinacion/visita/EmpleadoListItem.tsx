"use client";

import { useEmpleado } from '@/hooks/useEmpleado';
import { User } from 'lucide-react';

interface EmpleadoListItemProps {
  cuil: string;
}

export default function EmpleadoListItem({ cuil }: EmpleadoListItemProps) {
  const { empleado, isLoading, error } = useEmpleado(cuil);

  if (isLoading) {
    return (
      <li className="flex items-center gap-2 text-sm text-gray-400">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
        <span>Cargando empleado...</span>
      </li>
    );
  }

  if (error) {
    return (
      <li className="text-sm text-red-500">
        Error al cargar empleado ({cuil}).
      </li>
    );
  }

  if (!empleado) {
    return null; // O mostrar un mensaje de 'Empleado no encontrado'
  }

  return (
    <li className="flex items-center gap-2">
      <User size={16} className="text-gray-600" />
      <span className="font-medium">{empleado.nombre} {empleado.apellido}</span>
      <span className="text-xs text-gray-500">- {empleado.rol_actual}</span>
    </li>
  );
}