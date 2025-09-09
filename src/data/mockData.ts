import type { Usuario, Obra, Cliente, ReporteVentas } from "@/types";

export const mockUsuarios: Usuario[] = [
  { id: "1", nombre: "Juan", apellido: "Perez", email: "juan@test.com", rol: "coordinacion", activo: true, fechaIngreso: "2023-01-15" },
  { id: "2", nombre: "Carlos", apellido: "Mendoza", email: "admin@sigma-la.com", rol: "admin", activo: true, fechaIngreso: "2022-01-01" },
  { id: "3", nombre: "Carlos", apellido: "Rodriguez", email: "carlos@test.com", rol: "visitador", activo: true, fechaIngreso: "2023-03-10" },
  { id: "4", nombre: "Ana", apellido: "Lopez", email: "ana@test.com", rol: "encargado", activo: true, fechaIngreso: "2023-04-05" },
  { id: "5", nombre: "Pedro", apellido: "Martinez", email: "pedro@test.com", rol: "visitador", activo: true, fechaIngreso: "2023-05-12" },
  { id: "6", nombre: "Laura", apellido: "Sanchez", email: "laura@test.com", rol: "coordinacion", activo: false, fechaIngreso: "2023-06-22" },
];

export const mockObras: Obra[] = [
    { id: '1', nombre: 'Residencia Palmeras', cliente: { nombre: 'Lucia', apellido: 'Fernandez' }, descripcion: 'Construcción completa', estado: 'en_progreso', fechaInicio: '2024-03-15', presupuesto: 15000000, ubicacion: 'Nordelta' },
    { id: '2', nombre: 'Oficinas Central Corp', cliente: { nombre: 'Marcos', apellido: 'Gimenez' }, descripcion: 'Remodelación de interiores', estado: 'en_progreso', fechaInicio: '2024-04-01', presupuesto: 8500000, ubicacion: 'Puerto Madero' },
    { id: '3', nombre: 'Proyecto Z', cliente: { nombre: 'Test', apellido: 'Test' }, descripcion: 'Remodelación', estado: 'finalizada', fechaInicio: '2024-01-01', presupuesto: 1000, ubicacion: 'Test' },
];

export const mockClientes: Cliente[] = [
    { id: '1', nombre: 'Lucia', apellido: 'Fernandez' },
    { id: '2', nombre: 'Marcos', apellido: 'Gimenez' },
    { id: '3', nombre: 'Empresa ABC', apellido: '' },
    { id: '4', nombre: 'Estudio de Arquitectura', apellido: 'Moderno' },
];

export const mockReportesVentas: ReporteVentas[] = [
  { id: "1", mes: "Enero", año: 2024, ventasTotales: 15, ingresosBrutos: 1430000, costosMateriales: 600000, gananciaNeeta: 830000, obrasCompletadas: 3, clientesNuevos: 2 },
  { id: "2", mes: "Febrero", año: 2024, ventasTotales: 18, ingresosBrutos: 1600000, costosMateriales: 750000, gananciaNeeta: 850000, obrasCompletadas: 4, clientesNuevos: 3 },
  { id: "3", mes: "Marzo", año: 2024, ventasTotales: 22, ingresosBrutos: 1925000, costosMateriales: 850000, gananciaNeeta: 1075000, obrasCompletadas: 5, clientesNuevos: 4 },
  { id: "4", mes: "Abril", año: 2024, ventasTotales: 20, ingresosBrutos: 1800000, costosMateriales: 800000, gananciaNeeta: 1000000, obrasCompletadas: 4, clientesNuevos: 3 },
  { id: "5", mes: "Mayo", año: 2024, ventasTotales: 25, ingresosBrutos: 2100000, costosMateriales: 950000, gananciaNeeta: 1150000, obrasCompletadas: 6, clientesNuevos: 5 },
  { id: "6", mes: "Junio", año: 2024, ventasTotales: 28, ingresosBrutos: 4750000, costosMateriales: 1200000, gananciaNeeta: 3550000, obrasCompletadas: 7, clientesNuevos: 6 },
];