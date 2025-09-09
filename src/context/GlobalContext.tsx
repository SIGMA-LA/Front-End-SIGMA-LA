"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import type { Visita, Entrega } from "../types"

const hardcodedVisitas: Visita[] = [
  {
    id: 1,
    obra: {
      id: 101,
      cliente: { id: 201, nombre: "Ana", apellido: "García", telefono: "221-555-1111", email: "ana.garcia@example.com" },
      ubicacion: "La Plata, Calle 47 n° 834",
    },
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
    obra: {
      id: 102,
      cliente: { id: 202, nombre: "Marcos", apellido: "Di Paolo", telefono: "221-555-2222", email: "marcos.dipaolo@example.com" },
      ubicacion: "City Bell, Calle 13c n° 4512",
    },
    fecha: "2025-09-15",
    hora: "11:30",
    tipo: "medicion",
    estado: "programada",
    visitadorAsignado: "Carlchen Gugliermino",
    observaciones: "Realizar mediciones del terreno para el nuevo proyecto. Se requiere cinta métrica láser.",
  },
  {
    id: 3,
    obra: {
      id: 103,
      cliente: { id: 203, nombre: "Lucía", apellido: "Fernández", telefono: "221-555-3333", email: "lucia.f@example.com" },
      ubicacion: "Gonnet, Calle 501 n° 1980",
    },
    fecha: "2025-09-16",
    hora: "14:00",
    tipo: "seguimiento",
    estado: "programada",
    visitadorAsignado: "Carlchen Gugliermino",
    observaciones: "Seguimiento del avance de la obra. Tomar fotografías del estado actual y comparar con el cronograma.",
  },
  {
    id: 4,
    obra: {
      id: 104,
      cliente: { id: 204, nombre: "Javier", apellido: "Sosa", telefono: "221-555-4444", email: "javier.sosa@example.com" },
      ubicacion: "Villa Elisa, Camino Centenario km 15",
    },
    fecha: "2025-09-17",
    hora: "10:00",
    tipo: "entrega",
    estado: "programada",
    visitadorAsignado: "Carlchen Gugliermino",
    observaciones: "Entrega de materiales de la fase 2. Coordinar con el encargado de la obra para la recepción.",
  },
  {
    id: 5,
    obra: {
      id: 105,
      cliente: { id: 205, nombre: "Carla", apellido: "Rizzo", telefono: "221-555-5555", email: "carla.rizzo@example.com" },
      ubicacion: "Ensenada, Av. Costanera 45",
    },
    fecha: "2025-09-10",
    hora: "09:30",
    tipo: "inspeccion",
    estado: "completada",
    visitadorAsignado: "Carlchen Gugliermino",
    observaciones: "La inspección se completó exitosamente. No se encontraron problemas estructurales. El cliente fue notificado.",
  },
  {
    id: 6,
    obra: {
      id: 106,
      cliente: { id: 206, nombre: "Roberto", apellido: "Gómez", telefono: "221-555-6666", email: "roberto.gomez@example.com" },
      ubicacion: "Berisso, Calle Nueva York",
    },
    fecha: "2025-09-11",
    hora: "15:00",
    tipo: "medicion",
    estado: "completada",
    visitadorAsignado: "Carlchen Gugliermino",
    observaciones: "Mediciones finales realizadas y entregadas al equipo de diseño. Todo conforme a los planos.",
  },

  {
    id: 7,
    obra: {
      id: 107,
      cliente: { id: 207, nombre: "Laura", apellido: "Martínez", telefono: "221-555-7777", email: "laura.m@example.com" },
      ubicacion: "Tolosa, Calle 1 n° 740",
    },
    fecha: "2025-09-15",
    hora: "16:00",
    tipo: "seguimiento",
    estado: "programada",
    visitadorAsignado: "Franco Zariaga",
    observaciones: "Esta visita no debería ser visible para el usuario Juan Pérez.",
  },
]

const hardcodedEntregas: Entrega[] = [
  {
    id: 1,
    obra: { id: 301, cliente: { id: 401, nombre: "Empresa Constructora SRL", apellido: "", telefono: "221-555-8888", email: "compras@constructora.com" }, ubicacion: "Parque Industrial La Plata" },
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
    obra: { id: 302, cliente: { id: 402, nombre: "Edificio Central", apellido: "", telefono: "221-555-9999", email: "admin@edificiocentral.com" }, ubicacion: "La Plata, Calle 10 n° 567" },
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
    obra: { id: 303, cliente: { id: 403, nombre: "Barrio Privado Los Robles", apellido: "", telefono: "221-555-0000", email: "seguridad@losrobles.com" }, ubicacion: "Ruta 2, km 45" },
    fecha: "2025-09-12",
    hora: "14:30",
    estado: "entregada",
    encargadoAsignado: "Diego Lezcano",
    productos: ["100m² de césped en panes"],
    direccionEntrega: "Ruta 2, km 45 (Portería principal)",
    observaciones: "Entrega realizada y firmada por el intendente del barrio. Sin problemas.",
  }
]

interface GlobalContextType {
  visitas: Visita[]
  finalizarVisita: (visitaId: number, observaciones: string) => void
  entregas: Entrega[]
  finalizarEntrega: (entregaId: number, observaciones: string) => void
}
const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [visitas, setVisitas] = useState<Visita[]>(hardcodedVisitas)
  const [entregas, setEntregas] = useState<Entrega[]>(hardcodedEntregas)

  const finalizarVisita = (visitaId: number, observacionesFinales: string) => {
    setVisitas((prevVisitas) =>
      prevVisitas.map((visita) =>
        visita.id === visitaId
          ? {
              ...visita,
              estado: "completada",
              observaciones: `${visita.observaciones}\n\nObservación final: ${observacionesFinales}`,
            }
          : visita
      )
    )
  }

  const finalizarEntrega = (entregaId: number, observacionesFinales: string) => {
    setEntregas((prevEntregas) =>
      prevEntregas.map((entrega) =>
        entrega.id === entregaId
          ? {
              ...entrega,
              estado: "entregada",
              observaciones: `${entrega.observaciones}\n\nObservación final: ${observacionesFinales}`,
            }
          : entrega
      )
    )
  }

  return (
    <GlobalContext.Provider value={{ visitas, finalizarVisita, entregas, finalizarEntrega }}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => {
  const context = useContext(GlobalContext)
  if (context === undefined) {
    throw new Error("useGlobalContext debe ser usado dentro de un GlobalProvider")
  }
  return context
}