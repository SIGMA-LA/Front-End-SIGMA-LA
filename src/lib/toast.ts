import { toast, type ToastOptions } from 'react-toastify'

const baseOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 4000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
}

function withDefaults(
  type: 'success' | 'error' | 'info' | 'warning',
  message: string,
  options?: ToastOptions
): ToastOptions {
  return {
    ...baseOptions,
    ...options,
  }
}

export const notify = {
  success: (message: string, options?: ToastOptions) =>
    toast.success(message, withDefaults('success', message, options)),
  error: (message: string, options?: ToastOptions) =>
    toast.error(message, withDefaults('error', message, options)),
  info: (message: string, options?: ToastOptions) =>
    toast.info(message, withDefaults('info', message, options)),
  warning: (message: string, options?: ToastOptions) =>
    toast.warning(message, withDefaults('warning', message, options)),
}
