import React from "react"
import type { User } from "../types/index.ts"
import EncargadoDashboard from "../pages/encargado-dashboard"
import VisitadorDashboard from "../pages/visitador-dashboard"
import AdminDashboard from "../pages/admin-dashboard"
import CoordinacionDashboard from "../pages/coordinacion-dashboard"
//import Navbar from "./Navbar"

interface DashboardSwitcherProps {
  user: User
  onLogout: () => void
}

export default function DashboardSwitcher({ user, onLogout }: DashboardSwitcherProps) {
  const renderDashboard = () => {
    switch (user.rol) {
        case "Encargado":
            return <EncargadoDashboard />
        case "Visitador":
            return <VisitadorDashboard user={user} onLogout={onLogout} />
        case "Administrador":
            return <AdminDashboard />
        case "Coordinación":
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