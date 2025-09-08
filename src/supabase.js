import { createClient } from '@supabase/supabase-js'

// Environment variables validation
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate required environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing Supabase environment variables. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  )
}

// Validate URL format
try {
  new URL(SUPABASE_URL)
} catch {
  throw new Error('Invalid VITE_SUPABASE_URL format')
}

// Supabase client configuration
const supabaseConfig = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'x-client-info': 'blockchain-genealogy@1.0.0'
    }
  }
}

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, supabaseConfig)

// Auth helpers
export const auth = {
  signUp: (email, password, metadata = {}) =>
    supabase.auth.signUp({ email, password, options: { data: metadata } }),
  
  signIn: (email, password) =>
    supabase.auth.signInWithPassword({ email, password }),
  
  signOut: () => supabase.auth.signOut(),
  
  getUser: () => supabase.auth.getUser(),
  
  getSession: () => supabase.auth.getSession(),
  
  onAuthStateChange: (callback) => supabase.auth.onAuthStateChange(callback),
  
  resetPassword: (email) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
}

// Database helpers
export const db = {
  // People operations
  people: {
    getAll: () => supabase.from('people').select('*'),
    getById: (id) => supabase.from('people').select('*').eq('id', id).single(),
    getByUser: (userId) => supabase.from('people').select('*').eq('created_by', userId),
    getPublic: () => supabase.from('people').select('*').eq('is_public', true),
    create: (data) => supabase.from('people').insert(data).select().single(),
    update: (id, data) => supabase.from('people').update(data).eq('id', id).select().single(),
    delete: (id) => supabase.from('people').delete().eq('id', id),
    search: (criteria) => {
      let query = supabase.from('people').select('*').eq('is_public', true)
      
      if (criteria.firstName) {
        query = query.ilike('first_name', `%${criteria.firstName}%`)
      }
      if (criteria.lastName) {
        query = query.ilike('name', `%${criteria.lastName}%`)
      }
      if (criteria.birthYear) {
        query = query.gte('birth_date', `${criteria.birthYear}-01-01`)
                     .lte('birth_date', `${criteria.birthYear}-12-31`)
      }
      if (criteria.birthPlace) {
        query = query.ilike('birth_place', `%${criteria.birthPlace}%`)
      }
      
      return query.order('created_at', { ascending: false })
    }
  },

  // Family relations operations
  relations: {
    getAll: () => supabase.from('family_relations').select(`
      *,
      person:people!family_relations_person_id_fkey(*),
      parent:people!family_relations_parent_id_fkey(*)
    `),
    getByPerson: (personId) => supabase.from('family_relations').select(`
      *,
      person:people!family_relations_person_id_fkey(*),
      parent:people!family_relations_parent_id_fkey(*)
    `).eq('person_id', personId),
    create: (data) => supabase.from('family_relations').insert(data).select().single(),
    delete: (id) => supabase.from('family_relations').delete().eq('id', id)
  },

  // Profile operations
  profiles: {
    get: (userId) => supabase.from('profiles').select('*').eq('id', userId).single(),
    upsert: (data) => supabase.from('profiles').upsert(data).select().single()
  },

  // Verified links operations
  links: {
    getByUser: (userId) => supabase.from('verified_links').select('*').eq('verified_by', userId),
    create: (data) => supabase.from('verified_links').insert(data).select().single()
  }
}

// Storage helpers
export const storage = {
  upload: (bucket, path, file, options = {}) =>
    supabase.storage.from(bucket).upload(path, file, options),
  
  download: (bucket, path) =>
    supabase.storage.from(bucket).download(path),
  
  getPublicUrl: (bucket, path) =>
    supabase.storage.from(bucket).getPublicUrl(path),
  
  delete: (bucket, paths) =>
    supabase.storage.from(bucket).remove(paths)
}

// Real-time helpers
export const realtime = {
  subscribe: (table, callback, filter = '*') =>
    supabase
      .channel(`public:${table}`)
      .on('postgres_changes', { event: filter, schema: 'public', table }, callback)
      .subscribe(),
  
  unsubscribe: (channel) => supabase.removeChannel(channel)
}

// Utility functions
export const utils = {
  // Test connection
  testConnection: async () => {
    try {
      const { data, error } = await supabase.from('people').select('id').limit(1)
      return { success: !error, data, error }
    } catch (err) {
      return { success: false, error: err }
    }
  },

  // Get user stats
  getUserStats: async (userId) => {
    try {
      const [peopleResult, relationsResult, linksResult] = await Promise.all([
        db.people.getByUser(userId),
        supabase.from('family_relations').select('*').eq('created_by', userId),
        db.links.getByUser(userId)
      ])

      const peopleCount = peopleResult.data?.length || 0
      const relationsCount = relationsResult.data?.length || 0
      const linksCount = linksResult.data?.length || 0

      return {
        peopleCount,
        relationsCount,
        verifiedLinks: linksCount,
        totalPoints: peopleCount * 10 + relationsCount * 5 + linksCount * 20
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      return { peopleCount: 0, relationsCount: 0, verifiedLinks: 0, totalPoints: 0 }
    }
  }
}

export default supabase
