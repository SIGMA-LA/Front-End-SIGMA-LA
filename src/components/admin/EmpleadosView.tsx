'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Building, Plus, Eye, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { Empleado } from '@/types'
import CrearEmpleado, { CrearEmpleadoData } from './CrearEmpleado'
import {
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
} from '@/actions/empleado'

const getRolDisplayName = (rol: Empleado['rol_actual']) => {
  const rolNames: Record<string, string> = {
    ADMIN: 'Administrador',
    COORDINACION: 'Coordinación',
    PLANTA: 'Planta',
    VISITADOR: 'Visitador',
    VENTAS: 'Ventas',
  }
  return rolNames[rol] || rol
}

interface EmpleadosViewProps {
  empleados: Empleado[]
}

export default function EmpleadosView({
  empleados: initialEmpleados,
}: EmpleadosViewProps) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [editingEmpleado, setEditingEmpleado] = useState<Empleado | null>(null)
  const [viewingEmpleado, setViewingEmpleado] = useState<Empleado | null>(null)
  const [empleadosList, setEmpleadosList] = useState<Empleado[]>([])

  useEffect(() => {
    setEmpleadosList(Array.isArray(initialEmpleados) ? initialEmpleados : [])
  }, [initialEmpleados])

  const handleOpenModal = (empleado: Empleado | null) => {
    setEditingEmpleado(empleado)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingEmpleado(null)
  }

  const handleSubmitEmpleado = async (empleadoData: CrearEmpleadoData) => {
    try {
      if (editingEmpleado) {
        // Actualizar empleado
        const { contrasenia, ...updateData } = empleadoData
        const dataToUpdate = contrasenia
          ? { ...updateData, contrasenia }
          : updateData

        const result = await actualizarEmpleado(
          editingEmpleado.cuil,
          dataToUpdate
        )

        if (!result.success || !result.data) {
          throw new Error(result.error || 'Error al actualizar empleado')
        }

        // Update optimista
        setEmpleadosList((prev) =>
          prev.map((emp) =>
            emp.cuil === editingEmpleado.cuil ? result.data! : emp
          )
        )
      } else {
        // Crear nuevo empleado
        const result = await crearEmpleado(empleadoData)

        if (!result.success || !result.data) {
          throw new Error(result.error || 'Error al crear empleado')
        }

        // Update optimista
        setEmpleadosList((prev) => [...prev, result.data!])
      }
      // Recargar datos del servidor
      router.refresh()
    } catch (error) {
      console.error('Error al guardar empleado:', error)
      throw error // Re-lanzar el error para que lo maneje CrearEmpleado
    }
  }

  const handleDeleteEmpleado = async (cuil: string, nombreCompleto: string) => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar al empleado ${nombreCompleto}?\n\nEsta acción desactivará la cuenta del empleado.`
      )
    ) {
      try {
        const result = await eliminarEmpleado(cuil)

        if (!result.success) {
          throw new Error(result.error || 'Error al eliminar empleado')
        }

        // Update optimista
        setEmpleadosList((prev) => prev.filter((emp) => emp.cuil !== cuil))

        // Recargar datos del servidor
        router.refresh()
      } catch (error) {
        console.error('Error al borrar empleado:', error)
        alert('Hubo un error al eliminar el empleado.')
      }
    }
  }

  const renderEmpleadoCard = (empleado: Empleado) => (
    <Card key={empleado.cuil} className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
              {empleado.nombre[0]}
              {empleado.apellido[0]}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                {empleado.nombre} {empleado.apellido}
              </h4>
              <p className="text-xs text-gray-500">
                {getRolDisplayName(empleado.rol_actual)}
              </p>
            </div>
          </div>
          <div className="flex">
            <Button
              onClick={() => setViewingEmpleado(empleado)}
              variant="ghost"
              size="icon"
              title="Ver detalles"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => handleOpenModal(empleado)}
              variant="ghost"
              size="icon"
              title="Editar"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              onClick={() =>
                handleDeleteEmpleado(
                  empleado.cuil,
                  `${empleado.nombre} ${empleado.apellido}`
                )
              }
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700"
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const sections = {
    admin: empleadosList.filter((u) => u.rol_actual === 'ADMIN'),
    coordinacion: empleadosList.filter((u) => u.rol_actual === 'COORDINACION'),
    ventas: empleadosList.filter((u) => u.rol_actual === 'VENTAS'),
    visitadores: empleadosList.filter((u) => u.rol_actual === 'VISITADOR'),
    planta: empleadosList.filter((u) => u.rol_actual === 'PLANTA'),
    produccion: empleadosList.filter((u) => u.rol_actual === 'PRODUCCION'),
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Gestión de Empleados
        </h2>
        <Button onClick={() => handleOpenModal(null)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Empleado
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Users className="mr-3 h-6 w-6 text-red-500" />
            Administradores ({sections.admin.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sections.admin.map(renderEmpleadoCard)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Users className="mr-3 h-6 w-6 text-blue-500" />
            Coordinación ({sections.coordinacion.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sections.coordinacion.map(renderEmpleadoCard)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Users className="mr-3 h-6 w-6 text-purple-500" />
            Ventas ({sections.ventas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sections.ventas.map(renderEmpleadoCard)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Users className="mr-3 h-6 w-6 text-orange-500" />
            Visitadores ({sections.visitadores.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sections.visitadores.map(renderEmpleadoCard)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Building className="mr-3 h-6 w-6 text-green-500" />
            Planta ({sections.planta.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sections.planta.map(renderEmpleadoCard)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Users className="mr-3 h-6 w-6 text-indigo-500" />
            Producción ({sections.produccion.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sections.produccion.map(renderEmpleadoCard)}
          </div>
        </CardContent>
      </Card>

      {/* Modal de visualización de detalles */}
      {viewingEmpleado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h3 className="mb-4 text-lg font-semibold">
              Detalles del Empleado
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Nombre:</strong> {viewingEmpleado.nombre}{' '}
                {viewingEmpleado.apellido}
              </p>
              <p>
                <strong>CUIL:</strong> {viewingEmpleado.cuil}
              </p>
              <p>
                <strong>Rol:</strong>{' '}
                {getRolDisplayName(viewingEmpleado.rol_actual)}
              </p>
              <p>
                <strong>Área:</strong> {viewingEmpleado.area_trabajo}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setViewingEmpleado(null)}
                variant="outline"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de creación/edición */}
      {showModal && (
        <CrearEmpleado
          onCancel={handleCloseModal}
          onSubmit={handleSubmitEmpleado}
          editingEmpleado={editingEmpleado}
        />
      )}
    </div>
  )
}
