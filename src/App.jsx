import { useState, useEffect } from 'react'
import { supabase } from './supabase'

function App() {
  const [connectionStatus, setConnectionStatus] = useState('🔄 Connexion en cours...')

  useEffect(() => {
    testConnection()
  }, [])

  async function testConnection() {
    try {
      const { data, error } = await supabase
        .from('people')
        .select('count(*)')
        .single()
      
      if (error && error.code !== 'PGRST116') {
        setConnectionStatus(`❌ Erreur: ${error.message}`)
      } else {
        setConnectionStatus('✅ Supabase connecté! MVP prêt à décoller!')
      }
    } catch (err) {
      setConnectionStatus(`❌ Erreur: ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl max-w-lg w-full text-center">
        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            🧬 Blockchain Genealogy
          </h1>
          <p className="text-gray-600 text-lg">
            L'alternative blockchain à Geneanet
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="font-medium text-gray-700">Status de connexion:</p>
          <p className="text-lg mt-2">{connectionStatus}</p>
        </div>

        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Certificats blockchain authentiques</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Gratuit vs 60€/an chez Geneanet</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span>Interface moderne mobile-first</span>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          MVP en développement - Bientôt disponible
        </div>
      </div>
    </div>
  )
}

export default App
