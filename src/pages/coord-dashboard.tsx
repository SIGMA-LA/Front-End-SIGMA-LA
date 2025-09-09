"use client"

import { useState } from "react"
import { Building2, Users, Calendar, Package, Plus, Settings, Menu, X, Home, ChevronDown, ChevronRight, Search, User, Upload } from "lucide-react"

// Mock data temporal
const mockObras = [
  { id: "1", nombre: "Casa Rodriguez", cliente: "Juan Rodriguez", estado: "En proceso", fechaInicio: "2024-01-15" },
  { id: "2", nombre: "Oficinas Centro", cliente: "Empresa ABC", estado: "Planificación", fechaInicio: "2024-02-01" },
  { id: "3", nombre: "Departamento Norte", cliente: "María García", estado: "Finalizada", fechaInicio: "2023-12-10" },
]

const mockClientes = [
  { id: "1", nombre: "Juan Pérez", email: "juan@email.com", telefono: "123-456-7890" },
  { id: "2", nombre: "María González", email: "maria@email.com", telefono: "098-765-4321" },
  { id: "3", nombre: "Carlos Rodríguez", email: "carlos@email.com", telefono: "555-123-4567" },
]

const mockArquitectos = [
  { id: "1", nombre: "Aaron Bennett" },
  { id: "2", nombre: "Abbey Christensen" },
  { id: "3", nombre: "Alli Connors" },
]

interface DashboardProps {
  userName: string
  onLogout: () => void
}

