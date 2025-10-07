'use client'

import { useState, useEffect } from 'react'
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
  Wrench,
  Car,
  PackageOpen,
  ClipboardList,
} from 'lucide-react'

import Configuraciones from './Configuraciones'
import EntregasList from '../shared/EntregasList'
import VisitasList from '../shared/VisitasList'
import ObrasList from '../shared/ObrasList'
import ClientesList from '../shared/ClientesList'
import CrearVisita from './CrearVisita'
import CrearEntrega from './CrearEntrega'
import PedidosList from './PedidosList'
import RegistrarPedido from './RegistrarPedido'
import MaquinariaList from './maquinaria/MaquinariaList'
import VehículosList from './VehiculosList'
import CrearVehiculo from './CrearVehiculo'
import EditarVehiculo from './EditarVehiculo' // 1. Importar el nuevo componente
import { Vehiculo } from '@/types' // Importar el tipo
import OrdenesProduccionView from './ordenes_produccion/OrdenesProduccionView'

import type { Empleado } from '@/types'
import { obtenerEmpleadoActual } from '@/actions/empleado'

export default function CoordDashboard() {
  const [currentSection, setCurrentSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedObra, setSelectedObra] = useState<any>(null)
  const [usuarioActual, setUsuarioActual] = useState<Empleado | null>(null)
  const [nuevasMaquinas, setNuevasMaquinas] = useState<any[]>([])

  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(null);
  useEffect(() => {
    async function fetchUsuario() {
      const empleado = await obtenerEmpleadoActual()
      setUsuarioActual(empleado)
    }
    fetchUsuario()
  }, [])

  const handleNavigation = (section: string) => {
    setCurrentSection(section)
    setSidebarOpen(false)
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'obras', label: 'Obras', icon: Building2 },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'visitas', label: 'Visitas', icon: Calendar },
    { id: 'ordenes-produccion', label: 'Órdenes de Producción', icon: Package },
    { id: 'entregas', label: 'Entregas', icon: PackageOpen },
    { id: 'pedidos', label: 'Pedidos', icon: ClipboardList },
    { id: 'maquinarias', label: 'Maquinarias', icon: Wrench },
    { id: 'vehiculos', label: 'Vehículos', icon: Car },
    { id: 'configuraciones', label: 'Configuraciones', icon: Settings },
  ]

  const renderContent = () => {
    switch (currentSection) {
      case 'obras':
        return (
          <ObrasList
            onEditClick={(obra) => {
              setSelectedObra(obra)
              setCurrentSection('editar-obra')
            }}
            onCreateClick={() => setCurrentSection('obras')}
            onScheduleVisit={(obra) => {
              setSelectedObra(obra)
              setCurrentSection('crear-visita')
            }}
            onScheduleEntrega={(obra) => {
              setSelectedObra(obra)
              setCurrentSection('crear-entrega')
            }}
          />
        )

      case 'clientes':
        return (
          <ClientesList onCreateClick={() => setCurrentSection('clientes')} />
        )

      case 'visitas':
        return (
          <VisitasList
            onCreateClick={() => setCurrentSection('crear-visita')}
          />
        )

      case 'ordenes-produccion':
        return <OrdenesProduccionView />

      case 'entregas':
        return (
          <EntregasList
            onCreateClick={() => {
              setCurrentSection('crear-entrega')
            }}
          />
        )

      case 'configuraciones':
        return <Configuraciones />

      case 'crear-visita':
        return (
          <CrearVisita
            onCancel={() => {
              setCurrentSection(selectedObra ? 'obras' : 'visitas')
              setSelectedObra(null)
            }}
            onSubmit={(visitaData) => {
              setCurrentSection(selectedObra ? 'obras' : 'visitas')
              setSelectedObra(null)
            }}
            preloadedObra={selectedObra}
          />
        )

      case 'crear-entrega':
        return (
          <CrearEntrega
            onCancel={() => {
              setCurrentSection(selectedObra ? 'obras' : 'entregas')
              setSelectedObra(null)
            }}
            onSubmit={(entregaData) => {
              setCurrentSection(selectedObra ? 'obras' : 'entregas')
              setSelectedObra(null)
            }}
            preloadedObra={selectedObra}
          />
        )

      case 'registrar-pedido':
        return (
          <RegistrarPedido
            onCancel={() => {
              setCurrentSection('pedidos')
              setSelectedObra(null)
            }}
            onSubmit={(pedidoData) => {
              setCurrentSection('pedidos')
              setSelectedObra(null)
            }}
            preloadedObra={selectedObra}
          />
        )

      case 'pedidos':
        return (
          <PedidosList
            onCreateClick={() => setCurrentSection('registrar-pedido')}
            onSchedulePedido={(obra) => {
              setSelectedObra(obra)
              setCurrentSection('registrar-pedido')
            }}
          />
        )

      case 'maquinarias':
        return <MaquinariaList />

      case 'vehiculos':
        return (
          <VehículosList
            onCreateClick={() => setCurrentSection('crear-vehiculo')}
             onEditClick={(vehiculo) => {
              setSelectedVehiculo(vehiculo);
              setCurrentSection('editar-vehiculo');
            }}
          />
        )

      case 'crear-vehiculo':
        return (
          <CrearVehiculo
            onCancel={() => setCurrentSection('vehiculos')}
            onSubmit={() => setCurrentSection('vehiculos')}
          />
        )

      case 'editar-vehiculo':
        // Nos aseguramos de que haya un vehículo seleccionado antes de renderizar
        return selectedVehiculo ? (
            <EditarVehiculo
                vehiculo={selectedVehiculo}
                onCancel={() => {
                    setCurrentSection('vehiculos');
                    setSelectedVehiculo(null); // Limpiar el estado
                }}
                onSubmit={() => {
                    setCurrentSection('vehiculos');
                    setSelectedVehiculo(null); // Limpiar el estado
                    // Opcional: podrías querer refrescar la lista de vehículos aquí
                }}
            />
        ) : null; // Si no hay vehículo seleccionado, no renderizar nada o un fallback

      case 'configuraciones':
        return <Configuraciones />

      default:
        return (
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-2xl">
              <div className="space-y-6 rounded-xl border-2 border-blue-400 bg-blue-100 p-8">
                <div className="border-b border-blue-300 pb-4">
                  <h1 className="text-2xl font-semibold text-gray-800">
                    Bienvenido,{' '}
                    <span className="text-blue-600">
                      {usuarioActual
                        ? `${usuarioActual.nombre} ${usuarioActual.apellido}`
                        : ''}
                    </span>
                    !
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
                      Coordinación
                    </span>
                    .
                  </p>
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
            <nav className="flex-1 space-y-2 px-4 py-4">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive =
                  currentSection === item.id ||
                  (item.id === 'obras' && currentSection.includes('obra')) ||
                  (item.id === 'clientes' &&
                    currentSection.includes('cliente')) ||
                  (item.id === 'maquinarias' &&
                    currentSection.includes('maquinaria')) ||
                  (item.id === 'ordenes-produccion' &&
                    currentSection.includes('ordenes'))

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
        className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
      >
        <div
          className="absolute inset-0 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>

        <div className="relative flex h-full w-64 max-w-xs flex-1 flex-col bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-white focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pt-5 pb-4">
            <div className="mb-6 flex flex-shrink-0 items-center px-4">
              <h1 className="text-xl font-bold text-blue-600">SIGMA - LA</h1>
            </div>
            <nav className="space-y-1 px-4">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive =
                  currentSection === item.id ||
                  (item.id === 'obras' && currentSection.includes('obra')) ||
                  (item.id === 'clientes' &&
                    currentSection.includes('cliente')) ||
                  (item.id === 'maquinarias' &&
                    currentSection.includes('maquinaria')) ||
                  (item.id === 'ordenes-produccion' &&
                    currentSection.includes('ordenes'))

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`flex w-full items-center rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
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
              className="p-1 text-gray-600 hover:text-gray-900 focus:outline-none"
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
                  (item.id === 'visitas' &&
                    currentSection.includes('visita')) ||
                  (item.id === 'maquinarias' &&
                    currentSection.includes('maquinaria')) ||
                  (item.id === 'ordenes-produccion' &&
                    currentSection.includes('ordenes'))
              )?.label || 'Dashboard'}
            </h1>
            <div className="w-6"></div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="min-h-0 flex-1 bg-gray-50">{renderContent()}</main>
      </div>
    </div>
  )
}
