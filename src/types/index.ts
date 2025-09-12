export interface Cliente {
  id: number
  nombre: string
  apellido: string
  telefono: string
  email: string
}

export interface Documento {
  id: number
  nombre: string
  url: string
}

export interface Visita {
  id: number
  obra: Obra
  fecha: string
  hora: string
  tipo: "inspeccion" | "medicion" | "seguimiento" | "entrega"
  estado: "programada" | "completada" | "cancelada"
  visitadorAsignado: string
  observaciones: string
  vehiculo?: string
  documentos?: Documento[]
}

export interface Entrega {
  id: number
  obra: Obra
  fecha: string
  hora: string
  estado: "programada" | "en_transito" | "entregada" | "cancelada"
  encargadoAsignado: string
  productos: string[]
  direccionEntrega: string
  observaciones: string
  vehiculo?: string
  documentos?: Documento[]
}

export interface Usuario {
  id: number;
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
  contraseña?: string;
}

export interface Obra {
  id: number;
  nombre: string;
  descripcion: string;
  cliente: {
    id: number
    nombre: string
    apellido: string
    telefono: string
    email: string
  };
  ubicacion: string;
  presupuesto: number;
  fechaInicio: string;
  estado: "planificacion" | "en_progreso" | "finalizada" | "cancelada";
}

export interface ReporteVentas {
  id: number;
  mes: string;
  año: number;
  ventasTotales: number;
  ingresosBrutos: number;
  costosMateriales: number;
  gananciaNeeta: number;
  obrasCompletadas: number;
  clientesNuevos: number;
}