"use client"

import { useState } from "react"
import { Users, TrendingUp, Building, UserPlus, BarChart3, DollarSign, Calendar, Eye, Edit, Trash2, Plus, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import type { Usuario } from "@/types"
import { mockReportesVentas } from "@/data/mockData"
import { useGlobalContext } from "@/context/GlobalContext"

interface AdminDashboardProps {
  usuario: Usuario
  onLogout: () => void
}

export default function AdminDashboardClient({ usuario, onLogout }: AdminDashboardProps) {
  const [currentSection, setCurrentSection] = useState("dashboard")
  const [showCreateEmpleado, setShowCreateEmpleado] = useState(false)
  const [editingEmpleado, setEditingEmpleado] = useState<Usuario | null>(null)
  const [viewingEmpleado, setViewingEmpleado] = useState<Usuario | null>(null)
  const [newEmpleado, setNewEmpleado] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    rol: "visitador" as Usuario["rol"],
    fechaIngreso: new Date().toISOString().split("T")[0],
  })

  const { obras, clientes, usuarios, addEmpleado, updateEmpleado, deleteEmpleado } = useGlobalContext()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(amount)
  }

  const getRolDisplayName = (rol: Usuario["rol"]) => {
    const rolNames: Record<Usuario["rol"], string> = {
      admin: "Administrador",
      coordinacion: "Coordinación",
      encargado: "Encargado",
      visitador: "Visitador",
    }
    return rolNames[rol] || rol
  }

  const getEmpleadosBySection = () => {
    return {
      coordinacion: usuarios.filter((u) => u.rol === "coordinacion"),
      visitadoresYEncargados: usuarios.filter((u) => u.rol === "visitador" || u.rol === "encargado"),
      admin: usuarios.filter((u) => u.rol === "admin"),
    }
  }

  const handleCreateEmpleado = () => {
    const empleado: Usuario = { id: Date.now().toString(), ...newEmpleado, activo: true }
    addEmpleado(empleado)
    setNewEmpleado({ nombre: "", apellido: "", email: "", telefono: "", rol: "visitador", fechaIngreso: new Date().toISOString().split("T")[0] })
    setShowCreateEmpleado(false)
  }

  const handleEditEmpleado = (empleado: Usuario) => {
    setEditingEmpleado(empleado)
    setNewEmpleado({ nombre: empleado.nombre, apellido: empleado.apellido, email: empleado.email, telefono: empleado.telefono || "", rol: empleado.rol, fechaIngreso: empleado.fechaIngreso || new Date().toISOString().split("T")[0] })
    setShowCreateEmpleado(true)
  }

  const handleViewEmpleado = (empleado: Usuario) => { setViewingEmpleado(empleado) }

  const handleUpdateEmpleado = () => {
    if (editingEmpleado) {
      updateEmpleado(editingEmpleado.id, { ...newEmpleado })
      setEditingEmpleado(null)
      setNewEmpleado({ nombre: "", apellido: "", email: "", telefono: "", rol: "visitador", fechaIngreso: new Date().toISOString().split("T")[0] })
      setShowCreateEmpleado(false)
    }
  }

  const handleDeleteEmpleado = (id: string) => {
    if (window.confirm("¿Está seguro de que desea eliminar este empleado?")) {
      deleteEmpleado(id)
    }
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-blue-600 text-white"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-blue-100">Empleados Activos</p><p className="text-3xl font-bold">{usuarios.filter((e) => e.activo).length}</p></div><Users className="w-12 h-12 text-blue-200" /></div></CardContent></Card>
        <Card className="bg-green-600 text-white"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-green-100">Obras Activas</p><p className="text-3xl font-bold">{obras.filter((o) => o.estado === "en_progreso").length}</p></div><Building className="w-12 h-12 text-green-200" /></div></CardContent></Card>
        <Card className="bg-purple-600 text-white"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-purple-100">Clientes Totales</p><p className="text-3xl font-bold">{clientes.length}</p></div><Users className="w-12 h-12 text-purple-200" /></div></CardContent></Card>
        <Card className="bg-orange-600 text-white"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-orange-100">Ingresos Mes</p><p className="text-3xl font-bold">{formatCurrency(mockReportesVentas[mockReportesVentas.length - 1]?.ingresosBrutos || 0)}</p></div><DollarSign className="w-12 h-12 text-orange-200" /></div></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle className="flex items-center space-x-2"><BarChart3 className="w-5 h-5" /><span>Evolución de Ventas 2024</span></CardTitle></CardHeader><CardContent><div className="space-y-4">{mockReportesVentas.slice(-6).map((reporte) => (<div key={reporte.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div className="flex items-center space-x-4"><div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Calendar className="w-6 h-6 text-blue-600" /></div><div><p className="font-semibold">{reporte.mes} {reporte.año}</p><p className="text-sm text-gray-600">{reporte.ventasTotales} ventas</p></div></div><div className="text-right"><p className="font-semibold text-green-600">{formatCurrency(reporte.gananciaNeeta)}</p><p className="text-sm text-gray-600">Ganancia neta</p></div></div>))}</div></CardContent></Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentSection("empleados")}><CardContent className="p-6 text-center"><UserPlus className="w-12 h-12 text-blue-600 mx-auto mb-4" /><h3 className="font-semibold text-lg mb-2">Gestionar Empleados</h3><p className="text-gray-600">Crear, editar y administrar empleados</p></CardContent></Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentSection("reportes")}><CardContent className="p-6 text-center"><TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" /><h3 className="font-semibold text-lg mb-2">Reportes de Ventas</h3><p className="text-gray-600">Análisis detallado de ventas</p></CardContent></Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentSection("obras")}><CardContent className="p-6 text-center"><Building className="w-12 h-12 text-purple-600 mx-auto mb-4" /><h3 className="font-semibold text-lg mb-2">Supervisar Obras</h3><p className="text-gray-600">Vista general de todas las obras</p></CardContent></Card>
      </div>
    </div>
  )

  const renderEmpleadoCard = (empleado: Usuario) => (
    <Card key={empleado.id}><CardContent className="p-4"><div className="flex items-center justify-between mb-3"><div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><Users className="w-5 h-5 text-blue-600" /></div><div className="flex space-x-1"><Button onClick={() => handleViewEmpleado(empleado)} variant="ghost" size="icon" title="Ver detalles"><Eye className="w-4 h-4" /></Button><Button onClick={() => handleEditEmpleado(empleado)} variant="ghost" size="icon" title="Editar"><Edit className="w-4 h-4" /></Button><Button onClick={() => handleDeleteEmpleado(empleado.id)} variant="destructive" size="icon" title="Eliminar"><Trash2 className="w-4 h-4" /></Button></div></div><h4 className="font-semibold text-sm mb-1">{empleado.nombre} {empleado.apellido}</h4><p className="text-xs text-gray-500 mb-2">{empleado.email}</p><div className="flex justify-between items-center"><span className={`px-2 py-1 rounded text-xs ${empleado.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{empleado.activo ? "Activo" : "Inactivo"}</span></div></CardContent></Card>
  )

  const renderEmpleados = () => {
    const sections = getEmpleadosBySection()
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-gray-800">Gestión de Empleados</h2><Button onClick={() => setShowCreateEmpleado(true)}><Plus className="w-4 h-4 mr-2" />Nuevo Empleado</Button></div>
        <Card><CardHeader className="pb-3"><CardTitle className="text-lg flex items-center"><Users className="w-5 h-5 mr-2 text-blue-600" />Coordinación ({sections.coordinacion.length})</CardTitle></CardHeader><CardContent><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{sections.coordinacion.map(renderEmpleadoCard)}</div></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-lg flex items-center"><Building className="w-5 h-5 mr-2 text-purple-600" />Visitadores y Encargados ({sections.visitadoresYEncargados.length})</CardTitle></CardHeader><CardContent><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{sections.visitadoresYEncargados.map(renderEmpleadoCard)}</div></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-lg flex items-center"><Users className="w-5 h-5 mr-2 text-red-600" />Administradores ({sections.admin.length})</CardTitle></CardHeader><CardContent><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{sections.admin.map(renderEmpleadoCard)}</div></CardContent></Card>
        {viewingEmpleado && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white rounded-lg p-6 max-w-md w-full mx-4"><h3 className="text-lg font-semibold mb-4">Detalles del Empleado</h3><div className="space-y-4"><div className="flex items-center space-x-3"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><Users className="w-6 h-6 text-blue-600" /></div><div><h4 className="font-semibold">{viewingEmpleado.nombre} {viewingEmpleado.apellido}</h4><p className="text-sm text-gray-600">{getRolDisplayName(viewingEmpleado.rol)}</p></div></div><div className="space-y-2 border-t pt-4 mt-4"><div className="flex items-center space-x-2"><Mail className="w-4 h-4 text-gray-500" /><span className="text-sm text-gray-600">{viewingEmpleado.email}</span></div>{viewingEmpleado.telefono && (<div className="flex items-center space-x-2"><Phone className="w-4 h-4 text-gray-500" /><span className="text-sm text-gray-600">{viewingEmpleado.telefono}</span></div>)}{viewingEmpleado.fechaIngreso && (<div className="flex items-center space-x-2"><Calendar className="w-4 h-4 text-gray-500" /><span className="text-sm text-gray-600">Ingreso: {new Date(viewingEmpleado.fechaIngreso).toLocaleDateString("es-AR")}</span></div>)}</div><div className="flex justify-center"><span className={`px-3 py-1 rounded-full text-sm ${viewingEmpleado.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{viewingEmpleado.activo ? "Activo" : "Inactivo"}</span></div></div><div className="flex justify-end mt-6"><Button onClick={() => setViewingEmpleado(null)} variant="outline">Cerrar</Button></div></div></div>)}
        {showCreateEmpleado && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"><h3 className="text-lg font-semibold mb-4">{editingEmpleado ? "Editar Empleado" : "Crear Nuevo Empleado"}</h3><div className="space-y-4"><div><Label htmlFor="nombre">Nombre</Label><Input id="nombre" value={newEmpleado.nombre} onChange={(e) => setNewEmpleado({ ...newEmpleado, nombre: e.target.value })} placeholder="Ingrese el nombre"/></div><div><Label htmlFor="apellido">Apellido</Label><Input id="apellido" value={newEmpleado.apellido} onChange={(e) => setNewEmpleado({ ...newEmpleado, apellido: e.target.value })} placeholder="Ingrese el apellido"/></div><div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={newEmpleado.email} onChange={(e) => setNewEmpleado({ ...newEmpleado, email: e.target.value })} placeholder="ejemplo@sigma-la.com"/></div><div><Label htmlFor="telefono">Teléfono</Label><Input id="telefono" value={newEmpleado.telefono} onChange={(e) => setNewEmpleado({ ...newEmpleado, telefono: e.target.value })} placeholder="+54 11 1234-5678"/></div><div><Label htmlFor="fechaIngreso">Fecha de Ingreso</Label><Input id="fechaIngreso" type="date" value={newEmpleado.fechaIngreso} onChange={(e) => setNewEmpleado({ ...newEmpleado, fechaIngreso: e.target.value })} /></div><div><Label htmlFor="rol">Rol</Label><select id="rol" value={newEmpleado.rol} onChange={(e) => setNewEmpleado({ ...newEmpleado, rol: e.target.value as Usuario["rol"] })} className="w-full h-10 px-3 border border-input rounded-md bg-background"><option value="coordinacion">Coordinación</option><option value="visitador">Visitador</option><option value="encargado">Encargado</option><option value="admin">Administrador</option></select></div></div><div className="flex space-x-4 mt-6"><Button onClick={() => { setShowCreateEmpleado(false); setEditingEmpleado(null); setNewEmpleado({ nombre: "", apellido: "", email: "", telefono: "", rol: "visitador", fechaIngreso: new Date().toISOString().split("T")[0] }); }} variant="outline" className="flex-1">Cancelar</Button><Button onClick={editingEmpleado ? handleUpdateEmpleado : handleCreateEmpleado} className="flex-1">{editingEmpleado ? "Actualizar" : "Crear"}</Button></div></div></div>)}
      </div>
    )
  }

  const renderReportes = () => (
    <div className="space-y-6"><h2 className="text-2xl font-bold text-gray-800">Reportes de Ventas</h2><div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{mockReportesVentas.map((reporte) => (<Card key={reporte.id}><CardHeader><CardTitle className="flex items-center justify-between"><span>{reporte.mes} {reporte.año}</span><span className="text-sm font-normal text-gray-500">{reporte.ventasTotales} ventas</span></CardTitle></CardHeader><CardContent><div className="space-y-3"><div className="flex justify-between"><span className="text-gray-600">Ingresos Brutos:</span><span className="font-semibold">{formatCurrency(reporte.ingresosBrutos)}</span></div><div className="flex justify-between"><span className="text-gray-600">Costos Materiales:</span><span className="font-semibold text-red-600">{formatCurrency(reporte.costosMateriales)}</span></div><div className="flex justify-between border-t pt-2"><span className="text-gray-600 font-medium">Ganancia Neta:</span><span className="font-bold text-green-600">{formatCurrency(reporte.gananciaNeeta)}</span></div><div className="flex justify-between text-sm"><span className="text-gray-500">Obras Completadas:</span><span className="font-medium">{reporte.obrasCompletadas}</span></div><div className="flex justify-between text-sm"><span className="text-gray-500">Clientes Nuevos:</span><span className="font-medium">{reporte.clientesNuevos}</span></div></div></CardContent></Card>))}</div></div>
  )

  const renderObras = () => (
    <div className="space-y-6"><h2 className="text-2xl font-bold text-gray-800">Supervisión de Obras</h2><div className="space-y-4">{obras.map((obra) => (<Card key={obra.id}><CardContent className="p-6"><div className="flex justify-between items-start"><div className="flex-1"><h3 className="text-lg font-semibold mb-2">{obra.nombre}</h3><p className="text-gray-600 mb-2">{obra.descripcion}</p><div className="grid grid-cols-2 gap-4 text-sm text-gray-600"><div><strong>Cliente:</strong> {obra.cliente.nombre} {obra.cliente.apellido}</div><div><strong>Ubicación:</strong> {obra.ubicacion}</div><div><strong>Presupuesto:</strong> {formatCurrency(obra.presupuesto)}</div><div><strong>Fecha Inicio:</strong> {new Date(obra.fechaInicio).toLocaleDateString("es-AR")}</div></div></div><span className={`px-3 py-1 rounded-full text-sm font-medium ${obra.estado === "en_progreso" ? "bg-blue-100 text-blue-800" : obra.estado === "finalizada" ? "bg-green-100 text-green-800" : obra.estado === "planificacion" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>{obra.estado.replace("_", " ")}</span></div></CardContent></Card>))}</div></div>
  )

  return (
    <div>
      {currentSection === "dashboard" && renderDashboard()}
      {currentSection === "empleados" && renderEmpleados()}
      {currentSection === "reportes" && renderReportes()}
      {currentSection === "obras" && renderObras()}
    </div>
  )
}