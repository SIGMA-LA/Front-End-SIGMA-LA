export interface Cliente {
  id: number
  nombre: string
  apellido: string
  telefono: string
  email: string
}

export interface Obra {
  id: number
  cliente: Cliente
  ubicacion: string
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

export interface User {
  id: number
  nombre: string
  apellido: string
  rol: "Administrador" | "Coordinación" | "Encargado" | "Visitador"
}