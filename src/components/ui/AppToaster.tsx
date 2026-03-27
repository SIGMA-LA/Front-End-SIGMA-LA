'use client'

import { ToastContainer } from 'react-toastify'

export default function AppToaster() {
  return (
    <ToastContainer
      newestOnTop
      limit={3}
      closeButton={false}
      hideProgressBar
      pauseOnFocusLoss={false}
      toastClassName="!text-sm !font-semibold !text-slate-700"
      toastStyle={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        boxShadow: '0 14px 34px rgba(15, 23, 42, 0.14)',
        color: '#0f172a',
      }}
    />
  )
}
