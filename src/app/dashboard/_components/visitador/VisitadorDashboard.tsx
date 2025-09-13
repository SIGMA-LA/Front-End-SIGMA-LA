'use client'

import { useState } from 'react'
import {
  Calendar,
  CheckCircle,
  Mail,
  MapPin,
  Phone,
  User as UserIcon,
} from 'lucide-react'
import type { Usuario, Visita } from '@/types'
import { useGlobalContext } from '@/context/GlobalContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'
import { useAuth } from '@/context/AuthContext'

// Funciones de ayuda que podemos mantener aquí
const getTipoText = (tipo: string) =>
  ({
    inspeccion: 'Inspección',
    medicion: 'Medición',
    seguimiento: 'Seguimiento',
    entrega: 'Entrega',
  })[tipo] || tipo

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

export default function VisitadorDashboard() {
  const { usuario } = useAuth()
  const [selectedVisita, setSelectedVisita] = useState<Visita | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [observacionesFinal, setObservacionesFinal] = useState('')

  const { visitas, finalizarVisita } = useGlobalContext()

  const handleFinalizarVisita = () => {
    if (selectedVisita) {
      finalizarVisita(selectedVisita.id, observacionesFinal)
      setShowConfirmModal(false)
      // Actualizamos la visita seleccionada para que el estado se refleje inmediatamente
      setSelectedVisita({ ...selectedVisita, estado: 'completada' })
      setObservacionesFinal('')
    }
  }

  if (!usuario) {
    return <div>Cargando datos del usuario...</div>
  }

  const visitasAsignadas = visitas.filter(
    (v) => v.visitadorAsignado === `${usuario.nombre} ${usuario.apellido}`
  )
  const visitasPendientes = visitasAsignadas.filter(
    (v) => v.estado === 'programada'
  )
  const visitasRealizadas = visitasAsignadas.filter(
    (v) => v.estado === 'completada'
  )

  return (
    <div className="flex h-screen flex-col">
      <div
        className="flex flex-1 overflow-hidden"
        style={{ height: 'calc(100vh - 80px)' }}
      >
        <aside className="w-96 flex-shrink-0 space-y-6 overflow-y-auto border-r border-gray-200 bg-white">
          <div className="px-3">
            <div className="mb-3 flex items-center space-x-2 px-1 pt-2">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
              <h2 className="text-sm font-semibold tracking-wider text-gray-700 uppercase">
                Visitas Pendientes
              </h2>
            </div>
            <div className="space-y-2">
              {visitasPendientes.map((visita) => (
                <button
                  key={visita.id}
                  onClick={() => setSelectedVisita(visita)}
                  className={`w-full rounded-lg border p-3 text-left shadow-sm transition-colors ${
                    selectedVisita?.id === visita.id
                      ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-300'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-grow text-sm">
                      <p className="font-semibold text-gray-800">
                        {formatDate(visita.fecha)} - {visita.hora}hs -{' '}
                        {visita.obra.ubicacion.split(',')[0]}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {getTipoText(visita.tipo)}
                      </p>
                    </div>
                    <span className="rounded-md bg-blue-500 px-3 py-1 text-xs text-white">
                      Info
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="px-3">
            <div className="mb-3 flex items-center space-x-2 px-1">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
              <h2 className="text-sm font-semibold tracking-wider text-gray-700 uppercase">
                Visitas Realizadas
              </h2>
            </div>
            <div className="space-y-2">
              {visitasRealizadas.map((visita) => (
                <button
                  key={visita.id}
                  onClick={() => setSelectedVisita(visita)}
                  className={`w-full rounded-lg border p-3 text-left shadow-sm transition-colors ${
                    selectedVisita?.id === visita.id
                      ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-300'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-grow text-sm">
                      <p className="font-semibold text-gray-800">
                        {formatDate(visita.fecha)} - {visita.hora}hs -{' '}
                        {visita.obra.ubicacion.split(',')[0]}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {getTipoText(visita.tipo)}
                      </p>
                    </div>
                    <span className="rounded-md bg-gray-500 px-3 py-1 text-xs text-white">
                      Info
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1 overflow-y-auto p-6">
          {selectedVisita ? (
            <Card className="mx-auto max-w-3xl border-gray-200 bg-white shadow-lg">
              <CardContent className="space-y-6 p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Detalles de la Visita
                    </h3>
                    <p className="text-gray-500">
                      Cliente: {selectedVisita.obra.cliente.nombre}{' '}
                      {selectedVisita.obra.cliente.apellido}
                    </p>
                  </div>
                  <UserIcon className="h-12 w-12 text-gray-300" />
                </div>
                <div className="grid grid-cols-1 gap-4 border-t pt-6 text-sm md:grid-cols-2">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />{' '}
                    <span>{selectedVisita.obra.cliente.telefono}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />{' '}
                    <span>{selectedVisita.obra.cliente.email}</span>
                  </div>
                  <div className="col-span-2 flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />{' '}
                    <span>{selectedVisita.obra.ubicacion}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />{' '}
                    <span>
                      {formatDate(selectedVisita.fecha)} a las{' '}
                      {selectedVisita.hora}hs
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Observaciones</h4>
                  <p className="mt-1 rounded-md border bg-gray-50 p-3 text-gray-600">
                    {selectedVisita.observaciones}
                  </p>
                </div>
                <div className="flex space-x-4 border-t pt-6">
                  <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
                    <MapPin className="mr-2 h-4 w-4" /> Cómo llegar
                  </Button>
                  {selectedVisita.estado === 'programada' && (
                    <Button
                      onClick={() => setShowConfirmModal(true)}
                      className="flex-1 bg-green-600 text-white hover:bg-green-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" /> Finalizar visita
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex h-full items-center justify-center text-center text-gray-500">
              <div>
                <UserIcon className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                <p className="text-lg">
                  Selecciona una visita para ver los detalles
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Finalizar Visita
            </h3>
            <div className="mb-4">
              <Label htmlFor="observaciones-final">
                Observaciones finales (opcional)
              </Label>
              <Textarea
                id="observaciones-final"
                placeholder="Añade cualquier observación relevante..."
                value={observacionesFinal}
                onChange={(e) => setObservacionesFinal(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="mt-6 flex space-x-4">
              <Button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleFinalizarVisita}
                className="flex-1 bg-green-600 text-white hover:bg-green-700"
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
