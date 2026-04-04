import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const roleRoutes: { [key: string]: string } = {
  ADMIN: '/admin',
  PLANTA: '/planta',
  VENTAS: '/ventas',
  COORDINACION: '/coordinacion',
  VISITADOR: '/visitador',
  PRODUCCION: '/produccion',
}

const protectedRoutes = Object.values(roleRoutes)

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value
  const usuarioCookie = request.cookies.get('usuario')?.value
  const { pathname } = request.nextUrl

  const isProtectedRoute = protectedRoutes.some((path) =>
    pathname.startsWith(path)
  )

  if (isProtectedRoute) {
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    if (usuarioCookie) {
      try {
        const usuario = JSON.parse(usuarioCookie)
        const userRole = usuario?.rol_actual
        const userDashboardPath = userRole ? roleRoutes[userRole] : undefined

        if (!userDashboardPath) {
          throw new Error('Rol de usuario inválido o no encontrado.')
        }

        if (!pathname.startsWith(userDashboardPath)) {
          return NextResponse.redirect(new URL(userDashboardPath, request.url))
        }
      } catch {
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('accessToken')
        response.cookies.delete('usuario')
        return response
      }
    } else {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('accessToken')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
