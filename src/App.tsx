import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { Layout } from '@/components/Layout'
import { Toaster } from '@/components/ui/sonner'
import { Index } from '@/pages/Index'
import { Login } from '@/pages/auth/Login'
import { Register } from '@/pages/auth/Register'
import { Analytics } from '@/pages/Analytics'
import { NotFound } from '@/pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <Toaster position="top-center" />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App