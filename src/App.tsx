import { useEffect } from 'react'
import { useTheme } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const { theme } = useTheme()

  useEffect(() => {
    document.documentElement.lang = 'en'
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <>
      <div className="min-h-screen">
        {/* Your app content */}
      </div>
      <Toaster 
        position="top-center"
        toastOptions={{
          classNames: {
            toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground',
            description: 'group-[.toast]:text-muted-foreground',
            actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          }
        }}
      />
    </>
  )
}