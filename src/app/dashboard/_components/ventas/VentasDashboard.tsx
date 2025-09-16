'use client'

import { useState } from 'react'
import {
  Building2,
  Users,
  Calendar,
  Package,
  Plus,
  Settings,
  Menu,
  X,
  Home,
} from 'lucide-react'

// Importar componentes
import CrearCliente from './CrearCliente' // Ventas
import CrearObra from './CrearObra' // Coordinacion
import Configuraciones from './Configuraciones' // Hacer uno para cada rol
import EntregasList from '../shared/EntregasList' // Shared
import VisitasList from '../shared/VisitasList' // Shared
import ObrasList from '../shared/ObrasList' // Shared
import ClientesList from '../shared/ClientesList' // Shared

export default function VentasDashboard() {
  const [currentSection, setCurrentSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedObra, setSelectedObra] = useState<any>(null) // Replace 'any' with the correct type if available

  const handleNavigation = (section: string) => {
    setCurrentSection(section)
    setSidebarOpen(false) // Cerrar sidebar en mobile después de navegar
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'obras', label: 'Obras', icon: Building2 },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'visitas', label: 'Visitas', icon: Calendar },
    { id: 'entregas', label: 'Entregas', icon: Package },
    { id: 'configuraciones', label: 'Configuraciones', icon: Settings },
  ]

  const renderContent = () => {
    switch (currentSection) {
      case 'obras':
        return (
          <ObrasList
            onCreateClick={() => setCurrentSection('crear-obra')}
            onScheduleVisit={(obra) => {
              setSelectedObra(obra)
            }}
            onScheduleEntrega={(obra) => {
              setSelectedObra(obra)
            }}
          />
        )

      case 'clientes':
        return (
          <ClientesList
            onCreateClick={() => setCurrentSection('crear-cliente')}
          />
        )

      case 'visitas':
        return (
          <VisitasList
          onCreateClick={() => {}}
          />
        )

      case 'entregas':
        return (
          <EntregasList
          onCreateClick={() => {}}
          />
        )

      case 'configuraciones':
        return <Configuraciones />

      case 'clientes':
        return (
          <ClientesList
            onCreateClick={() => setCurrentSection('crear-cliente')}
          />
        )

      case 'visitas':
        return (
          <VisitasList
            onCreateClick={() => {
              /* TODO: implement create visita logic */
            }}
          />
        )

      case 'entregas':
        return (
          <EntregasList
            onCreateClick={() => {
              /* TODO: implement create entrega logic */
            }}
          />
        )

      case 'configuraciones':
        return <Configuraciones />

      case 'crear-obra':
        return (
          <CrearObra
            onCancel={() => setCurrentSection('obras')}
            onSubmit={(obraData) => {
              // Aquí puedes agregar lógica para guardar la obra
              console.log('Obra creada:', obraData)
              setCurrentSection('obras')
            }}
          />
        )

      case 'crear-cliente':
        return (
          <CrearCliente
            onCancel={() => setCurrentSection('clientes')}
            onSubmit={(clienteData) => {
              // Aquí puedes agregar lógica para guardar el cliente
              console.log('Cliente creado:', clienteData)
              setCurrentSection('clientes')
            }}
          />
        )

      default:
        return (
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-2xl">
              <div className="space-y-6 rounded-xl border-2 border-blue-400 bg-blue-100 p-8">
                <div className="border-b border-blue-300 pb-4">
                  <h1 className="text-2xl font-semibold text-gray-800">
                    Bienvenido,{' '}
                    <span className="text-blue-600">{'Emiliano Luhmann'}</span>!
                  </h1>
                </div>

                <div className="border-b border-blue-300 pb-4">
                  <h2 className="mb-3 text-lg font-medium text-gray-800">
                    Esto es{' '}
                    <span className="font-semibold text-blue-600">
                      SIGMA - LA
                    </span>
                  </h2>
                  <p className="leading-relaxed text-gray-700">
                    Tu sistema integral para la gestión del proceso productivo
                    de producción de aberturas.
                  </p>
                </div>

                <div>
                  <p className="leading-relaxed text-gray-700">
                    Actualmente te encuentras en la sección de{' '}
                    <span className="font-semibold text-blue-600">
                      Ventas
                    </span>
                    . ¡Descubre que puedes hacer!
                  </p>
                </div>

                <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                  <button
                    onClick={() => setCurrentSection('crear-obra')}
                    className="rounded-md bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    Crear Nueva Obra
                  </button>
                  <button
                    onClick={() => setCurrentSection('crear-cliente')}
                    className="rounded-md bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700"
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex w-64 flex-col">
          <div className="flex flex-grow flex-col border-r border-gray-200 bg-white shadow-lg">
            {/* Navigation */}
            <nav className="flex-1 space-y-2 px-4 py-4">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive =
                  currentSection === item.id ||
                  (item.id === 'obras' && currentSection.includes('obra')) ||
                  (item.id === 'clientes' && currentSection.includes('cliente'))

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`flex w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'border border-blue-200 bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
      >
        <div
          className="bg-opacity-75 fixed inset-0 bg-gray-600"
          onClick={() => setSidebarOpen(false)}
        ></div>
        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
            <div className="mb-6 flex flex-shrink-0 items-center px-4">
              <h1 className="text-xl font-bold text-blue-600">SIGMA - LA</h1>
            </div>
            <nav className="space-y-1 px-4">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive =
                  currentSection === item.id ||
                  (item.id === 'obras' && currentSection.includes('obra')) ||
                  (item.id === 'clientes' && currentSection.includes('cliente'))

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`flex w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium transition-all ${
                      isActive
                        ? 'border border-blue-200 bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
      <div className="flex flex-1 flex-col lg:pl-0">
        {/* Mobile Header */}
        <header className="border-b border-gray-200 bg-white shadow-sm lg:hidden">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-inset"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {menuItems.find(
                (item) =>
                  currentSection === item.id ||
                  (item.id === 'obras' && currentSection.includes('obra')) ||
                  (item.id === 'clientes' &&
                    currentSection.includes('cliente')) ||
                  (item.id === 'visitas' && currentSection.includes('visita'))
              )?.label || 'Dashboard'}
            </h1>
            <div></div> {/* Spacer */}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="min-h-0 flex-1 bg-gray-50">{renderContent()}</main>
      </div>
    </div>
  )
}
