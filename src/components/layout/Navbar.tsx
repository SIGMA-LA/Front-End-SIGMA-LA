'use client'

import { Users, BarChart3, Building, LogOut, Home, Sigma } from 'lucide-react'
import { Button } from '../ui/Button'
import { useGlobalContext } from '@/context/GlobalContext'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const { currentSection, setCurrentSection } = useGlobalContext()
  const { usuario, cargando, logout } = useAuth()

  const onLogout = () => {
    logout()
    window.location.href = '/login'
  }

  if (cargando) {
    return null
  }

  if (!usuario) {
    return null
  }

  return (
    <header className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 text-white shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <Sigma className="h-8 w-8 text-white" />
            <div>
              <h1 className="text-xl font-bold">SIGMA - LA</h1>
            </div>
          </div>

          {usuario.rol_actual === 'ADMIN' && (
            <nav className="hidden space-x-2 md:flex">
              <button
                onClick={() => setCurrentSection('dashboard')}
                className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm transition-colors ${currentSection === 'dashboard' ? 'bg-slate-700' : 'hover:bg-opacity-10 hover:bg-white'}`}
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setCurrentSection('empleados')}
                className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm transition-colors ${currentSection === 'empleados' ? 'bg-slate-700' : 'hover:bg-opacity-10 hover:bg-white'}`}
              >
                <Users className="h-4 w-4" />
                <span>Empleados</span>
              </button>
              <button
                onClick={() => setCurrentSection('reportes')}
                className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm transition-colors ${currentSection === 'reportes' ? 'bg-slate-700' : 'hover:bg-opacity-10 hover:bg-white'}`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Reportes</span>
              </button>
              <button
                onClick={() => setCurrentSection('obras')}
                className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm transition-colors ${currentSection === 'obras' ? 'bg-slate-700' : 'hover:bg-opacity-10 hover:bg-white'}`}
              >
                <Building className="h-4 w-4" />
                <span>Obras</span>
              </button>
            </nav>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium">
              {usuario.nombre} {usuario.apellido}
            </p>
            <p className="text-xs text-gray-300 capitalize">{usuario.rol_actual}</p>
          </div>
          <Button onClick={onLogout} variant="destructive" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Salir</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
