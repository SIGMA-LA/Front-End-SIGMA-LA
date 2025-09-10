"use client"

import { Users, BarChart3, Building, LogOut, Home } from "lucide-react";
import { mockUsuarios } from "@/data/mockData";
import { Button } from "../ui/Button";
import { useGlobalContext } from "@/context/GlobalContext";

export default function Navbar() {
    const { currentSection, setCurrentSection } = useGlobalContext();

    const usuarioLogueado = mockUsuarios.find(u => u.rol === 'admin') || {
      nombre: 'Carlos',
      apellido: 'Mendoza',
      rol: 'admin'
    };

    const onLogout = () => {
        alert("Cerrando sesión...");
        window.location.href = '/login';
    }

    return (
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-6 py-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <Building className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-xl font-bold">SIGMA - LA</h1>
                <p className="text-sm text-gray-300">Panel Administrativo</p>
              </div>
            </div>

            <nav className="hidden md:flex space-x-2">
              <button onClick={() => setCurrentSection("dashboard")} className={`px-3 py-2 rounded-md transition-colors text-sm flex items-center space-x-2 ${currentSection === "dashboard" ? "bg-slate-700" : "hover:bg-white hover:bg-opacity-10"}`}>
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button onClick={() => setCurrentSection("empleados")} className={`px-3 py-2 rounded-md transition-colors text-sm flex items-center space-x-2 ${currentSection === "empleados" ? "bg-slate-700" : "hover:bg-white hover:bg-opacity-10"}`}>
                <Users className="w-4 h-4" />
                <span>Empleados</span>
              </button>
               <button onClick={() => setCurrentSection("reportes")} className={`px-3 py-2 rounded-md transition-colors text-sm flex items-center space-x-2 ${currentSection === "reportes" ? "bg-slate-700" : "hover:bg-white hover:bg-opacity-10"}`}>
                <BarChart3 className="w-4 h-4" />
                <span>Reportes</span>
              </button>
               <button onClick={() => setCurrentSection("obras")} className={`px-3 py-2 rounded-md transition-colors text-sm flex items-center space-x-2 ${currentSection === "obras" ? "bg-slate-700" : "hover:bg-white hover:bg-opacity-10"}`}>
                <Building className="w-4 h-4" />
                <span>Obras</span>
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium text-sm">{usuarioLogueado.nombre} {usuarioLogueado.apellido}</p>
              <p className="text-xs text-gray-300">Administrador</p>
            </div>
            <Button onClick={onLogout} variant="destructive" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              <span>Salir</span>
            </Button>
          </div>
        </div>
      </header>
  )
}