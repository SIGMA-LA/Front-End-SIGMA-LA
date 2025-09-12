import Navbar from "@/components/layout/Navbar";

export default function VisitadorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <div className="max-w mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}