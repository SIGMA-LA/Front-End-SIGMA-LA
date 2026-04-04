// src/app/__tests__/page.test.tsx
import { render, screen } from '@testing-library/react'
import Home from '../page'

// Mock next/navigation to avoid "invariant: app router not mounted" error
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock react-dom to avoid useFormStatus requiring a <form> context
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  useFormStatus: () => ({ pending: false }),
}))

// Mock the login server action (relative path required for jest.mock resolution)
jest.mock('../../actions/auth', () => ({
  loginAction: jest.fn().mockResolvedValue({}),
}))


describe('Home Page', () => {
  it('should render the login form correctly', () => {
    render(<Home />)

    // The login page should show the app name
    expect(screen.getByText(/SIGMA/i)).toBeInTheDocument()

    // It should have a username/cuil field
    expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument()

    // It should have a password field
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()

    // It should have a submit button
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument()
  })
})
