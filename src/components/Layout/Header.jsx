import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const Header = ({ user }) => {
  const { signOut } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="text-2xl">🧬</div>
            <div>
              <div className="font-bold text-lg bg-gradient-to-r from-blockchain-600 to-purple-600 bg-clip-text text-transparent">
                Blockchain Genealogy
              </div>
              <div className="text-xs text-gray-500">Alternative à Geneanet</div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-blockchain-100 text-blockchain-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              🏠 Accueil
            </Link>
            
            <Link
              to="/search"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/search') 
                  ? 'bg-blockchain-100 text-blockchain-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              🔍 Rechercher
            </Link>
            
            <Link
              to="/tree"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/tree') 
                  ? 'bg-blockchain-100 text-blockchain-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              🌳 Mon arbre
            </Link>
          </nav>

          {/* User menu */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-gray-900">
                {user?.email?.split('@')[0]}
              </div>
              <div className="text-xs text-gray-500">Membre</div>
            </div>
            
            <div className="relative group">
              <button className="w-10 h-10 bg-blockchain-100 rounded-full flex items-center justify-center text-blockchain-600 hover:bg-blockchain-200 transition-colors">
                👤
              </button>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    👤 Mon profil
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    ⚙️ Paramètres
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={signOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    🚪 Se déconnecter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden border-t border-gray-200 py-2">
          <div className="flex justify-around">
            <Link
              to="/"
              className={`px-3 py-2 text-sm rounded ${
                isActive('/') ? 'bg-blockchain-100 text-blockchain-700' : 'text-gray-600'
              }`}
            >
              🏠
            </Link>
            <Link
              to="/search"
              className={`px-3 py-2 text-sm rounded ${
                isActive('/search') ? 'bg-blockchain-100 text-blockchain-700' : 'text-gray-600'
              }`}
            >
              🔍
            </Link>
            <Link
              to="/tree"
              className={`px-3 py-2 text-sm rounded ${
                isActive('/tree') ? 'bg-blockchain-100 text-blockchain-700' : 'text-gray-600'
              }`}
            >
              🌳
            </Link>
            <Link
              to="/profile"
              className={`px-3 py-2 text-sm rounded ${
                isActive('/profile') ? 'bg-blockchain-100 text-blockchain-700' : 'text-gray-600'
              }`}
            >
              👤
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
