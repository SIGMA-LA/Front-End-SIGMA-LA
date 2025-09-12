export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  rol:
    | "admin"
    | "coordinacion"
    | "encargado"
    | "visitador"
  fechaIngreso?: string;
  activo: boolean;
}

export interface Obra {
  id: string;
  nombre: string;
  descripcion: string;
  cliente: {
    nombre: string;
    apellido: string;
  };
  ubicacion: string;
  presupuesto: number;
  fechaInicio: string;
  estado: "planificacion" | "en_progreso" | "finalizada" | "cancelada";
}

export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
}

export interface ReporteVentas {
  id: string;
  mes: string;
  año: number;
  ventasTotales: number;
  ingresosBrutos: number;
  costosMateriales: number;
  gananciaNeeta: number;
  obrasCompletadas: number;
  clientesNuevos: number;
}