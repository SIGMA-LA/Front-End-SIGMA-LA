"use client"

import { useState } from "react"
import LoginForm from "../components/LoginForm"
import './globals.css'

/*
import Dashboard from "../dashboard"
import AdminDashboard from "../pages/admin-dashboard"
import EncargadoDashboard from "../pages/encargado-dashboard"
import { GlobalProvider } from "../context/GlobalContext"
import VisitadorDashboard from "../pages/visitador-dashboard"

import type { Usuario } from "../types"
import { mockUsuarios, credencialesPrueba } from "../data/mockUsers"
*/

export default function Page() {
  const handleLogin = (usuario: string, contrasena: string) => {
    console.log("Usuario:", usuario, "Contraseña:", contrasena)
    return true
  }

  return (
    <div className="min-h-screen w-full">
      <LoginForm onLogin={handleLogin} />
    </div>
  )
}