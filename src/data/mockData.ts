import type { Usuario, Obra, Cliente, ReporteVentas, Entrega, Visita, Vehiculo } from "@/types";

export const mockUsuarios: Usuario[] = [
  { id: 1, nombre: "Juan", apellido: "Perez", email: "juan@test.com", rol: "coordinacion", activo: true, fechaIngreso: "2023-01-15", contraseña: "123456" },
  { id: 2, nombre: "Carlos", apellido: "Mendoza", email: "admin@sigma-la.com", rol: "admin", activo: true, fechaIngreso: "2022-01-01", contraseña: "123456" },
  { id: 3, nombre: "Carlos", apellido: "Rodriguez", email: "carlos@test.com", rol: "visitador", activo: true, fechaIngreso: "2023-03-10", contraseña: "123456" },
  { id: 4, nombre: "Ana", apellido: "Lopez", email: "ana@test.com", rol: "encargado", activo: true, fechaIngreso: "2023-04-05", contraseña: "123456" },
  { id: 5, nombre: "Pedro", apellido: "Martinez", email: "pedro@test.com", rol: "visitador", activo: true, fechaIngreso: "2023-05-12", contraseña: "123456" },
  { id: 6, nombre: "Laura", apellido: "Sanchez", email: "laura@test.com", rol: "coordinacion", activo: false, fechaIngreso: "2023-06-22", contraseña: "123456" },
  { id: 7, nombre: "Diego", apellido: "Lezcano", email: "diegodev@test.com", rol: "encargado", activo: true, fechaIngreso: "2024-02-20", contraseña: "123456" },
  { id: 8, nombre: "Carlchen", apellido: "Gugliermino", email: "carlchengugliermino@test.com", rol: "visitador", activo: true, fechaIngreso: "2024-02-20", contraseña: "123456" },
];

export const mockObras: Obra[] = [
    { id: 1, nombre: 'Residencia Palmeras', cliente: { id: 1, nombre: 'Lucia', apellido: 'Fernandez', telefono: '221-555-1234', email: 'lucia@test.com' }, descripcion: 'Construcción completa', estado: 'en_progreso', fechaInicio: '2024-03-15', presupuesto: 15000000, ubicacion: 'Nordelta' },
    { id: 2, nombre: 'Oficinas Central Corp', cliente: { id: 2, nombre: 'Marcos', apellido: 'Gimenez', telefono: '221-555-5678', email: 'marcos@test.com' }, descripcion: 'Remodelación de interiores', estado: 'en_progreso', fechaInicio: '2024-04-01', presupuesto: 8500000, ubicacion: 'Puerto Madero' },
    { id: 3, nombre: 'Proyecto Z', cliente: { id: 3, nombre: 'Test', apellido: 'Test', telefono: '221-555-9876', email: 'test@test.com' }, descripcion: 'Remodelación', estado: 'finalizada', fechaInicio: '2024-01-01', presupuesto: 1000, ubicacion: 'Test' },
];

export const mockClientes: Cliente[] = [
    { id: 1, nombre: 'Lucia', apellido: 'Fernandez', telefono: '221-555-1234', email: 'lucia@test.com' },
    { id: 2, nombre: 'Marcos', apellido: 'Gimenez', telefono: '221-555-5678', email: 'marcos@test.com' },
    { id: 3, nombre: 'Empresa ABC', apellido: '', telefono: '221-555-9876', email: 'empresa@abc.com' },
    { id: 4, nombre: 'Estudio de Arquitectura', apellido: 'Moderno', telefono: '221-555-6543', email: 'estudio@arquitectura.com' },
];

export const mockReportesVentas: ReporteVentas[] = [
  { id: 1, mes: "Enero", año: 2024, ventasTotales: 15, ingresosBrutos: 1430000, costosMateriales: 600000, gananciaNeeta: 830000, obrasCompletadas: 3, clientesNuevos: 2 },
  { id: 2, mes: "Febrero", año: 2024, ventasTotales: 18, ingresosBrutos: 1600000, costosMateriales: 750000, gananciaNeeta: 850000, obrasCompletadas: 4, clientesNuevos: 3 },
  { id: 3, mes: "Marzo", año: 2024, ventasTotales: 22, ingresosBrutos: 1925000, costosMateriales: 850000, gananciaNeeta: 1075000, obrasCompletadas: 5, clientesNuevos: 4 },
  { id: 4, mes: "Abril", año: 2024, ventasTotales: 20, ingresosBrutos: 1800000, costosMateriales: 800000, gananciaNeeta: 1000000, obrasCompletadas: 4, clientesNuevos: 3 },
  { id: 5, mes: "Mayo", año: 2024, ventasTotales: 25, ingresosBrutos: 2100000, costosMateriales: 950000, gananciaNeeta: 1150000, obrasCompletadas: 6, clientesNuevos: 5 },
  { id: 6, mes: "Junio", año: 2024, ventasTotales: 28, ingresosBrutos: 4750000, costosMateriales: 1200000, gananciaNeeta: 3550000, obrasCompletadas: 7, clientesNuevos: 6 },
];

