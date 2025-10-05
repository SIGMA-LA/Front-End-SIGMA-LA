'use client'

import { useState, useEffect } from 'react'
import { Users, Building, Plus, Eye, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import type { Empleado } from '@/types'
import { useGlobalContext } from '@/context/GlobalContext'

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

export default function EmpleadosView() {
  const { empleados, addEmpleado, updateEmpleado, deleteEmpleado } =
    useGlobalContext()
  const [showModal, setShowModal] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingEmpleado, setEditingEmpleado] = useState<Empleado | null>(null)
  const [viewingEmpleado, setViewingEmpleado] = useState<Empleado | null>(null)
  const [newEmpleado, setNewEmpleado] = useState({
    nombre: '',
    apellido: '',
    cuil: '',
    rol_actual: 'VISITADOR' as Empleado['rol_actual'],
    area_trabajo: '',
    contrasenia: '123456',
  })

  useEffect(() => {
    if (showModal) {
      setTimeout(() => setIsModalVisible(true), 10)
    } else {
      setIsModalVisible(false)
    }
  }, [showModal])

  const handleOpenModal = (empleado: Empleado | null) => {
    if (empleado) {
      setEditingEmpleado(empleado)
      setNewEmpleado({
        cuil: empleado.cuil,
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        rol_actual: empleado.rol_actual as Empleado['rol_actual'],
        area_trabajo: empleado.area_trabajo,
        contrasenia: '',
      })
    } else {
      setEditingEmpleado(null)
      setNewEmpleado({
        nombre: '',
        apellido: '',
        cuil: '',
        rol_actual: 'VISITADOR',
        area_trabajo: '',
        contrasenia: '123456',
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => setShowModal(false)

  const handleSave = async () => {
    try {
      if (editingEmpleado) {
        await updateEmpleado(editingEmpleado.cuil, newEmpleado)
      } else {
        await addEmpleado(newEmpleado)
      }
      handleCloseModal()
    } catch (error) {
      console.error('Error al guardar empleado:', error)
      alert('Hubo un error al guardar el empleado.')
    }
  }

  const handleDeleteEmpleado = async (cuil: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      try {
        await deleteEmpleado(cuil)
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
              onClick={() => handleDeleteEmpleado(empleado.cuil)}
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
    admin: empleados.filter((u) => u.rol_actual === 'ADMIN'),
    coordinacion: empleados.filter((u) => u.rol_actual === 'COORDINACION'),
    ventas: empleados.filter((u) => u.rol_actual === 'VENTAS'),
    visitadores: empleados.filter((u) => u.rol_actual === 'VISITADOR'),
    planta: empleados.filter((u) => u.rol_actual === 'PLANTA'),
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

      {/* --- INICIO DEL MODAL REDISEÑADO --- */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          onClick={handleCloseModal}
        >
          <div
            className={`mx-4 w-full max-w-lg transform rounded-2xl bg-white shadow-2xl transition-all duration-300 ${isModalVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b p-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingEmpleado ? 'Editar Empleado' : 'Crear Nuevo Empleado'}
              </h3>
            </div>
            <div className="space-y-6 p-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={newEmpleado.nombre}
                    onChange={(e) =>
                      setNewEmpleado({ ...newEmpleado, nombre: e.target.value })
                    }
                    placeholder="Ej: Juan"
                    className="mt-1 w-full rounded-md"
                  />
                </div>
                <div>
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    value={newEmpleado.apellido}
                    onChange={(e) =>
                      setNewEmpleado({
                        ...newEmpleado,
                        apellido: e.target.value,
                      })
                    }
                    placeholder="Ej: Pérez"
                    className="mt-1 w-full rounded-md"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="cuil">CUIL</Label>
                <Input
                  id="cuil"
                  value={newEmpleado.cuil}
                  onChange={(e) =>
                    setNewEmpleado({ ...newEmpleado, cuil: e.target.value })
                  }
                  placeholder="20-12345678-9"
                  className="mt-1 w-full rounded-md"
                  disabled={!!editingEmpleado}
                />
                {editingEmpleado && (
                  <p className="mt-1 text-xs text-gray-500">
                    El CUIL no se puede modificar.
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="area_trabajo">Área de Trabajo</Label>
                <Input
                  id="area_trabajo"
                  value={newEmpleado.area_trabajo}
                  onChange={(e) =>
                    setNewEmpleado({
                      ...newEmpleado,
                      area_trabajo: e.target.value,
                    })
                  }
                  placeholder="Ej: Ventas, Producción"
                  className="mt-1 w-full rounded-md"
                />
              </div>
              <div>
                <Label htmlFor="rol">Rol</Label>
                <select
                  id="rol"
                  value={newEmpleado.rol_actual}
                  onChange={(e) =>
                    setNewEmpleado({
                      ...newEmpleado,
                      rol_actual: e.target.value as Empleado['rol_actual'],
                    })
                  }
                  className="mt-1 h-11 w-full rounded-md border border-gray-300 bg-white px-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="ADMIN">Administrador</option>
                  <option value="COORDINACION">Coordinación</option>
                  <option value="VENTAS">Ventas</option>
                  <option value="VISITADOR">Visitador</option>
                  <option value="PLANTA">Planta</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 rounded-b-2xl border-t bg-gray-50 p-4">
              <Button onClick={handleCloseModal} variant="outline">
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {editingEmpleado ? 'Guardar Cambios' : 'Crear Empleado'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
