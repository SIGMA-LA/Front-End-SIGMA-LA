"use client"

import { useState } from "react"
import { ArrowLeft, Moon, Sun, Bell, User, Globe, Shield, Save, Building, DollarSign } from "lucide-react"

interface ConfiguracionesProps {
  onBack?: () => void
  className?: string
}

export default function Configuraciones({ onBack, className = "" }: ConfiguracionesProps) {
  const [configuraciones, setConfiguraciones] = useState({
    notificaciones: {
      email: true,
      push: true,
      visitas: true,
      entregas: true,
      vencimientos: true,
    },
    perfil: {
      nombre: "Usuario",
      apellido: "Aberturas",
      cuil: "20-45678912-3",
    },
    negocio: {
      presupuesto: "10",
      viaticos: "50.00",
      checkboxEjemplo: true,
    }
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleConfigChange = (section: string, field: string, value: any) => {
    setConfiguraciones((prev) => {
      if (section === "tema") {
        // "tema" is a string, not an object
        return {
          ...prev,
          tema: value,
        }
      } else {
        const sectionValue = prev[section as keyof typeof prev]
        if (typeof sectionValue !== "object" || sectionValue === null) {
          return prev // or throw an error if you want to handle this case
        }
        return {
          ...prev,
          [section]: {
            ...sectionValue,
            [field]: value,
          },
        }
      }
    })
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simular guardado
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert("Configuraciones guardadas exitosamente!")
    } catch (error) {
      alert("Error al guardar configuraciones")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Configuraciones</h1>
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Volver</span>
              </button>
            )}
            
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? "Guardando..." : "Guardar Cambios"}</span>
            </button>
            
          </div>

          

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

            {/* Notificaciones */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Bell className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-700">Notificaciones por email</span>
                  <input
                    type="checkbox"
                    checked={configuraciones.notificaciones.email}
                    onChange={(e) => handleConfigChange("notificaciones", "email", e.target.checked)}
                    className="text-blue-600 focus:ring-blue-500 rounded"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-700">Notificaciones push</span>
                  <input
                    type="checkbox"
                    checked={configuraciones.notificaciones.push}
                    onChange={(e) => handleConfigChange("notificaciones", "push", e.target.checked)}
                    className="text-blue-600 focus:ring-blue-500 rounded"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-700">Notificaciones de Visitas</span>
                  <input
                    type="checkbox"
                    checked={configuraciones.notificaciones.visitas}
                    onChange={(e) => handleConfigChange("notificaciones", "recordatorios", e.target.checked)}
                    className="text-blue-600 focus:ring-blue-500 rounded"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-700">Notificaciones de Entregas</span>
                  <input
                    type="checkbox"
                    checked={configuraciones.notificaciones.entregas}
                    onChange={(e) => handleConfigChange("notificaciones", "presupuestos", e.target.checked)}
                    className="text-blue-600 focus:ring-blue-500 rounded"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-700">Vencimientos de presupuestos</span>
                  <input
                    type="checkbox"
                    checked={configuraciones.notificaciones.vencimientos}
                    onChange={(e) => handleConfigChange("notificaciones", "vencimientos", e.target.checked)}
                    className="text-blue-600 focus:ring-blue-500 rounded"
                  />
                </label>
              </div>
            </div>

            {/* Perfil de Usuario */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Perfil</h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={configuraciones.perfil.nombre}
                    onChange={(e) => handleConfigChange("perfil", "nombre", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                  <input
                    type="text"
                    value={configuraciones.perfil.apellido}
                    onChange={(e) => handleConfigChange("perfil", "apellido", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                  <input
                    type="text"
                    value={configuraciones.perfil.cuil}
                    onChange={(e) => handleConfigChange("perfil", "empresa", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>


            {/* Configuraciones del Negocio */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Building className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Negocio</h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-700">Checkbox para algo</span>
                  <input
                    type="checkbox"
                    checked={configuraciones.negocio.checkboxEjemplo}
                    onChange={(e) => handleConfigChange("negocio", "mostrarPrecios", e.target.checked)}
                    className="text-blue-600 focus:ring-blue-500 rounded"
                  />
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Días de vigencia del presupuesto</label>
                  <input
                    type="number"
                    placeholder={configuraciones.negocio.presupuesto}
                    onChange={(e) => handleConfigChange("negocio", "stockMinimo", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Costo de Viático por día</label>
                  <input
                    type="number"
                    step={"0.01"}
                    placeholder={configuraciones.negocio.viaticos}
                    onChange={(e) => handleConfigChange("negocio", "stockMinimo", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Seguridad */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-8">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Seguridad y Datos</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div className="font-medium text-gray-900">Cambiar Contraseña</div>
                  <div className="text-sm text-gray-500 mt-1">Actualiza tu contraseña de acceso</div>
                </button>
                <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div className="font-medium text-gray-900">Configurar 2FA</div>
                  <div className="text-sm text-gray-500 mt-1">Autenticación de dos factores</div>
                </button>
                <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div className="font-medium text-gray-900">Exportar Datos</div>
                  <div className="text-sm text-gray-500 mt-1">Descarga una copia de seguridad</div>
                </button>
                <button className="p-4 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-left">
                  <div className="font-medium text-red-600">Eliminar Cuenta</div>
                  <div className="text-sm text-red-500 mt-1">Acción irreversible</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}