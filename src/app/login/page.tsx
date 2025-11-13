import LoginForm from '@/components/login/LoginForm'
import { loginAction } from '@/actions/auth'

export default function LoginPage() {
  return <LoginForm loginAction={loginAction} />
}
