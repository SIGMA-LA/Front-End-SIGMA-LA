export const ROLES_VALIDOS = [
  { value: 'VENTAS', label: 'Ventas' },
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'PLANTA', label: 'Planta' },
  { value: 'COORDINACION', label: 'Coordinación' },
  { value: 'VISITADOR', label: 'Visitador' },
  { value: 'PRODUCCION', label: 'Producción' },
] as const

export const AREAS_VALIDAS = [
  { value: 'COORDINACION', label: 'Coordinación' },
  { value: 'VENTAS', label: 'Ventas' },
  { value: 'PRODUCCION', label: 'Producción' },
  { value: 'CORTE', label: 'Corte' },
  { value: 'MECANIZADO', label: 'Mecanizado' },
  { value: 'ENSAMBLE', label: 'Ensamble' },
  { value: 'ALMACEN', label: 'Almacén' },
  { value: 'ATENCION_CLIENTE', label: 'Atención al Cliente' },
  { value: 'COMPRAS', label: 'Compras' },
  { value: 'RECURSOS_HUMANOS', label: 'Recursos Humanos' },
  { value: 'FINANZAS', label: 'Finanzas' },
] as const

export const getRolLabel = (rol: string) => {
  return ROLES_VALIDOS.find((r) => r.value === rol)?.label || rol
}

export const getAreaLabel = (area: string) => {
  return AREAS_VALIDAS.find((a) => a.value === area)?.label || area
}

export const getRolDisplayName = (rol: string) => {
  const rolNames: Record<string, string> = {
    ADMIN: 'Administrador',
    COORDINACION: 'Coordinación',
    PLANTA: 'Planta',
    VISITADOR: 'Visitador',
    VENTAS: 'Ventas',
    PRODUCCION: 'Producción',
  }
  return rolNames[rol] || rol
}
