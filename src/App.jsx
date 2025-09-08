import { Suspense, lazy, useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { auth, utils } from './supabase'

// Lazy load components for better performance
const Header = lazy(() => import('./components/Layout/Header'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const TreeView = lazy(() => import('./pages/TreeView'))
const Profile = lazy(() => import('./pages/Profile'))
const Login = lazy(() => import('./components/Auth/Login'))
const Register = lazy(() => import('./components/Auth/Register'))

// Loading component
const LoadingScreen = ({ connectionStatus }) => (
  <div className="min-h-screen bg-gradient-to-br from-blockchain-900 to-purple-900 flex items-center justify-center">
    <div className="text-center text-white max-w-md mx-auto px-6">
      <div className="mb-8">
        <div className="text-6xl mb-4 animate-pulse">🧬</div>
        <h1 className="text-3xl font-bold mb-2">Blockchain Genealogy</h1>
        <p className="text-blue-200">Chargement de votre arbre généalogique...</p>
      </div>
      
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="loading-spinner w-8 h-8"></div>
        <span className="text-sm">{connectionStatus}</span>
      </div>
      
      <div className="space-y-3 text-xs text-blue-200">
        {[
          { text: 'Alternative blockchain à Geneanet', color: 'bg-green-400' },
          { text: 'Sources certifiées et vérifiées', color: 'bg-blue-400' },
          { text: '100% gratuit, sans limite', color: 'bg-purple-400' }
        ].map(({ text, color }, index) => (
          <div key={index} className="flex items-center justify-center gap-2">
            <span className={`w-2 h-2 ${color} rounded-full`}></span>
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

// Auth layout component
const AuthLayout = () => (
  <div className="min-h-screen bg-gradient-to-br from-blockchain-900 to-purple-900">
    <Suspense fallback={<LoadingScreen connectionStatus="Chargement..." />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  </div>
)

// Footer component inline
const Footer = ({ connectionStatus }) => (
  <footer className="bg-white border-t border-gray-200 mt-auto">
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">🧬</div>
            <div>
              <div className="font-bold text-lg gradient-text">
                Blockchain Genealogy
              </div>
              <div className="text-xs text-gray-500">Alternative moderne à Geneanet</div>
            </div>
          </div>
          <p className="text-gray-600 text-sm max-w-md">
            Créez votre arbre généalogique avec certification blockchain. 
            Sources vérifiées, interface moderne, 100% gratuit.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="text-gray-600 hover:text-blockchain-600">🏠 Accueil</a></li>
            <li><a href="/search" className="text-gray-600 hover:text-blockchain-600">🔍 Rechercher</a></li>
            <li><a href="/tree" className="text-gray-600 hover:text-blockchain-600">🌳 Mon arbre</a></li>
            <li><a href="/profile" className="text-gray-600 hover:text-blockchain-600">👤 Profil</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Vs Geneanet</h4>
          <ul className="space-y-2 text-sm">
            <li className="text-green-600">✅ 100% gratuit</li>
            <li className="text-green-600">✅ Blockchain certifié</li>
            <li className="text-green-600">✅ Interface moderne</li>
            <li className="text-green-600">✅ Sans limite</li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-6 mt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-xs text-gray-500">
          © 2024 Blockchain Genealogy. Révolutionnons la généalogie ensemble.
        </p>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <span className="text-xs text-gray-500">Status: {connectionStatus}</span>
          <a 
            href="https://geneanet.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            🔗 Comparer avec Geneanet
          </a>
        </div>
      </div>
    </div>
  </footer>
)

// App layout component
const AppLayout = ({ user, connectionStatus }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Suspense fallback={<div className="h-16 bg-white shadow-sm"></div>}>
      <Header user={user} />
    </Suspense>
    
    <main className="flex-1 container py-8">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="loading-spinner w-12 h-12"></div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/tree" element={<TreeView />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/person/:id" element={<PersonDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </main>

    <Footer connectionStatus={connectionStatus} />
  </div>
)

// Placeholder components for future routes
const PersonDetail = () => (
  <div className="text-center py-12">
    <h2 className="section-title">👤 Détail de la personne</h2>
    <p className="text-muted">Cette page sera bientôt disponible.</p>
  </div>
)

const Settings = () => (
  <div className="text-center py-12">
    <h2 className="section-title">⚙️ Paramètres</h2>
    <p className="text-muted">Page de paramètres en développement.</p>
  </div>
)

// Connection status hook
const useConnectionStatus = () => {
  const [status, setStatus] = useState('🔄 Test de connexion...')

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { success, error } = await utils.testConnection()
        
        if (success) {
          setStatus('✅ Supabase connecté!')
        } else {
          setStatus(`❌ Erreur: ${error?.message || 'Connexion échouée'}`)
        }
      } catch (err) {
        setStatus(`❌ Erreur: ${err.message}`)
      }
    }

    testConnection()
  }, [])

  return status
}

// User session hook
const useUserSession = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}

// Toast configuration
const toastConfig = {
  position: 'top-right',
  toastOptions: {
    duration: 4000,
    style: {
      background: '#363636',
      color: '#fff',
      borderRadius: '8px',
      padding: '12px 16px'
    },
    success: {
      style: { background: '#059669' },
      iconTheme: { primary: '#fff', secondary: '#059669' }
    },
    error: {
      style: { background: '#dc2626' },
      iconTheme: { primary: '#fff', secondary: '#dc2626' }
    },
    loading: {
      style: { background: '#3b82f6' }
    }
  }
}

// Main App component
const App = () => {
  const { user, loading } = useUserSession()
  const connectionStatus = useConnectionStatus()

  // Show loading screen while checking auth
  if (loading) {
    return <LoadingScreen connectionStatus={connectionStatus} />
  }

  return (
    <>
      {user ? (
        <AppLayout user={user} connectionStatus={connectionStatus} />
      ) : (
        <AuthLayout />
      )}
      
      <Toaster {...toastConfig} />
    </>
  )
}

export default App
