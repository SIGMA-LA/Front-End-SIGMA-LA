'use client'

import { Loader2 } from 'lucide-react'
import { CrearEntregaProps } from '@/types'
import { useCrearEntrega } from '@/hooks/useCrearEntrega'

// Componentes de UI modulares
import ObraSelection from './entrega/ObraSelection'
import DateTimeSelection from './entrega/DateTimeSelection'
import PersonalSelection from './entrega/PersonalSelection'
import OrdenesSection from './entrega/OrdenesSection'
import ViaticosSection from './entrega/ViaticosSection'
import RecursosSelection from './entrega/RecursosSelection'
import Observaciones from './entrega/Observaciones'
import ActionButtons from './entrega/ActionButtons'

// Modales
import AsignarPersonalModal from '@/components/shared/AsignarPersonalModal'
import SelectionModal from '@/components/shared/SelectionModal'

// Componente principal refactorizado
export default function CrearEntrega(props: CrearEntregaProps) {
  const {
    // Estados y datos
    formData,
    loading,
    error,
    submitting,
    isFromObra,
    showObraSearch,
    searchTerm,
    filteredObras,
    diasViaticos,
    totalViaticos,
    viaticoPorDia,
    encargado,
    acompanantes,
    empleados,
    loadingOrdenes,
    errorOrdenes,
    ordenesProduccion,
    selectedOrden,
    selectedVehiculos,
    selectedMaquinaria,
    vehiculos,
    maquinarias,
    loadingDisponibilidad,
    isPersonalModalOpen,
    isVehiculoModalOpen,
    isMaquinariaModalOpen,

    // Setters y Handlers
    setFormData,
    setSearchTerm,
    setShowObraSearch,
    handleObraSelect,
    setDiasViaticos,
    formatCurrency,
    getEmpleadoNombre,
    handleConfirmPersonal,
    setSelectedVehiculos,
    setSelectedMaquinaria,
    setSelectedOrden,
    handleSubmit,
    setIsPersonalModalOpen,
    setIsVehiculoModalOpen,
    setIsMaquinariaModalOpen,
  } = useCrearEntrega(props)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {isFromObra
                  ? `Crear entrega - ${props.preloadedObra?.direccion}`
                  : 'Crear entrega'}
              </h1>
              {isFromObra && props.preloadedObra && (
                <p className="mt-1 text-gray-600">
                  Cliente: {props.preloadedObra.cliente.razon_social}
                </p>
              )}
            </div>

            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
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

              <PersonalSelection
                encargado={encargado}
                acompanantes={acompanantes}
                getEmpleadoNombre={getEmpleadoNombre}
                onAsignarClick={() => setIsPersonalModalOpen(true)}
              />

              <OrdenesSection
                obraId={formData.obraId}
                loading={loadingOrdenes}
                error={errorOrdenes}
                ordenes={ordenesProduccion}
                selectedOrden={selectedOrden}
                onSelectOrden={setSelectedOrden}
              />

              <ViaticosSection
                descripcionUso={formData.descripcionUso}
                onDescripcionChange={(value) =>
                  setFormData((prev) => ({ ...prev, descripcionUso: value }))
                }
                diasViaticos={diasViaticos}
                onDiasViaticosChange={setDiasViaticos}
                totalViaticos={totalViaticos}
                formatCurrency={formatCurrency}
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
                loadingDisponibilidad={loadingDisponibilidad}
              />

              <Observaciones
                value={formData.observaciones}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, observaciones: value }))
                }
              />

              <ActionButtons
                onCancel={props.onCancel}
                isSubmitting={submitting}
                isEncargadoSelected={!!encargado}
              />
            </form>
          </div>
        </div>
      </div>

      {/* Modales */}
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
          label: `${v.tipo_vehiculo} - ${v.patente} (${v.estado}) ${
            v.availabilityStatus === 'NO_DISPONIBLE' ? ' - OCUPADO' : ''
          }`,
          disabled:
            v.estado !== 'DISPONIBLE' ||
            v.availabilityStatus === 'NO_DISPONIBLE',
          warning: v.warningMessage,
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
          label: `${m.descripcion} (${m.estado}) ${
            m.availabilityStatus === 'NO_DISPONIBLE' ? ' - OCUPADA' : ''
          }`,
          disabled:
            m.estado !== 'DISPONIBLE' ||
            m.availabilityStatus === 'NO_DISPONIBLE',
          warning: m.warningMessage,
        }))}
        selectedItems={selectedMaquinaria}
        onClose={() => setIsMaquinariaModalOpen(false)}
        onConfirm={setSelectedMaquinaria}
      />
    </>
  )
}
