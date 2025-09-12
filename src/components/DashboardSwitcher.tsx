import React from "react"
import type { Usuario } from "../types/index.ts"
import EncargadoDashboard from "../pages/encargado-dashboard"
import VisitadorDashboard from "../pages/visitador-dashboard"
import AdminDashboard from "../pages/admin-dashboard"
import CoordinacionDashboard from "../pages/coordinacion-dashboard"
//import Navbar from "./Navbar"

interface DashboardSwitcherProps {
  user: Usuario
  onLogout: () => void
}

export default function DashboardSwitcher({ user, onLogout }: DashboardSwitcherProps) {
  const renderDashboard = () => {
    switch (user.rol) {
        case "encargado":
            return <EncargadoDashboard user={user} onLogout={onLogout} />
        case "visitador":
            return <VisitadorDashboard user={user} onLogout={onLogout} />
        case "admin":
            return <AdminDashboard />
        case "coordinacion":
            return <CoordinacionDashboard />
      default:
        return <p>Rol no reconocido. Por favor, contacta a soporte.</p>
    }
  }

  return (
    <div>
      <main className="">
        {renderDashboard()}
      </main>
    </div>
  )
}