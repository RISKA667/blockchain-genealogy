import { useState, useEffect } from 'react'
import { db } from '../supabase'

// FamilyTree component inline
const FamilyTree = ({ centerPerson, allPeople, relations, onPersonSelect }) => {
  const getRelativesForPerson = (personId) => {
    return relations.filter(rel => rel.person_id === personId || rel.parent_id === personId)
  }

  const renderPersonCard = (person, isCenter = false) => (
    <div
      key={person.id}
      className={`card cursor-pointer transition-all hover:shadow-lg ${
        isCenter ? 'ring-2 ring-blockchain-500 scale-105' : ''
      }`}
      onClick={() => onPersonSelect(person)}
    >
      <div className="card-body text-center">
        <div className="text-2xl mb-2">👤</div>
        <h3 className="font-semibold text-sm">{person.first_name} {person.name}</h3>
        <p className="text-xs text-gray-500">
          {person.birth_date && new Date(person.birth_date).getFullYear()}
          {person.death_date && ` - ${new Date(person.death_date).getFullYear()}`}
        </p>
        {person.birth_place && (
          <p className="text-xs text-gray-400 mt-1">{person.birth_place}</p>
        )}
      </div>
    </div>
  )

  const relatives = getRelativesForPerson(centerPerson.id)
  const parents = relatives
    .filter(rel => rel.person_id === centerPerson.id)
    .map(rel => rel.parent)
    .filter(Boolean)
  
  const children = relatives
    .filter(rel => rel.parent_id === centerPerson.id)
    .map(rel => rel.person)
    .filter(Boolean)

  return (
    <div className="space-y-8">
      {/* Parents */}
      {parents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-center">👨‍👩‍👧‍👦 Parents</h3>
          <div className="flex justify-center gap-4 flex-wrap">
            {parents.map(parent => renderPersonCard(parent))}
          </div>
        </div>
      )}

      {/* Person centrale */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-center">🎯 Personne centrale</h3>
        <div className="flex justify-center">
          {renderPersonCard(centerPerson, true)}
        </div>
      </div>

      {/* Enfants */}
      {children.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-center">👶 Enfants</h3>
          <div className="flex justify-center gap-4 flex-wrap">
            {children.map(child => renderPersonCard(child))}
          </div>
        </div>
      )}

      {/* Lignes de connexion visuelles */}
      <style jsx>{`
        .tree-line {
          position: relative;
        }
        .tree-line::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background: #e5e7eb;
        }
      `}</style>
    </div>
  )
}

// AddRelation component inline
const AddRelation = ({ person, allPeople, onSuccess, onCancel }) => {
  const [relationType, setRelationType] = useState('parent')
  const [selectedPersonId, setSelectedPersonId] = useState('')
  const [loading, setLoading] = useState(false)

  const relationTypes = [
    { value: 'parent', label: 'Parent de cette personne' },
    { value: 'child', label: 'Enfant de cette personne' },
    { value: 'spouse', label: 'Époux/Épouse' },
    { value: 'sibling', label: 'Frère/Sœur' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedPersonId) return

    try {
      setLoading(true)
      
      let relationData
      if (relationType === 'parent') {
        relationData = {
          person_id: person.id,
          parent_id: selectedPersonId,
          relation_type: 'parent'
        }
      } else if (relationType === 'child') {
        relationData = {
          person_id: selectedPersonId,
          parent_id: person.id,
          relation_type: 'parent'
        }
      } else {
        relationData = {
          person_id: person.id,
          related_person_id: selectedPersonId,
          relation_type: relationType
        }
      }

      await db.relations.create(relationData)
      onSuccess()
    } catch (error) {
      console.error('Erreur ajout relation:', error)
    } finally {
      setLoading(false)
    }
  }

  const availablePeople = allPeople.filter(p => p.id !== person.id)

  return (
    <div className="card-body">
      <h2 className="text-xl font-semibold mb-4">➕ Ajouter une relation</h2>
      <p className="text-gray-600 mb-6">
        Pour: <strong>{person.first_name} {person.name}</strong>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Type de relation</label>
          <select
            value={relationType}
            onChange={(e) => setRelationType(e.target.value)}
            className="input-field"
          >
            {relationTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Personne à relier</label>
          <select
            value={selectedPersonId}
            onChange={(e) => setSelectedPersonId(e.target.value)}
            className="input-field"
            required
          >
            <option value="">Choisir une personne...</option>
            {availablePeople.map(p => (
              <option key={p.id} value={p.id}>
                {p.first_name} {p.name}
                {p.birth_date && ` (${new Date(p.birth_date).getFullYear()})`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading || !selectedPersonId}
            className="btn-primary flex-1"
          >
            {loading ? 'Ajout...' : 'Ajouter relation'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}

// Main TreeView component
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
      const { data: peopleData } = await db.people.getPublic()
      const { data: relationsData } = await db.relations.getAll()

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
          <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
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
        <div className="card">
          <div className="card-body">
            <FamilyTree
              centerPerson={selectedPerson}
              allPeople={people}
              relations={relations}
              onPersonSelect={setSelectedPerson}
            />
          </div>
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
