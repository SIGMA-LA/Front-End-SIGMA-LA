'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, User, Phone, MapPin, Loader2 } from 'lucide-react'
import { notify } from '@/lib/toast'
import { crearProspecto } from '@/actions/visitas'
import { getLocalidadesByProvincia } from '@/actions/localidad'
import type { Provincia, Localidad } from '@/types'

interface SolicitarMedicionModalProps {
  provincias: Provincia[]
}

export default function SolicitarMedicionModal({ provincias }: SolicitarMedicionModalProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    cod_localidad: 0,
    provinciaSeleccionada: '' as number | '',
  })
  const [localidades, setLocalidades] = useState<Localidad[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleProvinciaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cod = e.target.value === '' ? '' : Number(e.target.value)
    setFormData((prev) => ({ ...prev, provinciaSeleccionada: cod, cod_localidad: 0 }))
    if (cod) {
      const locs = await getLocalidadesByProvincia(cod)
      setLocalidades(locs)
    } else {
      setLocalidades([])
    }
  }

  const handleLocalidadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, cod_localidad: Number(e.target.value) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nombre || !formData.telefono || !formData.direccion || !formData.cod_localidad) {
      notify.warning('Por favor complete todos los campos')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await crearProspecto({
        nombre: formData.nombre,
        telefono: formData.telefono,
        direccion: formData.direccion,
        cod_localidad: formData.cod_localidad
      })

      if (res.success) {
        notify.success('Solicitud enviada a Coordinación')
        setIsOpen(false)
        setFormData({
          nombre: '',
          telefono: '',
          direccion: '',
          cod_localidad: 0,
          provinciaSeleccionada: '',
        })
        router.refresh()
      } else {
        notify.error(res.error || 'Error al enviar solicitud')
      }
    } catch (error) {
      notify.error('Error al enviar solicitud')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
      >
        <Plus className="h-4 w-4" />
        SOLICITAR MEDICIÓN
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <h3 className="text-xl font-bold text-slate-800">
                Solicitar Medición Inicial
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                <p className="text-sm text-blue-800 font-medium">
                  Complete los datos del prospecto. Coordinación se encargará de contactarlo y agendar la visita.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 flex items-center gap-2 text-xs font-bold text-slate-600">
                    <User className="h-3.5 w-3.5" />
                    NOMBRE Y APELLIDO
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 flex items-center gap-2 text-xs font-bold text-slate-600">
                    <Phone className="h-3.5 w-3.5" />
                    TELÉFONO DE CONTACTO
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="Ej: 341 555 1234"
                    required
                  />
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <label className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-600">
                    <MapPin className="h-3.5 w-3.5" />
                    DOMICILIO DE LA OBRA
                  </label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={formData.provinciaSeleccionada}
                      onChange={handleProvinciaChange}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      required
                    >
                      <option value="">Provincia...</option>
                      {provincias.map((prov) => (
                        <option key={prov.cod_provincia} value={prov.cod_provincia}>
                          {prov.nombre}
                        </option>
                      ))}
                    </select>

                    <select
                      value={formData.cod_localidad || ''}
                      onChange={handleLocalidadChange}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      required
                      disabled={!formData.provinciaSeleccionada}
                    >
                      <option value="">Localidad...</option>
                      {localidades.map((loc) => (
                        <option key={loc.cod_localidad} value={loc.cod_localidad}>
                          {loc.nombre_localidad}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-3">
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="Calle y Número"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
                  disabled={isSubmitting}
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'ENVIAR SOLICITUD'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
