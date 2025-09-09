"use client"

import { useState } from "react"
import LoginForm from "../components/LoginForm"
import DashboardSwitcher from "../components/DashboardSwitcher"
import { GlobalProvider } from "../context/GlobalContext"
// No importamos más mockUsers
import type { User } from "../types"
import "./globals.css"

export default function Page() {
  const [user, setUser] = useState<User | null>(null)

  // La lógica de login ahora es autónoma
  const handleLogin = (username: string): boolean => {
    const lowerUsername = username.toLowerCase()

    // Definimos los usuarios válidos directamente aquí
    if (lowerUsername === "carlchen") {
      setUser({ id: 1, nombre: "Carlchen", apellido: "Gugliermino", rol: "Visitador" })
      return true
    }
    if (lowerUsername === "diego") {
      setUser({ id: 2, nombre: "Diego", apellido: "Lezcano", rol: "Encargado" })
      return true
    }
    
    // Si el usuario no coincide, el login falla
    return false
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <GlobalProvider>
      <div className="min-h-screen w-full bg-gray-50">
        {user ? (
          <DashboardSwitcher user={user} onLogout={handleLogout} />
        ) : (
          <LoginForm onLogin={handleLogin} />
        )}
      </div>
    </GlobalProvider>
  )
}