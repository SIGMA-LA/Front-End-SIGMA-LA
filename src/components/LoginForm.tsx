"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "./ui/Button"
import { Card, CardContent, CardHeader } from "./ui/Card"
import { Input } from "./ui/Input"
import { Label } from "./ui/Label"
import { ChevronRight } from "lucide-react"
import { LoginFormData, loginSchema } from "@/schemas/loginSchemas"
import { safeParse } from "valibot"

interface LoginFormProps {
  onLogin: (usuario: string, contrasena: string) => boolean
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    usuario: "",
    contrasena: "",
  })

  const [errors, setErrors] = useState({
    usuario: "",
    contrasena: "",
    general: "",
  })

  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const result = safeParse(loginSchema, formData)

    if (!result.success) {
      // Mapear los errores de Valibot
      const fieldErrors: typeof errors = { usuario: "", contrasena: "", general: "" }

      for (const issue of result.issues) {
        const path = issue.path?.[0]?.key as keyof LoginFormData | undefined
        if (path && path in fieldErrors) {
          fieldErrors[path] = issue.message
        }
      }

      setErrors(fieldErrors)
      return false
    }

    setErrors({ usuario: "", contrasena: "", general: "" })
    return true
  }

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors((prev) => ({ ...prev, general: "" }))

    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const loginSuccessful = onLogin(formData.usuario, formData.contrasena)

      if (!loginSuccessful) {
        throw new Error("Credenciales incorrectas")
      }

      // Éxito - el estado del usuario se maneja en app/page.tsx
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: "Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.",
      }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-md bg-white shadow-sm border border-gray-20 sm:max-w-md">
        <CardHeader className="text-center pt-12">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <span className="text-2xl font-semibold text-blue-600">SIGMA - LA</span>
            <div className="flex">
              <ChevronRight className="w-6 h-6 text-blue-400" />
              <ChevronRight className="w-6 h-6 text-blue-400 -ml-2" />
              <ChevronRight className="w-6 h-6 text-blue-400 -ml-2" />
            </div>
          </div>
          <h1 className="text-2xl font-normal text-gray-800 mb-4">Inicio de sesión</h1>
        </CardHeader>

        <CardContent className="px-12 pb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error general */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* Usuario Field */}
            <div className="space-y-2">
              <Label htmlFor="usuario" className="text-sm font-medium text-gray-700">
                Usuario
              </Label>
              <div className="pt-1">
                <Input
                  id="usuario"
                  type="text"
                  value={formData.usuario}
                  onChange={(e) => handleInputChange("usuario", e.target.value)}
                  placeholder="Ingresa tu usuario"
                  className={`w-full h-10 sm:h-11 lg:h-12 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-400 ${
                    errors.usuario ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
                  }`}
                />
                {errors.usuario && <p className="text-sm text-red-600 mt-1">{errors.usuario}</p>}
              </div>
            </div>
            

            <div className="space-y-2 ">
              <Label htmlFor="contrasena" className="text-sm font-medium text-gray-700">
                Contraseña
              </Label>
              <div className="pt-1">
                <Input
                  id="contrasena"
                  type="password"
                  value={formData.contrasena}
                  onChange={(e) => handleInputChange("contrasena", e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className={`w-full h-10 sm:h-11 lg:h-12 focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-400 ${
                    errors.contrasena ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
                  }`}
                  />
              </div>
              {errors.contrasena && <p className="text-sm text-red-600 mt-1">{errors.contrasena}</p>}
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium text-base rounded-md transition-colors"
              >
                {isLoading ? "Ingresando..." : "Ingresar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
