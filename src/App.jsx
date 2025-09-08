import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabase'
import Header from './components/Layout/Header'
import Dashboard from './pages/Dashboard'
import SearchPage from './pages/SearchPage'
import TreeView from './pages/TreeView'
import Profile from './pages/Profile'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import toast, { Toaster } from 'react-hot-toast'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState('🔄 Test de connexion...')

  useEffect(() => {
    // Test de connexion initial
    testConnection()
    
    // Vérifier la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const testConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('people')
        .select('id')
        .limit(1)
      
      if (error) {
        setConnectionStatus(`❌ Erreur: ${error.message}`)
        toast.error('Problème de connexion à la base de données')
      } else {
        setConnectionStatus('✅ Supabase connecté!')
        console.log('🎉 Connexion Supabase réussie!')
      }
    } catch (err) {
      setConnectionStatus(`❌ Erreur: ${err.message}`)
      toast.error('Impossible de se connecter')
    }
  }

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blockchain-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="mb-6">
            <div className="text-6xl mb-4">🧬</div>
            <h1 className="text-3xl font-bold mb-2">Blockchain Genealogy</h1>
            <p className="text-blue-200">Chargement de votre arbre généalogique...</p>
          </div>
          
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="text-sm">{connectionStatus}</span>
          </div>
          
          <div className="mt-8 space-y-2 text-xs text-blue-200 max-w-sm mx-auto">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Alternative blockchain à Geneanet</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>Sources certifiées et vérifiées</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              <span>100% gratuit, sans limite</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Si pas connecté, afficher auth
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blockchain-900 to-purple-900">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        
        {/* Toast notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#059669',
              },
            },
            error: {
              style: {
                background: '#dc2626',
              },
            },
          }}
        />
      </div>
    )
  }

  // Application principale (utilisateur connecté)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header user={user} />
      
      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-8">
        <Routes>
          {/* Page d'accueil - Dashboard */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Recherche */}
          <Route path="/search" element={<SearchPage />} />
          
          {/* Arbre généalogique */}
          <Route path="/tree" element={<TreeView />} />
          
          {/* Profil utilisateur */}
          <Route path="/profile" element={<Profile />} />
          
          {/* Routes de développement / futures */}
          <Route path="/person/:id" element={<PersonDetail />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* 404 - Redirection vers accueil */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo et description */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">🧬</div>
                <div>
                  <div className="font-bold text-lg bg-gradient-to-r from-blockchain-600 to-purple-600 bg-clip-text text-transparent">
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
            
            {/* Liens rapides */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Navigation</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="text-gray-600 hover:text-blockchain-600">🏠 Accueil</a></li>
                <li><a href="/search" className="text-gray-600 hover:text-blockchain-600">🔍 Rechercher</a></li>
                <li><a href="/tree" className="text-gray-600 hover:text-blockchain-600">🌳 Mon arbre</a></li>
                <li><a href="/profile" className="text-gray-600 hover:text-blockchain-600">👤 Profil</a></li>
              </ul>
            </div>
            
            {/* Comparaison */}
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
          
          {/* Copyright */}
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

      {/* Toast notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#059669',
            },
          },
          error: {
            style: {
              background: '#dc2626',
            },
          },
        }}
      />
    </div>
  )
}

// Composants temporaires pour les routes futures
const PersonDetail = () => (
  <div className="text-center py-12">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">👤 Détail de la personne</h2>
    <p className="text-gray-600">Cette page sera bientôt disponible.</p>
  </div>
)

const Settings = () => (
  <div className="text-center py-12">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">⚙️ Paramètres</h2>
    <p className="text-gray-600">Page de paramètres en développement.</p>
  </div>
)

export default App
