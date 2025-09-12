import type { Metadata } from 'next'
import './globals.css'
import { GlobalProvider } from '@/context/GlobalContext'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  title: 'SIGMA-LA',
  description: 'Sistema de Gestión y Monitoreo de Actividades',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (

    <html lang="es">
      <body>
        <AuthProvider>
          <GlobalProvider>{children}</GlobalProvider>
        </AuthProvider>
      </body>
    </html>
  )
}