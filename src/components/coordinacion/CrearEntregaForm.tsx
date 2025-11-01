'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Truck, AlertCircle } from 'lucide-react'
import { crearEntregaAction } from '@/actions/entregas'
import type { Obra, Empleado, Vehiculo, Maquinaria } from '@/types'

// Componentes
import ObraSelection from './entrega/ObraSelection'
import DateTimeSelection from './entrega/DateTimeSelection'
import PersonalSelection from './entrega/PersonalSelection'
import ViaticosSection from './entrega/ViaticosSection'
import RecursosSelection from './entrega/RecursosSelection'
import Observaciones from './entrega/Observaciones'
import AsignarPersonalModal from '@/components/shared/AsignarPersonalModal'
import SelectionModal from '@/components/shared/SelectionModal'

interface CrearEntregaFormProps {
  preloadedObra: Obra | null
  empleados: Empleado[]
  vehiculos: Vehiculo[]
  maquinarias: Maquinaria[]
}

export default function CrearEntregaForm({
  preloadedObra,
  empleados,
  vehiculos,
  maquinarias,
}: CrearEntregaFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const isFromObra = !!preloadedObra

  // Estado del formulario
  const [formData, setFormData] = useState({
    obraId: preloadedObra?.cod_obra || null,
    direccion: preloadedObra?.direccion || '',
    fecha: '',
    hora: '',
    detalle: '',
    observaciones: '',
  })

  // Estado de búsqueda de obra
  const [showObraSearch, setShowObraSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [obras, setObras] = useState<Obra[]>([])

  // Estado de personal
  const [encargado, setEncargado] = useState<string | null>(null)
  const [acompanantes, setAcompanantes] = useState<string[]>([])
  const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false)

  // Estado de viáticos
  const [diasViaticos, setDiasViaticos] = useState(0)
  const viaticoPorDia = 50000

  // Estado de recursos
  const [selectedVehiculos, setSelectedVehiculos] = useState<string[]>([])
  const [selectedMaquinaria, setSelectedMaquinaria] = useState<string[]>([])
  const [isVehiculoModalOpen, setIsVehiculoModalOpen] = useState(false)
  const [isMaquinariaModalOpen, setIsMaquinariaModalOpen] = useState(false)

  const totalViaticos = useMemo(() => {
    const totalPersonas = (encargado ? 1 : 0) + acompanantes.length
    return diasViaticos * totalPersonas * viaticoPorDia
  }, [diasViaticos, encargado, acompanantes, viaticoPorDia])

  // Filtrar obras
  const filteredObras = obras.filter((obra) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      obra.direccion.toLowerCase().includes(searchLower) ||
      obra.cliente.razon_social?.toLowerCase().includes(searchLower) ||
      obra.cliente.nombre?.toLowerCase().includes(searchLower)
    )
  })

  const getEmpleadoNombre = (cuil: string) => {
    const emp = empleados.find((e) => e.cuil === cuil)
    return emp ? `${emp.nombre} ${emp.apellido}` : cuil
  }

  const handleObraSelect = (obra: Obra) => {
    setFormData((prev) => ({
      ...prev,
      obraId: obra.cod_obra,
      direccion: obra.direccion,
    }))
    setShowObraSearch(false)
  }

  const handleConfirmPersonal = (
    newEncargado: string | null,
    newAcompanantes: string[]
  ) => {
    setEncargado(newEncargado)
    setAcompanantes(newAcompanantes)
    setIsPersonalModalOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.obraId) {
      setError('Debe seleccionar una obra')
      return
    }
    if (!formData.fecha || !formData.hora) {
      setError('Debe especificar fecha y hora')
      return
    }
    if (!encargado) {
      setError('Debe asignar un encargado')
      return
    }
    if (!formData.detalle.trim()) {
      setError('Debe agregar un detalle de la entrega')
      return
    }

    try {
      const empleados_asignados = [
        { cuil: encargado, rol_entrega: 'ENCARGADO' },
        ...acompanantes.map((cuil) => ({
          cuil,
          rol_entrega: 'ACOMPANANTE',
        })),
      ]

      const formDataToSend = new FormData()
      formDataToSend.append('cod_obra', String(formData.obraId))
      formDataToSend.append(
        'fecha_hora_entrega',
        `${formData.fecha}T${formData.hora}:00`
      )
      formDataToSend.append('detalle', formData.detalle)
      formDataToSend.append('observaciones', formData.observaciones || '')
      formDataToSend.append('dias_viaticos', String(diasViaticos))
      formDataToSend.append(
        'empleados_asignados',
        JSON.stringify(empleados_asignados)
      )

      if (selectedVehiculos.length > 0) {
        formDataToSend.append('vehiculos', JSON.stringify(selectedVehiculos))
      }
      if (selectedMaquinaria.length > 0) {
        formDataToSend.append('maquinarias', JSON.stringify(selectedMaquinaria))
      }

      startTransition(async () => {
        await crearEntregaAction(formDataToSend)
      })
    } catch (err: any) {
      setError(err.message || 'Error al crear la entrega')
    }
  }

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isFromObra
                  ? `Nueva Entrega - ${preloadedObra?.direccion}`
                  : 'Nueva Entrega'}
              </h1>
              {isFromObra && preloadedObra && (
                <p className="text-sm text-gray-600">
                  Cliente:{' '}
                  {preloadedObra.cliente.razon_social ||
                    `${preloadedObra.cliente.nombre} ${preloadedObra.cliente.apellido}`}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <ObraSelection
                isFromObra={isFromObra}
                direccion={formData.direccion}
                showObraSearch={showObraSearch}
                setShowObraSearch={setShowObraSearch}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filteredObras={filteredObras}
                handleObraSelect={handleObraSelect}
              />

              <DateTimeSelection
                fecha={formData.fecha}
                hora={formData.hora}
                onDateChange={(value) =>
                  setFormData((prev) => ({ ...prev, fecha: value }))
                }
                onTimeChange={(value) =>
                  setFormData((prev) => ({ ...prev, hora: value }))
                }
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Detalle de la Entrega *
                </label>
                <textarea
                  value={formData.detalle}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      detalle: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Descripción de los elementos a entregar..."
                  required
                />
              </div>

              <PersonalSelection
                encargado={encargado}
                acompanantes={acompanantes}
                getEmpleadoNombre={getEmpleadoNombre}
                onAsignarClick={() => setIsPersonalModalOpen(true)}
              />

              <ViaticosSection
                diasViaticos={diasViaticos}
                onDiasViaticosChange={setDiasViaticos}
                totalViaticos={totalViaticos}
                viaticoPorDia={viaticoPorDia}
                numAcompanantes={acompanantes.length}
                hayEncargado={!!encargado}
              />

              <RecursosSelection
                selectedVehiculos={selectedVehiculos}
                onSelectVehiculosClick={() => setIsVehiculoModalOpen(true)}
                selectedMaquinaria={selectedMaquinaria}
                onSelectMaquinariaClick={() => setIsMaquinariaModalOpen(true)}
                maquinarias={maquinarias}
              />

              <Observaciones
                value={formData.observaciones}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, observaciones: value }))
                }
              />

              <div className="flex gap-3 border-t pt-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  disabled={isPending}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending || !encargado}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    'Crear Entrega'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <AsignarPersonalModal
        isOpen={isPersonalModalOpen}
        empleados={empleados}
        encargadoSeleccionado={encargado}
        acompanantesSeleccionados={acompanantes}
        onClose={() => setIsPersonalModalOpen(false)}
        onConfirm={handleConfirmPersonal}
      />

      <SelectionModal
        isOpen={isVehiculoModalOpen}
        title="Seleccionar Vehículos"
        items={vehiculos.map((v) => ({
          id: v.patente,
          label: `${v.tipo_vehiculo} - ${v.patente} (${v.estado})`,
          disabled: v.estado !== 'DISPONIBLE',
        }))}
        selectedItems={selectedVehiculos}
        onClose={() => setIsVehiculoModalOpen(false)}
        onConfirm={setSelectedVehiculos}
      />

      <SelectionModal
        isOpen={isMaquinariaModalOpen}
        title="Seleccionar Maquinaria"
        items={maquinarias.map((m) => ({
          id: m.cod_maquina.toString(),
          label: `${m.descripcion} (${m.estado})`,
          disabled: m.estado !== 'DISPONIBLE',
        }))}
        selectedItems={selectedMaquinaria}
        onClose={() => setIsMaquinariaModalOpen(false)}
        onConfirm={setSelectedMaquinaria}
      />
    </>
  )
}
