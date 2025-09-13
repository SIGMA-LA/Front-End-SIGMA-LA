import Navbar from '@/components/layout/Navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <div className="mx-auto">{children}</div>
      </main>
    </div>
  )
}
