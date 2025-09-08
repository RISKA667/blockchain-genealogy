import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { useAuth } from '../hooks/useAuth'

const Profile = () => {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState({
    username: '',
    bio: '',
    location: '',
    interests: []
  })
  const [stats, setStats] = useState({
    peopleAdded: 0,
    relationsCreated: 0,
    sourcesVerified: 0,
    totalPoints: 0,
    memberSince: null
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadProfile()
    loadStats()
  }, [])

  const loadProfile = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile(data)
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error)
    }
  }

  const loadStats = async () => {
    try {
      const [peopleResult, relationsResult, linksResult] = await Promise.all([
        supabase.from('people').select('*').eq('created_by', user.id),
        supabase.from('family_relations').select('*').eq('created_by', user.id),
        supabase.from('verified_links').select('*').eq('verified_by', user.id)
      ])

      const peopleCount = peopleResult.data?.length || 0
      const relationsCount = relationsResult.data?.length || 0
      const linksCount = linksResult.data?.length || 0

      setStats({
        peopleAdded: peopleCount,
        relationsCreated: relationsCount,
        sourcesVerified: linksCount,
        totalPoints: peopleCount * 10 + relationsCount * 5 + linksCount * 20,
        memberSince: user.created_at
      })
    } catch (error) {
      console.error('Erreur chargement stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveProfile = async () => {
    try {
      setSaving(true)
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      
      // Success toast would go here
    } catch (error) {
      console.error('Erreur sauvegarde profil:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-12 h-12 border-4 border-blockchain-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blockchain-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              {profile.username || user.email?.split('@')[0]}
            </h1>
            <p className="text-blue-100">
              Membre depuis {new Date(stats.memberSince).toLocaleDateString('fr-FR')}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                ⭐ {stats.totalPoints} points
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                🏆 Généalogiste {stats.totalPoints > 100 ? 'Expert' : 'Débutant'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profil */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">📝 Mon profil</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) => setProfile({...profile, username: e.target.value})}
                  className="input-field"
                  placeholder="Votre nom d'utilisateur"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className="input-field"
                  rows="3"
                  placeholder="Parlez-nous de votre passion pour la généalogie..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Localisation
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                  className="input-field"
                  placeholder="Ville, Pays"
                />
              </div>

              <button
                onClick={saveProfile}
                disabled={saving}
                className="btn-primary"
              >
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>

          {/* Réalisations */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">🏆 Réalisations</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">👥</div>
                <div className="font-semibold">{stats.peopleAdded}</div>
                <div className="text-sm text-gray-600">Personnes ajoutées</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🔗</div>
                <div className="font-semibold">{stats.relationsCreated}</div>
                <div className="text-sm text-gray-600">Relations créées</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">⛓️</div>
                <div className="font-semibold">{stats.sourcesVerified}</div>
                <div className="text-sm text-gray-600">Sources vérifiées</div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">⭐</div>
                <div className="font-semibold">{stats.totalPoints}</div>
                <div className="text-sm text-gray-600">Points totaux</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Badges */}
          <div className="card">
            <h3 className="font-semibold mb-4">🎖️ Badges</h3>
            <div className="space-y-3">
              {stats.peopleAdded >= 10 && (
                <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                  <span className="text-xl">👥</span>
                  <div>
                    <div className="font-medium text-sm">Collectionneur</div>
                    <div className="text-xs text-gray-600">10+ personnes ajoutées</div>
                  </div>
                </div>
              )}
              
              {stats.sourcesVerified >= 5 && (
                <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
                  <span className="text-xl">⛓️</span>
                  <div>
                    <div className="font-medium text-sm">Vérificateur</div>
                    <div className="text-xs text-gray-600">5+ sources vérifiées</div>
                  </div>
                </div>
              )}
              
              {stats.totalPoints >= 100 && (
                <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                  <span className="text-xl">🏆</span>
                  <div>
                    <div className="font-medium text-sm">Expert</div>
                    <div className="text-xs text-gray-600">100+ points</div>
                  </div>
                </div>
              )}
              
              {stats.peopleAdded === 0 && stats.sourcesVerified === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <div className="text-3xl mb-2">🌱</div>
                  <p className="text-sm">Commencez à contribuer pour débloquer des badges !</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="card">
            <h3 className="font-semibold mb-4">⚙️ Actions</h3>
            <div className="space-y-3">
              <button className="w-full btn-secondary text-left">
                📊 Exporter mes données
              </button>
              <button className="w-full btn-secondary text-left">
                🔒 Paramètres de confidentialité
              </button>
              <button 
                onClick={signOut}
                className="w-full btn-secondary text-left text-red-600 hover:bg-red-50"
              >
                🚪 Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