export default function Dashboard({ userName, onLogout }: DashboardProps) {
  const [currentSection, setCurrentSection] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleNavigation = (section: string) => {
    setCurrentSection(section)
    setSidebarOpen(false) // Cerrar sidebar en mobile después de navegar
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "obras", label: "Obras", icon: Building2 },
    { id: "clientes", label: "Clientes", icon: Users },
    { id: "visitas", label: "Visitas", icon: Calendar },
    { id: "entregas", label: "Entregas", icon: Package },
    { id: "configuraciones", label: "Configuraciones", icon: Settings },
  ]

  const renderContent = () => {
    switch (currentSection) {
      case "obras":
        return (
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Obras</h1>
                <button 
                  onClick={() => setCurrentSection("crear-obra")}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Nueva Obra
                </button>
              </div>
              
              <div className="grid gap-4 sm:gap-6">
                {mockObras.map((obra) => (
                  <div key={obra.id} className="bg-blue-50 rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{obra.nombre}</h3>
                        <p className="text-gray-600">Cliente: {obra.cliente}</p>
                        <p className="text-sm text-gray-500">Inicio: {obra.fechaInicio}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          obra.estado === 'En proceso' ? 'bg-yellow-100 text-yellow-800' :
                          obra.estado === 'Planificación' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {obra.estado}
                        </span>
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      case "clientes":
        return (
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Clientes</h1>
                <button 
                  onClick={() => setCurrentSection("crear-cliente")}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Nuevo Cliente
                </button>
              </div>
              
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockClientes.map((cliente) => (
                  <div key={cliente.id} className="bg-blue-50 rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{cliente.nombre}</h3>
                    <p className="text-gray-600 mb-1">{cliente.email}</p>
                    <p className="text-gray-600 mb-4">{cliente.telefono}</p>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Ver detalles
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      case "visitas":
        return (
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Visitas</h1>
              <div className="bg-blue-50 rounded-xl shadow-sm border border-blue-200 p-8 text-center">
                <Calendar className="w-16 h-16 mx-auto text-blue-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay visitas programadas</h3>
                <p className="text-gray-600">Las visitas aparecerán aquí cuando se programen desde las obras.</p>
              </div>
            </div>
          </div>
        )
      
      case "entregas":
        return (
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Entregas</h1>
              <div className="bg-blue-50 rounded-xl shadow-sm border border-blue-200 p-8 text-center">
                <Package className="w-16 h-16 mx-auto text-blue-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay entregas programadas</h3>
                <p className="text-gray-600">Las entregas aparecerán aquí cuando se programen desde las obras.</p>
              </div>
            </div>
          </div>
        )
      
      case "configuraciones":
        return (
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Configuraciones</h1>
              <div className="bg-blue-50 rounded-xl shadow-sm border border-blue-200 p-6">
                <div className="grid gap-6">
                  <div className="border-b border-blue-200 pb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Perfil de Usuario</h3>
                    <p className="text-gray-600">Gestiona tu información personal y preferencias.</p>
                  </div>
                  <div className="border-b border-blue-200 pb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Notificaciones</h3>
                    <p className="text-gray-600">Configura cómo y cuándo recibir notificaciones.</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Sistema</h3>
                    <p className="text-gray-600">Configuraciones generales del sistema.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "crear-obra":
        return (
          <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Crear obra</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Cliente */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Cliente</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar cliente..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                      {mockClientes.map((cliente) => (
                        <div key={cliente.id} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <span className="text-gray-900">{cliente.nombre}</span>
                        </div>
                      ))}
                    </div>
                    
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors">
                      Nuevo Cliente
                    </button>
                  </div>

                  {/* Arquitecto */}
                  <div className="space-y-4">
                    <div className="relative">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Arquitecto</h3>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    defaultChecked
                                />
                                <div className="w-11 h-6 bg-green-500 rounded-full relative cursor-pointer">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                      
                    
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar arquitecto..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                      {mockArquitectos.map((arquitecto) => (
                        <div key={arquitecto.id} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <span className="text-gray-900">{arquitecto.nombre}</span>
                        </div>
                      ))}
                    </div>
                    
                    <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2.5 rounded-lg font-medium transition-colors">
                      Nuevo Arquitecto
                    </button>
                  </div>

                  {/* Datos obra */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Datos obra</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la obra</label>
                      <input
                        type="text"
                        placeholder="Ingrese el nombre de la obra"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Localidad</label>
                        <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>San Lorenzo</option>
                          <option>Rosario</option>
                          <option>Santa Fe</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                        <input
                          type="text"
                          placeholder="Dirección completa"
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha fin estimativo</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                      <textarea
                        rows={4}
                        placeholder="Descripción de la obra..."
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Presupuesto</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                        <input
                          type="number"
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adjuntar Presupuesto</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Haga clic para subir archivos o arrástrelos aquí</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button 
                    onClick={() => setCurrentSection("obras")}
                    className="flex-1 bg-white hover:bg-gray-50 text-gray-700 py-3 rounded-lg font-medium border border-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors">
                    Crear Obra
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case "crear-cliente":
        return (
          <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto">
              
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Crear Cliente</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 mr-2" />
                      Nombre
                    </label>
                    <input
                      type="text"
                      placeholder="Ingrese el nombre"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                    <input
                      type="text"
                      placeholder="Ingrese el apellido"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="ejemplo@email.com"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Localidad</label>
                    <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Seleccione...</option>
                      <option>San Lorenzo</option>
                      <option>Rosario</option>
                      <option>Santa Fe</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                    <input
                      type="text"
                      placeholder="Calle y número"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CP</label>
                    <input
                      type="text"
                      placeholder="Código postal"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Razón Social</label>
                    <input
                      type="text"
                      placeholder="Nombre de la empresa (opcional)"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CUIL</label>
                    <input
                      type="text"
                      placeholder="XX-XXXXXXXX-X"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                    <div className="flex">
                      <input
                        type="tel"
                        placeholder="+54 11 1234-5678"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button className="px-3 py-2.5 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-50">
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button 
                    onClick={() => setCurrentSection("clientes")}
                    className="flex-1 bg-white hover:bg-gray-50 text-gray-700 py-3 rounded-lg font-medium border border-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors">
                    Crear Cliente
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-2xl mx-auto">
              <div className="bg-blue-100 border-2 border-blue-400 rounded-xl p-8 space-y-6">
                <div className="border-b border-blue-300 pb-4">
                  <h1 className="text-2xl font-semibold text-gray-800">
                    Bienvenido, <span className="text-blue-600">{userName || 'Emiliano Luhmann'}</span>!
                  </h1>
                </div>
                
                <div className="border-b border-blue-300 pb-4">
                  <h2 className="text-lg font-medium text-gray-800 mb-3">
                    Esto es <span className="text-blue-600 font-semibold">SIGMA - LA</span>
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Tu sistema integral para la gestión del proceso productivo de producción de aberturas.
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    Actualmente te encuentras en la sección de{" "}
                    <span className="text-blue-600 font-semibold">Coordinación</span>. ¡Descubre que puedes hacer!
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={() => setCurrentSection("crear-obra")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
                  >
                    Crear Nueva Obra
                  </button>
                  <button
                    onClick={() => setCurrentSection("crear-cliente")}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
                  >
                    Crear Nuevo Cliente
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-white shadow-lg border-r border-gray-200">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-6 py-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-blue-600">SIGMA - LA</h1>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = currentSection === item.id || 
                  (item.id === "obras" && currentSection.includes("obra")) ||
                  (item.id === "clientes" && currentSection.includes("cliente"))
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
            
            {/* User section */}
            <div className="flex-shrink-0 border-t border-gray-200 p-4">
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-900">{userName || 'Emiliano Luhmann'}</p>
                <p className="text-xs text-gray-500">Coordinación</p>
              </div>
              <button
                onClick={onLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-0 z-50 ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4 mb-6">
              <h1 className="text-xl font-bold text-blue-600">SIGMA - LA</h1>
            </div>
            <nav className="px-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = currentSection === item.id || 
                  (item.id === "obras" && currentSection.includes("obra")) ||
                  (item.id === "clientes" && currentSection.includes("cliente"))
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium rounded-lg transition-all ${
                      isActive
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>
          
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-900">{userName || 'Emiliano Luhmann'}</p>
              <p className="text-xs text-gray-500">Coordinación</p>
            </div>
            <button
              onClick={onLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:pl-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 flex justify-between items-center h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {menuItems.find(item => currentSection === item.id || 
                (item.id === "obras" && currentSection.includes("obra")) ||
                (item.id === "clientes" && currentSection.includes("cliente")))?.label || "Dashboard"}
            </h1>
            <div></div> {/* Spacer */}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 min-h-0 bg-gray-50">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}