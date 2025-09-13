"use client"

import { useState } from "react"
import { Building2, Users, Calendar, Package, Plus, Settings, Menu, X, Home } from "lucide-react"

// Importar componentes
import CrearCliente from "@/components/CrearCliente"
import CrearObra from "@/components/CrearObra"
import Configuraciones from "@/components/Configuraciones"
import EntregasList from "@/components/EntregasList"
import VisitasList from "@/components/VisitasList"
import ObrasList from "@/components/ObrasList"
import ClientesList from "@/components/ClientesList"
import CrearVisita from "@/components/CrearVisita"
import CrearEntrega from "@/components/CrearEntrega"
import { DashboardProps } from "@/types"


export default function CoordDashboard() {
    const [currentSection, setCurrentSection] = useState("dashboard")
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [selectedObra, setSelectedObra] = useState<any>(null) // Replace 'any' with the correct type if available
    
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
    <ObrasList 
      onCreateClick={() => setCurrentSection("crear-obra")}
      onScheduleVisit={(obra) => {
        setSelectedObra(obra)
        setCurrentSection("crear-visita")
      }}
      onScheduleEntrega={(obra) => {
        setSelectedObra(obra)
        setCurrentSection("crear-entrega")
      }}
    />
  )
      
      case "clientes":
        return <ClientesList onCreateClick={() => setCurrentSection("crear-cliente")} />
      
      case "visitas":
        return <VisitasList onCreateClick={() => setCurrentSection("crear-visita")} />
      
      case "entregas":
        return <EntregasList onCreateClick={() => { setCurrentSection("crear-entrega") }} />
      
      case "configuraciones":
        return <Configuraciones />

      case "crear-visita":
        return (
          <CrearVisita 
            onCancel={() => {
              setCurrentSection(selectedObra ? "obras" : "visitas")
              setSelectedObra(null)
            }}
            onSubmit={(visitaData) => {
              // Aquí puedes agregar lógica para guardar la visita
              console.log("Visita creada:", visitaData)
              setCurrentSection(selectedObra ? "obras" : "visitas")
              setSelectedObra(null)
            }}
            preloadedObra={selectedObra}
          />
        )

      case "crear-entrega":
        return (
          <CrearEntrega
            onCancel={() => {
              setCurrentSection(selectedObra ? "obras" : "entregas")
              setSelectedObra(null)
            }}
            onSubmit={(entregaData) => {
              // Aquí puedes agregar lógica para guardar la entrega
              console.log("Entrega creada:", entregaData)
              setCurrentSection(selectedObra ? "obras" : "entregas")
              setSelectedObra(null)
            }}
            preloadedObra={selectedObra}
          />
        )
      
      case "clientes":
        return <ClientesList onCreateClick={() => setCurrentSection("crear-cliente")} />
      
      case "visitas":
        return <VisitasList onCreateClick={() => { /* TODO: implement create visita logic */ }} />
      
      case "entregas":
        return <EntregasList onCreateClick={() => { /* TODO: implement create entrega logic */ }} />
      
      case "configuraciones":
        return <Configuraciones />

      case "crear-obra":
        return (
          <CrearObra 
            onCancel={() => setCurrentSection("obras")}
            onSubmit={(obraData) => {
              // Aquí puedes agregar lógica para guardar la obra
              console.log("Obra creada:", obraData)
              setCurrentSection("obras")
            }}
          />
        )

      case "crear-cliente":
        return (
          <CrearCliente 
            onCancel={() => setCurrentSection("clientes")}
            onSubmit={(clienteData) => {
              // Aquí puedes agregar lógica para guardar el cliente
              console.log("Cliente creado:", clienteData)
              setCurrentSection("clientes")
            }}
          />
        )
      
      default:
        return (
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-2xl mx-auto">
              <div className="bg-blue-100 border-2 border-blue-400 rounded-xl p-8 space-y-6">
                <div className="border-b border-blue-300 pb-4">
                  <h1 className="text-2xl font-semibold text-gray-800">
                    Bienvenido, <span className="text-blue-600">{'Emiliano Luhmann'}</span>!
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
                <p className="text-sm font-medium text-gray-900">{'Emiliano Luhmann'}</p>
                <p className="text-xs text-gray-500">Coordinación</p>
              </div>
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
                (item.id === "clientes" && currentSection.includes("cliente")) ||
                (item.id === "visitas" && currentSection.includes("visita")))?.label || "Dashboard"}
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