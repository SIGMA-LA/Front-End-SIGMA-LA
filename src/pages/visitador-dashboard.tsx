"use client"

import { useState } from "react"
import {
  Calendar, CheckCircle, Clock, Mail, MapPin, Phone, User as UserIcon,
} from "lucide-react"
import type { User, Visita } from "../types"
import { useGlobalContext } from "../context/GlobalContext"
import { Button } from "../components/ui/Button"
import { Card, CardContent } from "../components/ui/Card"
import { Textarea } from "../components/ui/Textarea"
import { Label } from "../components/ui/Label"
import UnifiedHeader from "../components/UnifiedHeader"

interface VisitadorDashboardProps {
  user: User
  onLogout: () => void
}

// Funciones de ayuda que podemos mantener aquí
const getTipoText = (tipo: string) => ({
  inspeccion: "Inspección",
  medicion: "Medición",
  seguimiento: "Seguimiento",
  entrega: "Entrega",
}[tipo] || tipo);

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });

export default function VisitadorDashboard({ user, onLogout }: VisitadorDashboardProps) {
  const [selectedVisita, setSelectedVisita] = useState<Visita | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [observacionesFinal, setObservacionesFinal] = useState("")

  const { visitas, finalizarVisita } = useGlobalContext()

  const handleFinalizarVisita = () => {
    if (selectedVisita) {
      finalizarVisita(selectedVisita.id, observacionesFinal)
      setShowConfirmModal(false)
      // Actualizamos la visita seleccionada para que el estado se refleje inmediatamente
      setSelectedVisita({ ...selectedVisita, estado: "completada" })
      setObservacionesFinal("")
    }
  }

  const visitasAsignadas = visitas.filter((v) => v.visitadorAsignado === `${user.nombre} ${user.apellido}`)
  const visitasPendientes = visitasAsignadas.filter((v) => v.estado === "programada")
  const visitasRealizadas = visitasAsignadas.filter((v) => v.estado === "completada")

  return (
    <div className="h-screen flex flex-col">
      <UnifiedHeader user={user} onLogout={onLogout} />

      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 80px)" }}>
        <aside className="w-96 bg-white border-r border-gray-200 overflow-y-auto space-y-6 flex-shrink-0">
          <div>
            <div className="flex items-center space-x-2 mb-3 px-1">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
              <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">Visitas Pendientes</h2>
            </div>
            <div className="space-y-2">
              {visitasPendientes.map((visita) => (
                <button
                  key={visita.id}
                  onClick={() => setSelectedVisita(visita)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors shadow-sm ${
                    selectedVisita?.id === visita.id
                      ? "bg-blue-50 border-blue-400 ring-2 ring-blue-300"
                      : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="text-sm flex-grow">
                      <p className="font-semibold text-gray-800">{formatDate(visita.fecha)} - {visita.hora}hs - {visita.obra.ubicacion.split(",")[0]}</p>
                      <p className="text-xs text-gray-500 mt-1">{getTipoText(visita.tipo)}</p>
                    </div>
                    <span className="text-white text-xs px-3 py-1 rounded-md bg-blue-500">Info</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-3 px-1">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
              <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">Visitas Realizadas</h2>
            </div>
            <div className="space-y-2">
              {visitasRealizadas.map((visita) => (
                <button
                  key={visita.id}
                  onClick={() => setSelectedVisita(visita)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors shadow-sm ${
                    selectedVisita?.id === visita.id
                      ? "bg-blue-50 border-blue-400 ring-2 ring-blue-300"
                      : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="text-sm flex-grow">
                      <p className="font-semibold text-gray-800">{formatDate(visita.fecha)} - {visita.hora}hs - {visita.obra.ubicacion.split(",")[0]}</p>
                      <p className="text-xs text-gray-500 mt-1">{getTipoText(visita.tipo)}</p>
                    </div>
                    <span className="text-white text-xs px-3 py-1 rounded-md bg-gray-500">Info</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1 p-6 overflow-y-auto">
          {selectedVisita ? (
            <Card className="max-w-3xl mx-auto bg-white shadow-lg border-gray-200">
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Detalles de la Visita</h3>
                    <p className="text-gray-500">Cliente: {selectedVisita.obra.cliente.nombre} {selectedVisita.obra.cliente.apellido}</p>
                  </div>
                  <UserIcon className="w-12 h-12 text-gray-300" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-t pt-6">
                  <div className="flex items-center space-x-3"><Phone className="w-5 h-5 text-gray-400" /> <span>{selectedVisita.obra.cliente.telefono}</span></div>
                  <div className="flex items-center space-x-3"><Mail className="w-5 h-5 text-gray-400" /> <span>{selectedVisita.obra.cliente.email}</span></div>
                  <div className="flex items-center space-x-3 col-span-2"><MapPin className="w-5 h-5 text-gray-400" /> <span>{selectedVisita.obra.ubicacion}</span></div>
                  <div className="flex items-center space-x-3"><Calendar className="w-5 h-5 text-gray-400" /> <span>{formatDate(selectedVisita.fecha)} a las {selectedVisita.hora}hs</span></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Observaciones</h4>
                  <p className="text-gray-600 mt-1 p-3 bg-gray-50 rounded-md border">{selectedVisita.observaciones}</p>
                </div>
                <div className="flex space-x-4 pt-6 border-t">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"><MapPin className="w-4 h-4 mr-2" /> Cómo llegar</Button>
                  {selectedVisita.estado === "programada" && (
                    <Button onClick={() => setShowConfirmModal(true)} className="flex-1 bg-green-600 hover:bg-green-700 text-white"><CheckCircle className="w-4 h-4 mr-2" /> Finalizar visita</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full text-center text-gray-500">
              <div>
                <UserIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Selecciona una visita para ver los detalles</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Finalizar Visita</h3>
            <div className="mb-4">
              <Label htmlFor="observaciones-final">Observaciones finales (opcional)</Label>
              <Textarea id="observaciones-final" placeholder="Añade cualquier observación relevante..." value={observacionesFinal} onChange={(e) => setObservacionesFinal(e.target.value)} className="mt-1"/>
            </div>
            <div className="flex space-x-4 mt-6">
              <Button onClick={() => setShowConfirmModal(false)} className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300">Cancelar</Button>
              <Button onClick={handleFinalizarVisita} className="flex-1 bg-green-600 hover:bg-green-700 text-white">Confirmar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}