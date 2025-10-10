'use client'

import { useState, useEffect } from 'react'
import {
  Building2,
  Users,
  Calendar,
  Settings,
  Menu,
  X,
  Home,
  PackageOpen,
  DollarSign,
} from 'lucide-react'

import { useGlobalContext } from '@/context/GlobalContext'
import type { Empleado, Obra } from '@/types'

import CrearCliente from './CrearCliente'
import CrearObra from './CrearObra'
import Configuraciones from './Configuraciones'
import EntregasList from '../shared/EntregasList'
import VisitasList from '../shared/VisitasList'
import ObrasList from '../shared/ObrasList'
import ClientesList from '../shared/ClientesList'
import { ObraFormData } from '@/services/obra.service'
import { PresupuestoFormData } from '@/services/presupuesto.service'
import PagosList from './pagos/PagosList'
import { obtenerEmpleadoActual } from '@/actions/empleado'
import NotaFabricaModal from './NotaFabricaModal'
import { getObraById } from '@/services/obra.service'

export default function VentasDashboard() {
  const [currentSection, setCurrentSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedObra, setSelectedObra] = useState<Obra | null>(null)
  const [usuarioActual, setUsuarioActual] = useState<Empleado | null>(null)
  const [obraParaEditar, setObraParaEditar] = useState<Obra | null>(null)
  const [isNotaModalOpen, setIsNotaModalOpen] = useState(false)
  const [notaUrl, setNotaUrl] = useState<string | null>(null)
  const [codObra, setCodObra] = useState<number | null>(null)

  const {
    createObra,
    updateObra,
    createPresupuesto,
    updatePresupuesto,
    fetchObras,
  } = useGlobalContext()

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

  const handleUploadSuccess = (url: string) => {
    setNotaUrl(url)
    fetchObras()
  }
  const handleEditObra = async (obra: Obra) => {
    const obraCompleta = await getObraById(obra.cod_obra)
    setObraParaEditar(obraCompleta)
    setCurrentSection('editar-obra')
  }

  const openNotaModal = (obra: Obra) => {
    console.log('Abriendo modal para obra:', obra)
    console.log('Rol', usuarioActual?.rol_actual)
    setCodObra(obra.cod_obra)
    setNotaUrl(obra.nota_fabrica || null)
    setIsNotaModalOpen(true)
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'obras', label: 'Obras', icon: Building2 },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'visitas', label: 'Visitas', icon: Calendar },
    { id: 'entregas', label: 'Entregas', icon: PackageOpen },
    { id: 'pagos', label: 'Pagos', icon: DollarSign },
    { id: 'configuraciones', label: 'Configuraciones', icon: Settings },
  ]

  const renderContent = () => {
    switch (currentSection) {
      case 'obras':
        return (
          <ObrasList
            onCreateClick={() => {
              setObraParaEditar(null)
              setCurrentSection('crear-obra')
            }}
            onEditClick={handleEditObra}
            onScheduleVisit={(obra) => {
              setSelectedObra(obra)
              setCurrentSection('crear-visita')
            }}
            onScheduleEntrega={(obra) => {
              setSelectedObra(obra)
              setCurrentSection('crear-entrega')
            }}
            onNotaFabricaClick={openNotaModal}
          />
        )

      case 'crear-obra':
        return (
          <CrearObra
            onCancel={() => setCurrentSection('obras')}
            onSubmit={async (
              obraData: ObraFormData,
              presupuesto: PresupuestoFormData[]
            ) => {
              try {
                const nuevaObra = await createObra(obraData)

                if (nuevaObra && nuevaObra.cod_obra && presupuesto.length > 0) {
                  for (const presupuestoData of presupuesto) {
                    await createPresupuesto(presupuestoData, nuevaObra.cod_obra)
                  }
                }
                await fetchObras()
                setCurrentSection('obras')
              } catch (error) {
                console.error('Error en el proceso de creación:', error)
                alert('Hubo un error al crear la obra o su presupuesto.')
              }
            }}
          />
        )

      case 'editar-obra':
        return (
          <CrearObra
            obraExistente={obraParaEditar}
            onCancel={() => {
              setCurrentSection('obras')
              setObraParaEditar(null)
            }}
            onSubmit={async (
              obraData: ObraFormData,
              presupuestos: PresupuestoFormData[]
            ) => {
              if (!obraParaEditar) return
              try {
                await updateObra(obraParaEditar.cod_obra, obraData)
                for (const p of presupuestos) {
                  const presupuestoNormalizado = {
                    ...p,
                    fecha_emision: p.fecha_emision.includes('T')
                      ? p.fecha_emision.split('T')[0]
                      : p.fecha_emision,
                    fecha_aceptacion: p.fecha_aceptacion
                      ? p.fecha_aceptacion.includes('T')
                        ? p.fecha_aceptacion.split('T')[0]
                        : p.fecha_aceptacion
                      : undefined,
                  }
                  if (
                    presupuestoNormalizado.nro_presupuesto &&
                    presupuestoNormalizado.nro_presupuesto > 0
                  ) {
                    const esPresupuestoExistente =
                      obraParaEditar.presupuesto?.some(
                        (pe) =>
                          pe.nro_presupuesto ===
                          presupuestoNormalizado.nro_presupuesto
                      )

                    if (esPresupuestoExistente) {
                      try {
                        await updatePresupuesto(
                          presupuestoNormalizado.nro_presupuesto,
                          {
                            valor: presupuestoNormalizado.valor,
                            fecha_emision: presupuestoNormalizado.fecha_emision,
                            fecha_aceptacion:
                              presupuestoNormalizado.fecha_aceptacion,
                          }
                        )
                      } catch (error) {
                        console.error('Error al actualizar presupuesto:', error)
                        throw error
                      }
                    } else {
                      await createPresupuesto(
                        presupuestoNormalizado,
                        obraParaEditar.cod_obra
                      )
                    }
                  } else {
                    await createPresupuesto(
                      presupuestoNormalizado,
                      obraParaEditar.cod_obra
                    )
                  }
                }
                await fetchObras()
                setCurrentSection('obras')
                setObraParaEditar(null)
              } catch (error) {
                console.error(
                  'Error al actualizar la obra o sus presupuestos:',
                  error
                )
                alert(
                  `Hubo un error al actualizar los datos: ${error instanceof Error ? error.message : 'Error desconocido'}`
                )
              }
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
        return <VisitasList onCreateClick={() => {}} onEditClick={() => {}} />

      case 'entregas':
        return <EntregasList onCreateClick={() => {}} />

      case 'pagos':
        return (
          <div className="p-8 text-center text-lg text-gray-600">
            <PagosList />
          </div>
        )

      case 'configuraciones':
        return <Configuraciones />

      case 'crear-cliente':
        return (
          <CrearCliente
            onCancel={() => setCurrentSection('clientes')}
            onSubmit={(clienteData) => {
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
                    <span className="font-semibold text-blue-600">Ventas</span>.
                    ¡Descubre que puedes hacer!
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
        <div className="flex w-64 flex-col border-r border-gray-200 bg-white">
          <nav className="flex flex-1 flex-col space-y-2 p-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = currentSection.startsWith(item.id)
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
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Mobile */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
      >
        <div
          className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"
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
                const isActive = currentSection.startsWith(item.id)
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

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm lg:hidden">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {menuItems.find((item) => currentSection.startsWith(item.id))
                ?.label || 'Dashboard'}
            </h1>
            <div className="w-6"></div>
          </div>
        </header>

        <main className="flex-1">{renderContent()}</main>
      </div>

      {/* Nota de Fábrica Modal */}
      {isNotaModalOpen && codObra !== null && (
        <NotaFabricaModal
          isOpen={isNotaModalOpen}
          onClose={() => setIsNotaModalOpen(false)}
          notaUrl={notaUrl}
          codObra={codObra}
          onUploadSuccess={handleUploadSuccess}
          rolActual={usuarioActual?.rol_actual}
        />
      )}
    </div>
  )
}
