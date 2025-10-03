'use client'

import { useState, useEffect } from 'react'
import {
  Calendar,
  CheckCircle,
  Mail,
  MapPin,
  Phone,
  User as UserIcon,
  Package,
  Truck,
} from 'lucide-react'
import type { Visita, Entrega } from '@/types'
import { useGlobalContext } from '@/context/GlobalContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'
import { useAuth } from '@/context/AuthContext'
import { entregasService } from '@/services/entregas.service'

// Funciones de ayuda que podemos mantener aquí
const getTipoText = (tipo: string) =>
  ({
    inspeccion: 'Inspección',
    medicion: 'Medición',
    seguimiento: 'Seguimiento',
    entrega: 'Entrega',
  })[tipo] || tipo

const getEstadoText = (estado: string) =>
  ({
    ENTREGADA: 'Entregada',
    'EN CURSO': 'En Curso',
    CANCELADA: 'Cancelada',
    PENDIENTE: 'Pendiente',
  })[estado] || estado

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

export default function VisitadorDashboard() {
  const { usuario } = useAuth()
  const [selectedVisita, setSelectedVisita] = useState<Visita | null>(null)
  const [selectedEntrega, setSelectedEntrega] = useState<Entrega | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [observacionesFinal, setObservacionesFinal] = useState('')
  const [activeTab, setActiveTab] = useState<'visitas' | 'entregas'>('visitas')

  // Estados para entregas cargadas desde la API
  const [entregasPendientesAPI, setEntregasPendientesAPI] = useState<Entrega[]>(
    []
  )
  const [entregasEntregadasAPI, setEntregasEntregadasAPI] = useState<Entrega[]>(
    []
  )
  const [loadingEntregas, setLoadingEntregas] = useState(false)
  const [errorEntregas, setErrorEntregas] = useState<string | null>(null)

  const { visitas, entregas, finalizarVisita, finalizarEntrega } =
    useGlobalContext()

  // Función para cargar entregas desde la API
  const cargarEntregasDesdeAPI = async () => {
    if (!usuario?.cuil) return

    setLoadingEntregas(true)
    setErrorEntregas(null)

    try {
      const [pendientes, entregadas] = await Promise.all([
        entregasService.getEntregasPendientes(usuario.cuil),
        entregasService.getEntregasEntregadas(usuario.cuil),
      ])

      setEntregasPendientesAPI(pendientes)
      setEntregasEntregadasAPI(entregadas)
    } catch (error) {
      console.error('Error al cargar entregas desde la API:', error)
      setErrorEntregas('Error al cargar las entregas')
    } finally {
      setLoadingEntregas(false)
    }
  }

  // Cargar entregas al montar el componente o cuando cambie el usuario
  useEffect(() => {
    if (usuario?.cuil) {
      cargarEntregasDesdeAPI()
    }
  }, [usuario?.cuil])

  const handleFinalizarVisita = () => {
    if (selectedVisita) {
      finalizarVisita(selectedVisita.id, observacionesFinal)
      setShowConfirmModal(false)
      setSelectedVisita({ ...selectedVisita, estado: 'completada' })
      setObservacionesFinal('')
    }
  }

  const handleFinalizarEntrega = async () => {
    if (selectedEntrega) {
      try {
        // Usar el servicio de entregas para finalizar
        await entregasService.finalizarEntrega(
          selectedEntrega.id,
          observacionesFinal
        )

        // También usar la función del contexto global para mantener compatibilidad
        finalizarEntrega(selectedEntrega.id, observacionesFinal)

        // Actualizar el estado local
        const entregaFinalizada = {
          ...selectedEntrega,
          estado: 'ENTREGADA' as const,
        }
        setSelectedEntrega(entregaFinalizada)

        // Recargar las entregas desde la API para reflejar los cambios
        await cargarEntregasDesdeAPI()

        setShowConfirmModal(false)
        setObservacionesFinal('')
      } catch (error) {
        console.error('Error al finalizar entrega:', error)
        // Mostrar error al usuario
        setErrorEntregas('Error al finalizar la entrega')
      }
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

  // Usar las entregas de la API si están disponibles, sino usar las del contexto como fallback
  const entregasAsignadas =
    entregasPendientesAPI.length > 0 || entregasEntregadasAPI.length > 0
      ? [...entregasPendientesAPI, ...entregasEntregadasAPI]
      : entregas.filter(
          (e) => e.encargadoAsignado === `${usuario.nombre} ${usuario.apellido}`
        )

  const entregasPendientes =
    entregasPendientesAPI.length > 0
      ? entregasPendientesAPI
      : entregasAsignadas.filter(
          (e) => e.estado === 'PENDIENTE' || e.estado === 'EN CURSO'
        )

  const entregasRealizadas =
    entregasEntregadasAPI.length > 0
      ? entregasEntregadasAPI
      : entregasAsignadas.filter((e) => e.estado === 'ENTREGADA')

  return (
    <div className="flex h-screen flex-col">
      <div
        className="flex flex-1 overflow-hidden"
        style={{ height: 'calc(100vh - 80px)' }}
      >
        <aside className="w-96 flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white">
          {/* Pestañas */}
          <div className="border-b border-gray-200 px-3 pt-4">
            <div className="flex space-x-1">
              <button
                onClick={() => {
                  setActiveTab('visitas')
                  setSelectedVisita(null)
                  setSelectedEntrega(null)
                }}
                className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'visitas'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <UserIcon className="h-4 w-4" />
                <span>Visitas</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('entregas')
                  setSelectedVisita(null)
                  setSelectedEntrega(null)
                }}
                className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'entregas'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Package className="h-4 w-4" />
                <span>Entregas</span>
              </button>
            </div>
          </div>

          {/* Contenido de las pestañas */}
          <div className="space-y-6 p-3">
            {activeTab === 'visitas' ? (
              <>
                <div>
                  <div className="mb-3 flex items-center space-x-2 px-1">
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                    <h2 className="text-sm font-semibold tracking-wider text-gray-700 uppercase">
                      Visitas Pendientes
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {visitasPendientes.map((visita) => (
                      <button
                        key={visita.id}
                        onClick={() => {
                          setSelectedVisita(visita)
                          setSelectedEntrega(null)
                        }}
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
                              {visita.obra.direccion.split(',')[0]}
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
                <div>
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
                        onClick={() => {
                          setSelectedVisita(visita)
                          setSelectedEntrega(null)
                        }}
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
                              {visita.obra.direccion.split(',')[0]}
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
              </>
            ) : (
              <>
                <div>
                  <div className="mb-3 flex items-center justify-between px-1">
                    <div className="flex items-center space-x-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-orange-500"></div>
                      <h2 className="text-sm font-semibold tracking-wider text-gray-700 uppercase">
                        Entregas Pendientes
                      </h2>
                    </div>
                    {loadingEntregas && (
                      <div className="text-xs text-gray-500">Cargando...</div>
                    )}
                  </div>
                  {errorEntregas && (
                    <div className="mb-2 rounded-md border border-red-200 bg-red-50 p-2">
                      <p className="text-xs text-red-600">{errorEntregas}</p>
                      <button
                        onClick={cargarEntregasDesdeAPI}
                        className="mt-1 text-xs text-red-700 underline hover:text-red-800"
                      >
                        Reintentar
                      </button>
                    </div>
                  )}
                  <div className="space-y-2">
                    {loadingEntregas ? (
                      <div className="py-4 text-center text-sm text-gray-500">
                        Cargando entregas...
                      </div>
                    ) : entregasPendientes.length === 0 ? (
                      <div className="py-4 text-center text-sm text-gray-500">
                        No hay entregas pendientes
                      </div>
                    ) : (
                      entregasPendientes.map((entrega) => (
                        <button
                          key={entrega.id}
                          onClick={() => {
                            setSelectedEntrega(entrega)
                            setSelectedVisita(null)
                          }}
                          className={`w-full rounded-lg border p-3 text-left shadow-sm transition-colors ${
                            selectedEntrega?.id === entrega.id
                              ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-300'
                              : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-grow text-sm">
                              <p className="font-semibold text-gray-800">
                                {formatDate(entrega.fecha)} - {entrega.hora}hs -{' '}
                                {entrega.direccionEntrega.split(',')[0]}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                {getEstadoText(entrega.estado)}
                              </p>
                            </div>
                            <span className="rounded-md bg-orange-500 px-3 py-1 text-xs text-white">
                              Info
                            </span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
                <div>
                  <div className="mb-3 flex items-center space-x-2 px-1">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                    <h2 className="text-sm font-semibold tracking-wider text-gray-700 uppercase">
                      Entregas Realizadas
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {entregasRealizadas.length === 0 ? (
                      <div className="py-4 text-center text-sm text-gray-500">
                        No hay entregas realizadas
                      </div>
                    ) : (
                      entregasRealizadas.map((entrega) => (
                        <button
                          key={entrega.id}
                          onClick={() => {
                            setSelectedEntrega(entrega)
                            setSelectedVisita(null)
                          }}
                          className={`w-full rounded-lg border p-3 text-left shadow-sm transition-colors ${
                            selectedEntrega?.id === entrega.id
                              ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-300'
                              : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-grow text-sm">
                              <p className="font-semibold text-gray-800">
                                {formatDate(entrega.fecha)} - {entrega.hora}hs -{' '}
                                {entrega.direccionEntrega.split(',')[0]}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                {getEstadoText(entrega.estado)}
                              </p>
                            </div>
                            <span className="rounded-md bg-gray-500 px-3 py-1 text-xs text-white">
                              Info
                            </span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
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
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span>{selectedVisita.obra.cliente.telefono}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span>{selectedVisita.obra.cliente.email}</span>
                  </div>
                  <div className="col-span-2 flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span>{selectedVisita.obra.direccion}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
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
          ) : selectedEntrega ? (
            <Card className="mx-auto max-w-3xl border-gray-200 bg-white shadow-lg">
              <CardContent className="space-y-6 p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      Detalles de la Entrega
                    </h3>
                    <p className="text-gray-500">
                      Cliente: {selectedEntrega.obra.cliente.nombre}{' '}
                      {selectedEntrega.obra.cliente.apellido}
                    </p>
                  </div>
                  <Package className="h-12 w-12 text-gray-300" />
                </div>
                <div className="grid grid-cols-1 gap-4 border-t pt-6 text-sm md:grid-cols-2">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span>{selectedEntrega.obra.cliente.telefono}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span>{selectedEntrega.obra.cliente.email}</span>
                  </div>
                  <div className="col-span-2 flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span>{selectedEntrega.direccionEntrega}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span>
                      {formatDate(selectedEntrega.fecha)} a las{' '}
                      {selectedEntrega.hora}hs
                    </span>
                  </div>
                  {selectedEntrega.vehiculo && (
                    <div className="flex items-center space-x-3">
                      <Truck className="h-5 w-5 text-gray-400" />
                      <span>{selectedEntrega.vehiculo}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Productos</h4>
                  <div className="mt-1 rounded-md border bg-gray-50 p-3">
                    {selectedEntrega.productos.map((producto, index) => (
                      <p key={index} className="text-gray-600">
                        • {producto}
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Observaciones</h4>
                  <p className="mt-1 rounded-md border bg-gray-50 p-3 text-gray-600">
                    {selectedEntrega.observaciones}
                  </p>
                </div>
                <div className="flex space-x-4 border-t pt-6">
                  <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
                    <MapPin className="mr-2 h-4 w-4" /> Cómo llegar
                  </Button>
                  {(selectedEntrega.estado === 'PENDIENTE' ||
                    selectedEntrega.estado === 'EN CURSO') && (
                    <Button
                      onClick={() => setShowConfirmModal(true)}
                      className="flex-1 bg-green-600 text-white hover:bg-green-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" /> Finalizar entrega
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex h-full items-center justify-center text-center text-gray-500">
              <div>
                {activeTab === 'visitas' ? (
                  <>
                    <UserIcon className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                    <p className="text-lg">
                      Selecciona una visita para ver los detalles
                    </p>
                  </>
                ) : (
                  <>
                    <Package className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                    <p className="text-lg">
                      Selecciona una entrega para ver los detalles
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              {selectedVisita ? 'Finalizar Visita' : 'Finalizar Entrega'}
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
                onClick={
                  selectedVisita
                    ? handleFinalizarVisita
                    : handleFinalizarEntrega
                }
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
