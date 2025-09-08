import { useState } from 'react'
import AdvancedSearch from '../components/Search/AdvancedSearch'
import SearchResults from '../components/Search/SearchResults'
import SearchStats from '../components/Search/SearchStats'

const SearchPage = () => {
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchCriteria, setSearchCriteria] = useState(null)

  const handleSearch = (results, criteria) => {
    setResults(results)
    setSearchCriteria(criteria)
    setHasSearched(true)
  }

  const handleSearchStart = () => {
    setSearching(true)
  }

  const handleSearchEnd = () => {
    setSearching(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🔍 Recherche dans nos collections
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Recherchez parmi les milliers d'individus ajoutés par notre communauté. 
          Alternative moderne et gratuite à Geneanet avec certification blockchain.
        </p>
      </div>

      {/* Statistiques */}
      <SearchStats />

      {/* Formulaire de recherche */}
      <AdvancedSearch
        onSearch={handleSearch}
        onSearchStart={handleSearchStart}
        onSearchEnd={handleSearchEnd}
      />

      {/* Indicateur de recherche */}
      {searching && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-lg">
            <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span className="text-blue-700 font-medium">Recherche en cours...</span>
          </div>
        </div>
      )}

      {/* Résultats */}
      {hasSearched && !searching && (
        <SearchResults 
          results={results} 
          searchCriteria={searchCriteria}
        />
      )}

      {/* Call to action si pas de recherche */}
      {!hasSearched && !searching && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-6">🧬</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Commencez votre recherche
            </h2>
            <p className="text-gray-600 mb-6">
              Utilisez le formulaire ci-dessus pour rechercher vos ancêtres 
              dans notre base collaborative certifiée blockchain.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-900 mb-2">
                💡 Conseil de recherche
              </h3>
              <p className="text-sm text-yellow-800">
                Commencez par le nom de famille uniquement, puis affinez 
                avec le prénom et les dates si vous obtenez trop de résultats.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchPage
