// Simulation de blockchain pour le MVP
export async function generateHash(data) {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(JSON.stringify(data))
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export function simulateBlockValidation() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        blockNumber: Math.floor(Math.random() * 1000000),
        timestamp: new Date().toISOString(),
        validated: true
      })
    }, 2000) // Simule 2 secondes de "mining"
  })
}

export function generateCertificateData(person, relations) {
  return {
    person,
    relations,
    timestamp: new Date().toISOString(),
    certificateId: `CERT-${Date.now()}`,
    blockchain: {
      network: 'Genealogy Testnet',
      status: 'Validated'
    }
  }
}
