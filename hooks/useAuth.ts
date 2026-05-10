'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface AuthState {
  userId: string | null
  email: string | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  useEffect(() => {
    let isMounted = true

    const init = async () => {
      try {
        setLoading(true)
        const { data } = await supabase.auth.getSession()
        const session = data.session

        if (session?.user && isMounted) {
          setUserId(session.user.id)
          setEmail(session.user.email ?? null)
        } else if (isMounted) {
          setUserId(null)
          setEmail(null)
        }
      } catch (err) {
        console.error('Error initializing auth:', err)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    init()

    // Timeout de seguridad para evitar loading infinito
    const safetyTimeout = setTimeout(() => {
      if (isMounted) {
        console.log('Safety timeout: forcing loading to false')
        setLoading(false)
      }
    }, 5000)

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (isMounted) {
        if (session?.user) {
          setUserId(session.user.id)
          setEmail(session.user.email ?? null)
        } else {
          setUserId(null)
          setEmail(null)
        }
      }
    })

    return () => {
      isMounted = false
      clearTimeout(safetyTimeout)
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (emailValue: string, password: string) => {
    clearError()
    const { error } = await supabase.auth.signInWithPassword({ email: emailValue, password })
    if (error) {
      setError(error.message)
      return false
    }
    return true
  }, [])

  const signUp = useCallback(async (emailValue: string, password: string) => {
    clearError()
    const { error } = await supabase.auth.signUp({ email: emailValue, password })
    if (error) {
      setError(error.message)
      return false
    }
    return true
  }, [])

  const signOut = useCallback(async () => {
    clearError()
    const { error } = await supabase.auth.signOut()
    if (error) {
      setError(error.message)
      return false
    }
    return true
  }, [])

  return {
    userId,
    email,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    clearError,
  }
}