export const mockEntregas: Entrega[] = [
  {
    id: 1,
    obra:{ id: 2, nombre: 'Oficinas Central Corp', cliente: { id: 2, nombre: 'Marcos', apellido: 'Gimenez', telefono: '221-555-5678', email: 'marcos@test.com' }, descripcion: 'Remodelación de interiores', estado: 'en_progreso', fechaInicio: '2024-04-01', presupuesto: 8500000, ubicacion: 'Puerto Madero' },
    fecha: "2025-09-18",
    hora: "09:00",
    estado: "programada",
    encargadoAsignado: "Diego Lezcano",
    productos: ["200 bolsas de cemento", "50 varillas de acero 10mm", "10 rollos de membrana"],
    direccionEntrega: "Parque Industrial La Plata, Lote 24",
    observaciones: "Coordinar con el jefe de obra, Sr. Ramírez. Se requiere montacargas para la descarga.",
    vehiculo: "Camión Iveco (Patente AE456FG)"
  },
  {
    id: 2,
    obra: { id: 1, nombre: 'Residencia Palmeras', cliente: { id: 1, nombre: 'Lucia', apellido: 'Fernandez', telefono: '221-555-1234', email: 'lucia@test.com' }, descripcion: 'Construcción completa', estado: 'en_progreso', fechaInicio: '2024-03-15', presupuesto: 15000000, ubicacion: 'Nordelta' },
    fecha: "2025-09-19",
    hora: "11:00",
    estado: "programada",
    encargadoAsignado: "Diego Lezcano",
    productos: ["50 cajas de cerámicos", "10 bolsas de pegamento Klaukol"],
    direccionEntrega: "La Plata, Calle 10 n° 567 (Entrada de servicio)",
    observaciones: "Entregar en horario, el ascensor de carga está reservado.",
  },
  {
    id: 3,
    obra:{ id: 3, nombre: 'Proyecto Z', cliente: { id: 3, nombre: 'Test', apellido: 'Test', telefono: '221-555-9876', email: 'test@test.com' }, descripcion: 'Remodelación', estado: 'finalizada', fechaInicio: '2024-01-01', presupuesto: 1000, ubicacion: 'Test' },    fecha: "2025-09-12",
    hora: "14:30",
    estado: "entregada",
    encargadoAsignado: "Diego Lezcano",
    productos: ["100m² de césped en panes"],
    direccionEntrega: "Ruta 2, km 45 (Portería principal)",
    observaciones: "Entrega realizada y firmada por el intendente del barrio. Sin problemas.",
  }
]

export const mockVisitas: Visita[] = [
  {
    id: 1,
    obra: { id: 3, nombre: 'Proyecto Z', cliente: { id: 3, nombre: 'Test', apellido: 'Test', telefono: '221-555-9876', email: 'test@test.com' }, descripcion: 'Remodelación', estado: 'finalizada', fechaInicio: '2024-01-01', presupuesto: 1000, ubicacion: 'Test' },
    fecha: "2025-09-15",
    hora: "09:00",
    tipo: "inspeccion",
    estado: "programada",
    visitadorAsignado: "Carlchen Gugliermino",
    observaciones: "Inspección inicial de la estructura. Verificar estado de los cimientos y reportar cualquier anomalía visible.",
    vehiculo: "Ford Ranger (Patente AB123CD)",
  },
  {
    id: 2,
    obra: { id: 1, nombre: 'Residencia Palmeras', cliente: { id: 1, nombre: 'Lucia', apellido: 'Fernandez', telefono: '221-555-1234', email: 'lucia@test.com' }, descripcion: 'Construcción completa', estado: 'en_progreso', fechaInicio: '2024-03-15', presupuesto: 15000000, ubicacion: 'Nordelta' },
    fecha: "2025-09-15",
    hora: "11:30",
    tipo: "medicion",
    estado: "programada",
    visitadorAsignado: "Carlchen Gugliermino",
    observaciones: "Realizar mediciones del terreno para el nuevo proyecto. Se requiere cinta métrica láser.",
  },
  {
    id: 3,
    obra:{ id: 2, nombre: 'Oficinas Central Corp', cliente: { id: 2, nombre: 'Marcos', apellido: 'Gimenez', telefono: '221-555-5678', email: 'marcos@test.com' }, descripcion: 'Remodelación de interiores', estado: 'en_progreso', fechaInicio: '2024-04-01', presupuesto: 8500000, ubicacion: 'Puerto Madero' },
    fecha: "2025-09-16",
    hora: "14:00",
    tipo: "seguimiento",
    estado: "completada",
    visitadorAsignado: "Carlchen Gugliermino",
    observaciones: "Seguimiento del avance de la obra. Tomar fotografías del estado actual y comparar con el cronograma.",
  },
]

export const mockVehiculos: Vehiculo[] = [
  { id: "camioneta_ford", descripcion: "Camioneta ford"},
  { id: "camioneta_pick_up", descripcion: "Camioneta pick up"},
  { id: "camion_chico", descripcion: "Camión chico"},
  { id: "camion_grande", descripcion: "Camión grande"},
]

export const mockArquitectos = [
  { id: "1", nombre: "Aaron Bennett" },
  { id: "2", nombre: "Abbey Christensen" },
  { id: "3", nombre: "Alli Connors" },
]

export const mockVisitadores = [
  { id: "1", nombre: "Franco Zariaga" },
  { id: "2", nombre: "Nicolás Pedemonte" },
  { id: "3", nombre: "Carlos Gugliermino" },
]