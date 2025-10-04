'use client'

import { useState } from 'react'
import { Calendar, Clock, User, Search, X, MapPin, Phone } from 'lucide-react'
import { mockObras } from '@/data/mockData'
import { CrearVisitaProps } from '@/types'
import { mockVisitadores } from '@/data/mockData'

export default function CrearVisita({
  onCancel,
  onSubmit,
  preloadedObra,
}: CrearVisitaProps) {
  const [formData, setFormData] = useState({
    fecha: '',
    hora: '',
    tipo: '',
    encargado: '',
    observaciones: '',
    // Campos específicos para visita inicial
    direccion: preloadedObra?.direccion || '',
    contacto: preloadedObra?.cliente?.telefono || '',
    // Obra seleccionada (si aplica)
    obraId: preloadedObra?.cod_obra || '',
    obraCliente: preloadedObra?.cliente ? `${preloadedObra.cliente.razon_social}` : '',
  })

  const [isVisitaInicial, setIsVisitaInicial] = useState(!preloadedObra)
  const [showObraSearch, setShowObraSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVisitadores, setSelectedVisitadores] = useState<string[]>([])

  const isFromObra = !!preloadedObra

  const filteredObras = mockObras.filter(
    (obra) =>
      obra.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obra.cliente.razon_social.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleVisitadorToggle = (visitadorId: string) => {
    setSelectedVisitadores((prev) =>
      prev.includes(visitadorId)
        ? prev.filter((id) => id !== visitadorId)
        : [...prev, visitadorId]
    )
  }

  const handleObraSelect = (obra: any) => {
    setFormData((prev) => ({
      ...prev,
      obraId: obra.id,
      obraCliente: obra.cliente.nombre,
      direccion: obra.direccion,
      contacto: obra.contacto,
    }))
    setIsVisitaInicial(false)
    setShowObraSearch(false)
    setSearchTerm('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const visitaData = {
      ...formData,
      visitadores: selectedVisitadores,
      esVisitaInicial: isVisitaInicial && !isFromObra,
    }

    onSubmit(visitaData)
  }

  const tiposVisita = [
    { value: 'visita_inicial', label: 'Visita inicial', disabled: isFromObra },
    { value: 'remedicion', label: 'Remedición' },
    { value: 'medicion_inicial', label: 'Medición inicial' },
    { value: 'otro', label: 'Otro' },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {isFromObra ? `Agendar Visita` : 'Nueva Visita'}
            </h1>
            {isFromObra && (
              <p className="mt-1 text-gray-600">
                Cliente: {preloadedObra?.cliente ? `${preloadedObra.cliente.razon_social}` : ''} | Dirección:{' '}
                {preloadedObra?.direccion}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Obra Selection - Solo si no viene de obra */}
            {!isFromObra && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Obra
                  </label>
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setShowObraSearch(!showObraSearch)}
                      className="flex w-full items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
                    >
                      <Search className="h-4 w-4" />
                      {formData.direccion || 'Buscar obra existente...'}
                    </button>

                    {showObraSearch && (
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <input
                          type="text"
                          placeholder="Buscar por nombre, cliente o dirección..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                        <div className="max-h-40 space-y-2 overflow-y-auto">
                          {filteredObras.map((obra) => (
                            <button
                              key={obra.cod_obra}
                              type="button"
                              onClick={() => handleObraSelect(obra)}
                              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-left hover:bg-blue-50"
                            >
                              <div className="font-medium">{obra.direccion}</div>
                              <div className="text-sm text-gray-600">
                                {obra.cliente.razon_social} - {obra.direccion}
                              </div>{' '}
                              {/*Cambiar a direccion si se agrega ese campo*/}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="visitaInicial"
                        checked={isVisitaInicial}
                        onChange={(e) => {
                          setIsVisitaInicial(e.target.checked)
                          if (e.target.checked) {
                            setFormData((prev) => ({
                              ...prev,
                              obraId: '',
                              obraNombre: '',
                              obraCliente: '',
                            }))
                          }
                        }}
                        className="mr-2"
                      />
                      <label
                        htmlFor="visitaInicial"
                        className="text-sm text-gray-700"
                      >
                        Visita inicial (sin obra asignada)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dirección y Contacto */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  <MapPin className="mr-1 inline h-4 w-4" />
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      direccion: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                  readOnly={isFromObra}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  <Phone className="mr-1 inline h-4 w-4" />
                  Contacto
                </label>
                <input
                  type="text"
                  value={formData.contacto}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contacto: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                  readOnly={isFromObra}
                />
              </div>
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  <Calendar className="mr-1 inline h-4 w-4" />
                  Fecha
                </label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, fecha: e.target.value }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  <Clock className="mr-1 inline h-4 w-4" />
                  Hora
                </label>
                <input
                  type="time"
                  value={formData.hora}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, hora: e.target.value }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Tipo de Visita */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tipo de Visita
              </label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {tiposVisita.map((tipo) => (
                  <label
                    key={tipo.value}
                    className={`flex cursor-pointer items-center rounded-lg border p-3 transition-colors ${
                      tipo.disabled
                        ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                        : formData.tipo === tipo.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipo"
                      value={tipo.value}
                      checked={formData.tipo === tipo.value}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          tipo: e.target.value,
                        }))
                      }
                      className="mr-2"
                      disabled={tipo.disabled}
                      required
                    />
                    <span className="text-sm">{tipo.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Visitadores */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">
                <User className="mr-1 inline h-4 w-4" />
                Visitadores
              </label>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {mockVisitadores.map((visitador) => (
                  <label
                    key={visitador.id}
                    className={`flex cursor-pointer items-center rounded-lg border p-3 transition-colors ${
                      selectedVisitadores.includes(visitador.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedVisitadores.includes(visitador.id)}
                      onChange={() => handleVisitadorToggle(visitador.id)}
                      className="mr-2"
                    />
                    <span className="text-sm">{visitador.nombre}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Observaciones */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Observaciones
              </label>
              <textarea
                value={formData.observaciones}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    observaciones: e.target.value,
                  }))
                }
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Observaciones adicionales..."
              />
            </div>

            {/* Botones */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Confirmar Visita
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
