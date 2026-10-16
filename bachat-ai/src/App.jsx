import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LanguagePicker from './components/LanguagePicker'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import { useLanguage } from './context/LanguageContext'

function App() {
  const { pathname } = useLocation()
  const { language } = useLanguage()
  const isAuthPage = pathname === '/login' || pathname === '/signup'

  if (!language) {
    return <LanguagePicker />
  }

  return (
    <div className="min-h-screen flex flex-col bg-sand font-sans text-charcoal">
      {!isAuthPage && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      {pathname === '/' && <Footer />}
    </div>
  )
}

export default App
