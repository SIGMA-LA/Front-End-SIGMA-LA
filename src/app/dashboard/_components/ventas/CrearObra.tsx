'use client'

import { useState, useEffect } from 'react'
import { Search, User, Upload } from 'lucide-react'
import { mockArquitectos, mockClientes } from '@/data/mockData'
import { useGlobalContext } from '@/context/GlobalContext'
import type { Obra } from '@/types'

interface CrearObraProps {
  onCancel: () => void
  onSubmit: (obraData: Omit<Obra, 'id' | 'cliente'>) => void
  obraExistente?: Obra | null
}

const initialState = {
  direccion: '',
  cod_postal: 0,
  nota_fabrica: '',
  fechaInicio: '',
  fechaFinEstimativo: '',
  estado: 'planificacion' as 'planificacion' | 'en_progreso' | 'finalizada' | 'cancelada',
}

export default function CrearObra({ onCancel, onSubmit, obraExistente  }: CrearObraProps) {
  const { localidades, fetchLocalidades } = useGlobalContext()
  const [formData, setFormData] = useState(initialState)
  const [arquitectoEnabled, setArquitectoEnabled] = useState(true)
  const esModoEdicion = !!obraExistente

  useEffect(() => {
    fetchLocalidades()
  }, [fetchLocalidades])

  useEffect(() => {
    if (esModoEdicion && obraExistente) {
      setFormData({
        direccion: obraExistente.direccion,
        nota_fabrica: obraExistente.nota_fabrica,
        fechaInicio: obraExistente.fechaInicio ? new Date(obraExistente.fechaInicio).toISOString().split('T')[0] : '',
        estado: obraExistente.estado,
        cod_postal: obraExistente.localidad?.cod_postal || 0,
        fechaFinEstimativo: '',
      })
    } else {
      setFormData(initialState)
    }
  }, [obraExistente, esModoEdicion])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...formData,
      cod_postal: formData.cod_postal,
    }
    onSubmit(payload)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-xl bg-white p-6 shadow-lg sm:p-8">
          <h1 className="mb-8 text-2xl font-bold text-gray-900">
            {esModoEdicion ? `Editando Obra: ${obraExistente?.direccion}` : 'Crear Nueva Obra'}
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Cliente */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Cliente</h3>
                <div className="relative">
                  <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar cliente..."
                    className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-gray-200">
                  {mockClientes.map((cliente) => (
                    <div
                      key={cliente.id}
                      className="flex cursor-pointer items-center p-3 hover:bg-gray-50"
                    >
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="text-gray-900">{cliente.razon_social}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="w-full rounded-lg bg-blue-600 py-2.5 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Nuevo Cliente
                </button>
              </div>

              {/* Arquitecto */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Arquitecto
                    </h3>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={arquitectoEnabled}
                        onChange={(e) => setArquitectoEnabled(e.target.checked)}
                      />
                      <div
                        className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors ${
                          arquitectoEnabled ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                        onClick={() => setArquitectoEnabled(!arquitectoEnabled)}
                      >
                        <div
                          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-md transition-transform ${
                            arquitectoEnabled ? 'right-1' : 'left-1'
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar arquitecto..."
                    className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    disabled={!arquitectoEnabled}
                  />
                </div>

                <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-gray-200">
                  {mockArquitectos.map((arquitecto) => (
                    <div
                      key={arquitecto.id}
                      className={`flex cursor-pointer items-center p-3 ${
                        arquitectoEnabled
                          ? 'hover:bg-gray-50'
                          : 'cursor-not-allowed opacity-50'
                      }`}
                    >
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="text-gray-900">{arquitecto.nombre}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={!arquitectoEnabled}
                  className="w-full rounded-lg bg-gray-600 py-2.5 font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Nuevo Arquitecto
                </button>
              </div>

              {/* Datos obra */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Datos obra
                </h3>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Dirección de la obra
                  </label>
                  <input
                    name="direccion"
                    type="text"
                    placeholder="Ingrese la dirección"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Localidad
                    </label>
                    <select
                      name="cod_postal"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={formData.cod_postal}
                      onChange={handleChange}
                      required
                      >
                        <option value="" disabled>Seleccione una localidad...</option>
                      {localidades.map((loc) => (
                        <option key={loc.cod_postal} value={loc.cod_postal}>
                          {loc.nombre_localidad}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Fecha Inicio
                    </label>
                    <input
                      name="fechaInicio"
                      type="date"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={formData.fechaInicio}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Fecha fin estimativo
                    </label>
                    <input
                      name="fechaFinEstimativo"
                      type="date"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={formData.fechaFinEstimativo}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Adjuntar Nota de Fabrica
                  </label>
                  <div className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-gray-400">
                    <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      Haga clic para subir archivos o arrástrelos aquí
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4 border-t border-gray-200 pt-6">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-lg border border-gray-300 bg-white py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700"
              >
                {esModoEdicion ? 'Guardar Cambios' : 'Crear Obra'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
