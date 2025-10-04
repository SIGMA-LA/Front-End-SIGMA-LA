'use client'

import { useState, useEffect } from 'react'
import { Search, User } from 'lucide-react'
import { mockArquitectos } from '@/data/mockData'
import { useGlobalContext } from '@/context/GlobalContext'
import type { Obra } from '@/types'
import type { ObraFormData } from '@/services/obra.service'

interface CrearObraProps {
  onCancel: () => void
  onSubmit: (obraData: ObraFormData) => void
  obraExistente?: Obra | null
}

const initialState: ObraFormData = {
  direccion: '',
  cuil_cliente: '',
  cod_postal: 0,
  fecha_ini: '',
  estado: 'ACTIVA',
  nota_fabrica: '',
  fecha_cancelacion: null,
}

export default function CrearObra({ onCancel, onSubmit, obraExistente }: CrearObraProps) {
  const { clientes, localidades, fetchLocalidades } = useGlobalContext()
  const [formData, setFormData] = useState<ObraFormData>(initialState)
  const [arquitectoEnabled, setArquitectoEnabled] = useState(false)
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>('')
  const esModoEdicion = !!obraExistente

  useEffect(() => {
    fetchLocalidades()
  }, [fetchLocalidades])

  useEffect(() => {
    if (esModoEdicion && obraExistente) {
      const fecha_ini = obraExistente.fecha_ini 
        ? new Date(obraExistente.fecha_ini).toISOString().split('T')[0] 
        : ''
      const fecha_cancelacion = obraExistente.fecha_cancelacion 
        ? new Date(obraExistente.fecha_cancelacion).toISOString().split('T')[0] 
        : null

      setFormData({
        direccion: obraExistente.direccion || '',
        cuil_cliente: obraExistente.cliente?.cuil || '',
        cod_postal: obraExistente.localidad?.cod_postal || 0,
        fecha_ini,
        nota_fabrica: obraExistente.nota_fabrica || '',
        fecha_cancelacion,
        estado: obraExistente.estado || 'ACTIVA',
      })
      setClienteSeleccionado(obraExistente.cliente?.cuil || '')
    } else {
      setFormData(initialState)
      setClienteSeleccionado('')
    }
  }, [obraExistente, esModoEdicion])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'cod_postal' ? Number(value) : value 
    }))
  }

  const handleClienteSelect = (cuil: string) => {
    setClienteSeleccionado(cuil)
    setFormData(prev => ({ ...prev, cuil_cliente: cuil }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.cuil_cliente || !formData.cod_postal) {
      alert('Por favor, seleccione un cliente y una localidad.')
      return
    }
    onSubmit(formData)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-xl bg-white p-6 shadow-lg sm:p-8">
          <h1 className="mb-8 text-2xl font-bold text-gray-900">
            {esModoEdicion ? 'Editar Obra' : 'Crear Nueva Obra'}
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Sección Cliente */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Cliente</h3>
                <div className="relative">
                  <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar cliente..."
                    className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 focus:border-blue-500"
                  />
                </div>
                <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-gray-200">
                  {clientes.length > 0 ? (
                    clientes.map((cliente) => (
                      <div
                        key={cliente.cuil}
                        className={`flex cursor-pointer items-center p-3 ${
                          clienteSeleccionado === cliente.cuil 
                            ? 'bg-blue-100' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleClienteSelect(cliente.cuil)}
                      >
                        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <span className="text-gray-900">{cliente.razon_social}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No hay clientes disponibles
                    </div>
                  )}
                </div>
                <button type="button" className="w-full rounded-lg bg-blue-600 py-2.5 font-medium text-white hover:bg-blue-700">
                  Nuevo Cliente
                </button>
              </div>

              {/* Sección Arquitecto */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Arquitecto</h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={arquitectoEnabled}
                      onChange={(e) => setArquitectoEnabled(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">Habilitar</span>
                  </label>
                </div>
                <div className="relative">
                  <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar arquitecto..."
                    className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 focus:border-blue-500"
                    disabled={!arquitectoEnabled}
                  />
                </div>
                <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-gray-200">
                  {mockArquitectos.map((arquitecto) => (
                    <div
                      key={arquitecto.cuil}
                      className={`flex cursor-pointer items-center p-3 ${
                        arquitectoEnabled ? 'hover:bg-gray-50' : 'cursor-not-allowed opacity-50'
                      }`}
                    >
                      <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="text-gray-900">{arquitecto.nombre}</span>
                    </div>
                  ))}
                </div>
                <button type="button" disabled={!arquitectoEnabled} className="w-full rounded-lg bg-gray-600 py-2.5 font-medium text-white hover:bg-gray-700 disabled:opacity-50">
                  Nuevo Arquitecto
                </button>
              </div>

              {/* Datos obra */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Datos de la Obra
                </h3>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Dirección de la obra *
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

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Localidad *
                  </label>
                  <select
                    name="cod_postal"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.cod_postal || ''}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione una localidad...</option>
                    {localidades.map((loc) => (
                      <option key={loc.cod_postal} value={loc.cod_postal}>
                        {loc.nombre_localidad}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Fecha Inicio *
                    </label>
                    <input
                      name="fecha_ini"
                      type="date"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={formData.fecha_ini}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Fecha Cancelación
                    </label>
                    <input
                      name="fecha_cancelacion"
                      type="date"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={formData.fecha_cancelacion || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <select
                    name="estado"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.estado}
                    onChange={handleChange}
                  >
                    <option value="ACTIVA">Activa</option>
                    <option value="EN PRODUCCION">En producción</option>
                    <option value="FINALIZADA">Finalizada</option>
                    <option value="ENTREGADA">Entregada</option>
                    <option value="CANCELADA">Cancelada</option>
                    <option value="EN ESPERA DE STOCK">En espera de stock</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    URL de Nota de Fábrica *
                  </label>
                  <input
                    name="nota_fabrica"
                    type="text"
                    placeholder="https://ejemplo.com/nota.pdf"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.nota_fabrica}
                    onChange={handleChange}
                    required
                  />
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