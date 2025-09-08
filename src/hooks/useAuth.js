import { useState } from 'react'
import { supabase } from '../supabase'
import toast from 'react-hot-toast'

export function useAuth() {
  const [loading, setLoading] = useState(false)

  const signUp = async (email, password) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      toast.success('Inscription réussie ! Bienvenue !')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      toast.success('Connexion réussie !')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success('Déconnexion réussie')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return {
    signUp,
    signIn,
    signOut,
    loading,
  }
}
