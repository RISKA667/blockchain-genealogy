import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import FamilyTree from '../components/Family/FamilyTree'
import AddRelation from '../components/Family/AddRelation'

const TreeView = () => {
  const [people, setPeople] = useState([])
  const [relations, setRelations] = useState([])
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [showAddRelation, setShowAddRelation] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTreeData()
  }, [])

  const loadTreeData = async () => {
    try {
      const { data: peopleData } = await supabase
        .from('people')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      const { data: relationsData } = await supabase
        .from('family_relations')
        .select(`
          *,
          person:people!family_relations_person_id_fkey(*),
          parent:people!family_relations_parent_id_fkey(*)
        `)

      setPeople(peopleData || [])
      setRelations(relationsData || [])
      
      // Sélectionner la première personne par défaut
      if (peopleData && peopleData.length > 0) {
        setSelectedPerson(peopleData[0])
      }
    } catch (error) {
      console.error('Erreur chargement arbre:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blockchain-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'arbre généalogique...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🌳 Arbre généalogique</h1>
          <p className="text-gray-600">
            {selectedPerson 
              ? `Arbre de ${selectedPerson.first_name} ${selectedPerson.name}`
              : 'Sélectionnez une personne pour voir son arbre'
            }
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddRelation(true)}
            disabled={!selectedPerson}
            className="btn-primary"
          >
            ➕ Ajouter relation
          </button>
          
          <select 
            value={selectedPerson?.id || ''}
            onChange={(e) => {
              const person = people.find(p => p.id === e.target.value)
              setSelectedPerson(person)
            }}
            className="input-field min-w-[200px]"
          >
            <option value="">Choisir une personne...</option>
            {people.map(person => (
              <option key={person.id} value={person.id}>
                {person.first_name} {person.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Arbre */}
      {selectedPerson ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <FamilyTree
            centerPerson={selectedPerson}
            allPeople={people}
            relations={relations}
            onPersonSelect={setSelectedPerson}
          />
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌳</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Votre arbre généalogique
          </h2>
          <p className="text-gray-600 mb-6">
            Sélectionnez une personne pour visualiser son arbre familial
          </p>
          {people.length === 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-blue-800 mb-4">
                Vous n'avez pas encore ajouté de personnes.
              </p>
              <button 
                onClick={() => window.location.href = '/'}
                className="btn-primary"
              >
                Ajouter votre première personne
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal ajout relation */}
      {showAddRelation && selectedPerson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <AddRelation
              person={selectedPerson}
              allPeople={people}
              onSuccess={() => {
                setShowAddRelation(false)
                loadTreeData()
              }}
              onCancel={() => setShowAddRelation(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default TreeView
