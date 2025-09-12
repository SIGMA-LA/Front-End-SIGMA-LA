import React from "react"
import { ChevronRight, Home, User as UserIcon } from "lucide-react"
import type { User } from "../types"
import { Button } from "./ui/Button"

interface UnifiedHeaderProps {
  user: User
  onLogout: () => void
}

export default function UnifiedHeader({ user, onLogout }: UnifiedHeaderProps) {
  return (
    <header className="bg-blue-600 text-white shadow-md h-20">
      <div className="container mx-auto flex items-center justify-between h-full">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-white/20 rounded-md">
            <Home className="w-6 h-6" />
          </div>
          <div className="flex items-center">
            <ChevronRight className="w-7 h-7 opacity-50" />
            <ChevronRight className="w-7 h-7 -ml-4 opacity-70" />
            <ChevronRight className="w-7 h-7 -ml-4" />
          </div>
          <h1 className="text-xl font-bold tracking-wider">SIGMA - LA</h1>
        </div>

        <div className="items-right flex items-center space-x-4">
          <span className="text-sm">
            {user.nombre}, {user.apellido}
          </span>
          <div className="p-2 bg-white/20 rounded-full">
            <UserIcon className="w-5 h-5" />
          </div>
          <Button
            onClick={onLogout}
            className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1 rounded-md"
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  )
}