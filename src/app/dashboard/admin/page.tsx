'use client'

import { useState } from 'react'
import { Users, Building, BarChart3, Home, Menu, X } from 'lucide-react'
import DashboardView from '@/components/admin/DashboardView'
import EmpleadosView from '@/components/admin/EmpleadosView'
import ReportesView from '@/components/admin/ReportesView'
import ObrasView from '@/components/admin/ObrasView'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'empleados', label: 'Empleados', icon: Users },
  { id: 'reportes', label: 'Reportes', icon: BarChart3 },
  { id: 'obras', label: 'Obras', icon: Building },
]

export default function Page() {
  const [currentSection, setCurrentSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleNavigation = (section: string) => {
    setCurrentSection(section)
    setSidebarOpen(false)
  }

  const renderContent = () => {
    switch (currentSection) {
      case 'empleados':
        return <EmpleadosView />
      case 'reportes':
        return <ReportesView />
      case 'obras':
        return <ObrasView />
      case 'dashboard':
      default:
        return <DashboardView onNavigate={setCurrentSection} />
    }
  }

  const SidebarContent = () => (
    <nav className="flex-1 space-y-2 p-4">
      {menuItems.map((item) => {
        const Icon = item.icon
        const isActive = currentSection === item.id
        return (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.id)}
            className={`flex w-full items-center rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
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
  )

  return (
    <div className="flex min-h-[calc(100vh-68px)]">
      <aside className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white md:flex md:flex-col">
        <SidebarContent />
      </aside>

      <div
        className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
      >
        <div
          className="absolute inset-0 bg-black opacity-50"
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
              <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
            </div>
            <SidebarContent />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm md:hidden">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {menuItems.find((item) => currentSection === item.id)?.label ||
                'Dashboard'}
            </h1>
            <div className="w-6"></div>
          </div>
        </header>

        <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{renderContent()}</div>
        </main>
      </div>
    </div>
  )
}
