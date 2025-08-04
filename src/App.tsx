import { ThemeProvider } from "@/components/theme-provider"

// Wrap the entire app with ThemeProvider
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  <QueryClientProvider client={queryClient}>
    {/* ... rest of the app */}
  </QueryClientProvider>
</ThemeProvider>