// src/app/__tests__/page.test.tsx
import { render, screen } from '@testing-library/react'
import Home from '../page'

describe('Home Page', () => {
  it('should render the main content correctly', () => {
    // 1. Renderizamos el componente que queremos probar
    render(<Home />)

    // 2. Buscamos el logo principal por su texto alternativo.
    // Esta es la mejor manera de encontrar imágenes, ya que simula cómo
    // las tecnologías de asistencia (como lectores de pantalla) las identifican.
    const nextLogo = screen.getByAltText('Next.js logo')

    // 3. Buscamos el texto de bienvenida. Usamos una expresión regular /.../i
    // para que la búsqueda no sea sensible a mayúsculas/minúsculas y sea más flexible.
    const welcomeText = screen.getByText(/Get started by editing/i)

    // 4. Buscamos el enlace "Deploy now". La forma más accesible y recomendada es
    // buscar por su "role" (rol) de 'link' y su nombre visible.
    const deployLink = screen.getByRole('link', { name: /Deploy now/i })

    // 5. Hacemos las aserciones. Verificamos que cada elemento que buscamos
    // esté efectivamente presente en el DOM.
    expect(nextLogo).toBeInTheDocument()
    expect(welcomeText).toBeInTheDocument()
    expect(deployLink).toBeInTheDocument()
  })
})
