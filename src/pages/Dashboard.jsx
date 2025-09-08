import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../hooks/useAuth'
import AddPerson from '../components/People/AddPerson'

const Dashboard = () => {
  const [stats, setStats] = useState({
    peopleCount: 0,
    relationsCount: 0,
    verifiedLinks: 0,
    userPoints: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [showAddPerson, setShowAddPerson] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Statistiques utilisateur
      const { data: people } = await supabase
        .from('people')
        .select('*')
        .eq('created_by', user.id)

      const { data: relations } = await supabase
        .from('family_relations')
        .select('*')
        .eq('created_by', user.id)

      const { data: links } = await supabase
        .from('verified_links')
        .select('*')
        .eq('verified_by', user.id)

      setStats({
        peopleCount: people?.length || 0,
        relationsCount: relations?.length || 0,
        verifiedLinks: links?.length || 0,
        userPoints: (people?.length || 0) * 10 + (relations?.length || 0) * 5 + (links?.length || 0) * 20
      })

      // Activité récente
      const { data: activity } = await supabase
        .from('people')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentActivity(activity || [])
    } catch (error) {
      console.error('Erreur chargement dashboard:', error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blockchain-600 to-purple-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Bonjour {user?.email?.split('@')[0]} ! 👋
        </h1>
        <p className="text-blue-100">
          Construisez votre arbre généalogique certifié blockchain
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-blockchain-600">{stats.peopleCount}</div>
          <div className="text-gray-600">Personnes ajoutées</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600">{stats.relationsCount}</div>
          <div className="text-gray-600">Relations créées</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-600">{stats.verifiedLinks}</div>
          <div className="text-gray-600">Sources vérifiées</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-yellow-600">{stats.userPoints}</div>
          <div className="text-gray-600">Points gagnés</div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => setShowAddPerson(true)}
          className="card hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-gray-300 hover:border-blockchain-400"
        >
          <div className="text-center py-8">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="font-semibold text-lg mb-2">Ajouter une personne</h3>
            <p className="text-gray-600">Commencez ou enrichissez votre arbre</p>
          </div>
        </button>

        <Link
          to="/search"
          className="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="font-semibold text-lg mb-2">Rechercher</h3>
            <p className="text-gray-600">Trouvez des ancêtres dans notre base</p>
          </div>
        </Link>

        <Link
          to="/tree"
          className="card hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🌳</div>
            <h3 className="font-semibold text-lg mb-2">Mon arbre</h3>
            <p className="text-gray-600">Visualisez votre généalogie</p>
          </div>
        </Link>
      </div>

      {/* Activité récente */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">📋 Activité récente</h2>
        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.map(person => (
              <div key={person.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blockchain-100 rounded-full flex items-center justify-center">
                  👤
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{person.first_name} {person.name}</h4>
                  <p className="text-sm text-gray-600">
                    Ajouté le {new Date(person.created_at).toLocaleDateString('fr-FR')}
                    {person.blockchain_hash && ' • ⛓️ Vérifié blockchain'}
                  </p>
                </div>
                <Link
                  to={`/person/${person.id}`}
                  className="btn-secondary text-sm"
                >
                  Voir
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">🌱</div>
            <p>Aucune activité encore.</p>
            <p>Commencez par ajouter votre première personne !</p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">💡 Le saviez-vous ?</h3>
        <ul className="space-y-2 text-blue-800">
          <li>• Chaque personne ajoutée = +10 points</li>
          <li>• Chaque relation créée = +5 points</li>
          <li>• Chaque source vérifiée = +20 points</li>
          <li>• Vos données sont certifiées par blockchain pour prouver leur authenticité</li>
        </ul>
      </div>

      {/* Modal d'ajout de personne */}
      {showAddPerson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <AddPerson
              onSuccess={() => {
                setShowAddPerson(false)
                loadDashboardData()
              }}
              onCancel={() => setShowAddPerson(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
