"use client"

import { useState } from "react"
import {
  Calendar, CheckCircle, Clock, ExternalLink, FileText, Mail, MapPin, Package, Phone, Truck,
} from "lucide-react"
import type { Usuario, Entrega } from "@/types"
import { useGlobalContext } from "@/context/GlobalContext"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Textarea } from "@/components/ui/Textarea"
import { Label } from "@/components/ui/Label"
import { useAuth } from "@/context/AuthContext"


const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });

export default function EncargadoDashboardClient() {
  const { usuario } = useAuth();
  const [selectedEntrega, setSelectedEntrega] = useState<Entrega | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [observacionesFinal, setObservacionesFinal] = useState("")

  const { entregas, finalizarEntrega } = useGlobalContext()

  if (!usuario) {
    return <div>Cargando datos del usuario...</div>;
  }

  const handleFinalizarEntrega = () => {
    if (selectedEntrega) {
      finalizarEntrega(selectedEntrega.id, observacionesFinal)
      setShowConfirmModal(false)
      setSelectedEntrega({ ...selectedEntrega, estado: "entregada" })
      setObservacionesFinal("")
    }
  }

  // Ahora 'usuario.nombre' y 'usuario.apellido' funcionarán porque la prop se llama 'usuario'.
  const entregasAsignadas = entregas.filter((e) => e.encargadoAsignado === `${usuario.nombre} ${usuario.apellido}`)
  const entregasPendientes = entregasAsignadas.filter((e) => e.estado === "programada")
  const entregasRealizadas = entregasAsignadas.filter((e) => e.estado === "entregada")

  return (
    <div className="h-screen flex flex-col">

      <div className="flex flex-1 overflow-hidden">
        {/* Barra Lateral de Entregas */}
        <aside className="w-96 bg-white border-r border-gray-200 overflow-y-auto p-4 space-y-6 flex-shrink-0">
          <div>
            <div className="flex items-center space-x-2 mb-3 px-1">
              <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
              <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">Entregas Pendientes</h2>
            </div>
            <div className="space-y-2">
              {entregasPendientes.map((entrega) => (
                <button
                  key={entrega.id}
                  onClick={() => setSelectedEntrega(entrega)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors shadow-sm ${
                    selectedEntrega?.id === entrega.id
                      ? "bg-orange-50 border-orange-400 ring-2 ring-orange-300"
                      : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="text-sm flex-grow">
                      <p className="font-semibold text-gray-800">{formatDate(entrega.fecha)} - {entrega.hora}hs - {entrega.obra.ubicacion.split(",")[0]}</p>
                    </div>
                    <span className="text-white text-xs px-3 py-1 rounded-md bg-orange-500">Info</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-3 px-1">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
              <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">Entregas Realizadas</h2>
            </div>
            <div className="space-y-2">
              {entregasRealizadas.map((entrega) => (
                <button
                  key={entrega.id}
                  onClick={() => setSelectedEntrega(entrega)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors shadow-sm ${
                    selectedEntrega?.id === entrega.id
                      ? "bg-green-50 border-green-400 ring-2 ring-green-300"
                      : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="text-sm flex-grow">
                      <p className="font-semibold text-gray-800">{formatDate(entrega.fecha)} - {entrega.hora}hs - {entrega.obra.ubicacion.split(",")[0]}</p>
                    </div>
                    <span className="text-white text-xs px-3 py-1 rounded-md bg-gray-500">Info</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
          {selectedEntrega ? (
            <Card className="max-w-3xl mx-auto bg-white shadow-lg border-gray-200">
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Detalles de la Entrega</h3>
                    <p className="text-gray-500">Cliente: {selectedEntrega.obra.cliente.nombre}</p>
                  </div>
                  <Truck className="w-12 h-12 text-gray-300" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-t pt-6">
                    <div className="flex items-center space-x-3"><Phone className="w-5 h-5 text-gray-400" /> <span>{selectedEntrega.obra.cliente.telefono}</span></div>
                    <div className="flex items-center space-x-3"><Mail className="w-5 h-5 text-gray-400" /> <span>{selectedEntrega.obra.cliente.email}</span></div>
                    <div className="flex items-center space-x-3 col-span-2"><MapPin className="w-5 h-5 text-gray-400" /> <span>{selectedEntrega.direccionEntrega}</span></div>
                    <div className="flex items-center space-x-3"><Calendar className="w-5 h-5 text-gray-400" /> <span>{formatDate(selectedEntrega.fecha)} a las {selectedEntrega.hora}hs</span></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Productos</h4>
                  <ul className="space-y-1 text-gray-600 list-disc list-inside p-3 bg-gray-50 rounded-md border">
                    {selectedEntrega.productos.map((producto, index) => (
                      <li key={index}>{producto}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Observaciones</h4>
                  <p className="text-gray-600 mt-1 p-3 bg-gray-50 rounded-md border">{selectedEntrega.observaciones}</p>
                </div>
                <div className="flex space-x-4 pt-6 border-t">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"><MapPin className="w-4 h-4 mr-2" /> Ruta de Entrega</Button>
                  {selectedEntrega.estado === "programada" && (
                    <Button onClick={() => setShowConfirmModal(true)} className="flex-1 bg-green-600 hover:bg-green-700 text-white"><CheckCircle className="w-4 h-4 mr-2" /> Finalizar Entrega</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full text-center text-gray-500">
              <div>
                <Truck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Selecciona una entrega para ver los detalles</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Finalizar Entrega</h3>
            <div className="mb-4">
              <Label htmlFor="observaciones-final">Observaciones finales (opcional)</Label>
              <Textarea id="observaciones-final" placeholder="Añade cualquier observación relevante..." value={observacionesFinal} onChange={(e) => setObservacionesFinal(e.target.value)} className="mt-1"/>
            </div>
            <div className="flex space-x-4 mt-6">
              <Button onClick={() => setShowConfirmModal(false)} className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300">Cancelar</Button>
              <Button onClick={handleFinalizarEntrega} className="flex-1 bg-green-600 hover:bg-green-700 text-white">Confirmar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}