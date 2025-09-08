import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const { signUp, loading } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas')
      return
    }
    
    if (formData.password.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }
    
    setPasswordError('')
    await signUp(formData.email, formData.password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            🧬 Blockchain Genealogy
          </h1>
          <p className="text-gray-600">Créez votre compte gratuit</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="input-field"
              placeholder="votre_nom"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="input-field"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          {passwordError && (
            <div className="text-red-600 text-sm">{passwordError}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-blockchain-600 hover:underline">
              Se connecter
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Gratuit à vie • Pas de limite</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Sources blockchain vérifiées</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>Alternative moderne à Geneanet</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
