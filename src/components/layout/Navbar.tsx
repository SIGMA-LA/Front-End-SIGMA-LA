'use client'

import { LogOut, Home, Sigma } from 'lucide-react'
import { Button } from '../ui/Button'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const { usuario, cargando, logout } = useAuth()

  const onLogout = () => {
    logout()
    window.location.href = '/login'
  }

  if (cargando || !usuario) {
    return null
  }

  return (
    <header className="sticky top-0 z-30 bg-slate-900 px-6 py-3 text-white shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Sigma className="h-8 w-8 text-white" />
          <h1 className="text-xl font-bold">SIGMA - LA</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium">
              {usuario.nombre} {usuario.apellido}
            </p>
            <p className="text-xs text-gray-300 capitalize">
              {usuario.rol_actual}
            </p>
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
