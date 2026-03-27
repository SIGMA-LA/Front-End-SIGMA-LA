import type { Metadata } from 'next'
import './globals.css'
import 'react-toastify/dist/ReactToastify.css'

import AppToaster from '@/components/ui/AppToaster'

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
        {children}
        <AppToaster />
      </body>
    </html>
  )
}
