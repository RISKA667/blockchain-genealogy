export function formatDate(dateString) {
  if (!dateString) return 'Non renseigné'
  return new Date(dateString).toLocaleDateString('fr-FR')
}

export function calculateAge(birthDate, deathDate = null) {
  if (!birthDate) return null
  const end = deathDate ? new Date(deathDate) : new Date()
  const birth = new Date(birthDate)
  return Math.floor((end - birth) / (365.25 * 24 * 60 * 60 * 1000))
}

export function getRelationshipLabel(relationType) {
  const labels = {
    'child': 'Enfant de',
    'parent': 'Parent de',
    'spouse': 'Époux/Épouse de',
    'sibling': 'Frère/Sœur de'
  }
  return labels[relationType] || relationType
}
