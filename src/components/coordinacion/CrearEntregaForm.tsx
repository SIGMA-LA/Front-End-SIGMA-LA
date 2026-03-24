'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Truck, AlertCircle } from 'lucide-react'
import { createEntrega } from '@/actions/entregas'
import { getObras } from '@/actions/obras'
import type { Obra, Empleado, Vehiculo, Maquinaria, RolEntrega } from '@/types'

// Componentes
import ObraSearchSelect from '@/components/shared/ObraSearchSelect'
import DateTimeSelection from './entrega/DateTimeSelection'
import PersonalSelection from './entrega/PersonalSelection'
import ViaticosSection from './entrega/ViaticosSection'
import RecursosSelection from './entrega/RecursosSelection'
import AsignarPersonalModal from '@/components/shared/AsignarPersonalModal'
import SelectionModal from '@/components/shared/SelectionModal'
import DateTimeModal from './entrega/DateTimeModal'

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
  })
  
  const [fechaRegreso, setFechaRegreso] = useState('')
  const [horaRegreso, setHoraRegreso] = useState('')
  
  const [fechaSalida, setFechaSalida] = useState('')
  const [horaSalida, setHoraSalida] = useState('')

  const [isDateTimeModalOpen, setIsDateTimeModalOpen] = useState(false)

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

  const buscarObrasPagadas = async (query: string) => {
    return await getObras(query)
  }

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
    if (
      !formData.fecha ||
      !formData.hora ||
      !fechaRegreso ||
      !horaRegreso ||
      !fechaSalida ||
      !horaSalida
    ) {
      setError('Debe especificar la salida, llegada y el regreso estimados')
      return
    }

    const fechaEntregaMs = new Date(`${formData.fecha}T${formData.hora}:00`).getTime()
    const fechaSalidaMs = new Date(`${fechaSalida}T${horaSalida}:00`).getTime()
    const fechaRegresoMs = new Date(`${fechaRegreso}T${horaRegreso}:00`).getTime()

    if (fechaSalidaMs > fechaEntregaMs) {
      setError('La salida de la planta no puede ser posterior a la llegada al cliente.')
      return
    }
    
    if (fechaRegresoMs <= fechaSalidaMs) {
      setError('El regreso estimado debe ser estrictamente posterior a la salida.')
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
        { cuil: encargado, rol_entrega: 'ENCARGADO' as RolEntrega },
        ...acompanantes.map((cuil) => ({
          cuil,
          rol_entrega: 'ACOMPANANTE' as RolEntrega,
        })),
      ]

      const entregaData = {
        cod_obra: formData.obraId,
        fecha_hora_entrega: `${formData.fecha}T${formData.hora}:00`,
        detalle: formData.detalle,
        dias_viaticos: diasViaticos,
        fecha_salida_estimada: `${fechaSalida}T${horaSalida}:00`,
        fecha_regreso_estimado: `${fechaRegreso}T${horaRegreso}:00`,
        empleados_asignados,
        vehiculos: selectedVehiculos.length > 0 ? selectedVehiculos : undefined,
        maquinarias:
          selectedMaquinaria.length > 0 ? selectedMaquinaria : undefined,
      }

      startTransition(async () => {
        try {
          await createEntrega(entregaData)
          router.push('/coordinacion/entregas')
          router.refresh()
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : 'Error desconocido')
        }
      })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
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
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                <div className="text-sm text-red-800">
                  {error.split('\n').map((line, idx, arr) => (
                    <p
                      key={idx}
                      className={
                        arr.length > 1 && idx > 0
                          ? 'relative mt-2 pl-3.5 before:absolute before:top-2 before:left-0 before:h-1.5 before:w-1.5 before:rounded-full before:bg-red-500'
                          : 'font-medium'
                      }
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isFromObra && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Obra programada *
                  </label>
                  {formData.direccion ? (
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">
                          {formData.direccion}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            obraId: null,
                            direccion: '',
                          }))
                        }
                        className="flex-shrink-0 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        Modificar obra
                      </button>
                    </div>
                  ) : (
                    <ObraSearchSelect
                      onSelectObra={handleObraSelect}
                      buscarObras={buscarObrasPagadas}
                      placeholder="Buscar obra por dirección o cliente..."
                    />
                  )}
                </div>
              )}

              <DateTimeSelection
                fecha={formData.fecha}
                hora={formData.hora}
                fechaSalida={fechaSalida}
                horaSalida={horaSalida}
                fechaRegreso={fechaRegreso}
                horaRegreso={horaRegreso}
                onAsignarClick={() => setIsDateTimeModalOpen(true)}
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
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
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

      <DateTimeModal
        isOpen={isDateTimeModalOpen}
        onClose={() => setIsDateTimeModalOpen(false)}
        initialValues={{
          fecha: formData.fecha,
          hora: formData.hora,
          fechaSalida,
          horaSalida,
          fechaRegreso,
          horaRegreso
        }}
        onConfirm={(nf, nh, nfs, nhs, nfr, nhr) => {
          setFormData((prev) => ({ ...prev, fecha: nf, hora: nh }))
          setFechaSalida(nfs)
          setHoraSalida(nhs)
          setFechaRegreso(nfr)
          setHoraRegreso(nhr)
          setIsDateTimeModalOpen(false)
        }}
      />

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
