'use client'

import { ToastContainer } from 'react-toastify'

export default function AppToaster() {
  return (
    <ToastContainer
      newestOnTop
      limit={3}
      closeButton={true}
      hideProgressBar={false}
      pauseOnFocusLoss={false}
      theme="colored"
      position="top-right"
      className="!z-[9999]"
      toastClassName="!rounded-xl !shadow-2xl !mb-3 !font-semibold !text-sm"
    />
  )
}
