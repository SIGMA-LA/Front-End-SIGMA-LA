import type { Metadata } from 'next'
import './globals.css'
import { GlobalProvider } from '@/context/GlobalContext'

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
        <GlobalProvider>{children}</GlobalProvider>
      </body>
    </html>
  )
}