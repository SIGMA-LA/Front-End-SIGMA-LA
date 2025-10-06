'use client'

import { useState } from 'react'
import { LogOut, Sigma } from 'lucide-react'
import { Button } from '../ui/Button'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const { usuario, cargando, logout } = useAuth()
  const [showModal, setShowModal] = useState(false)

  const onLogout = () => {
    logout()
    window.location.href = '/login'
  }

  if (cargando || !usuario) {
    return null
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-slate-900 px-1.5 py-3 text-white shadow-md sm:px-6 sm:py-6">
        <div className="flex w-full max-w-full items-center justify-between">
          <div className="flex min-w-0 items-center space-x-2 sm:space-x-3">
            <Sigma className="h-7 w-7 flex-shrink-0 text-white sm:h-10 sm:w-10" />
            <h1 className="truncate text-lg font-bold sm:text-2xl">
              SIGMA - LA
            </h1>
          </div>
          <div className="flex min-w-0 items-center space-x-2 sm:space-x-4">
            <div className="min-w-0 text-right">
              <p className="truncate text-xs font-medium sm:text-xl">
                {usuario.nombre} {usuario.apellido}
              </p>
              <p className="truncate text-xs text-gray-300 capitalize sm:text-xl">
                {usuario.rol_actual}
              </p>
            </div>
            <Button
              onClick={() => setShowModal(true)}
              variant="destructive"
              size="sm"
              className="ml-2 w-24 py-2 text-xs sm:w-auto sm:py-0 sm:text-base"
            >
              <LogOut className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
              <span>Salir</span>
            </Button>
          </div>
        </div>
      </header>

      {showModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-xl border border-blue-100 bg-white p-6 shadow-2xl sm:mx-0 sm:p-10">
            <div className="mb-6 flex flex-col items-center">
              <div className="flex items-center justify-center rounded-full bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 p-4 shadow">
                <Sigma className="h-12 w-12 text-blue-700 drop-shadow" />
              </div>
              <span className="mt-4 text-2xl font-bold tracking-tight text-blue-700 drop-shadow-sm">
                SIGMA <span className="font-light text-blue-500">- LA</span>
              </span>
            </div>
            <h2 className="mt-2 mb-6 text-center text-xl font-semibold text-gray-900">
              ¿Estás seguro que deseas cerrar sesión?
            </h2>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="w-full border-gray-300 text-gray-700 sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={onLogout}
                className="w-full sm:w-auto"
              >
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
