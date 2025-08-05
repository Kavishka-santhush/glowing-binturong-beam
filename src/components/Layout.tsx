import { ThemeToggle } from './ThemeToggle'
import { DataBackup } from './DataBackup'
import { useNotifications } from '@/hooks/useNotifications'

export function Layout({ children }: { children: React.ReactNode }) {
  useNotifications()
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-semibold">Skill Tracker</h1>
          <div className="flex items-center gap-4">
            <DataBackup />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        {children}
      </main>
    </div>
  )
}