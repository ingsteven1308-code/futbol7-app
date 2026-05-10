'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Role } from '@/lib/types'

export interface MatchSession {
  id: string
  name: string
  accessCode: string
  role: Role
}

export interface MembershipState {
  currentMatch: MatchSession | null
  loading: boolean
}

/**
 * Hook que carga la membresía/partido actual del usuario
 * SOLO se ejecuta cuando:
 * - authLoading === false (sesión ya se obtuvo)
 * - userId está disponible
 * 
 * @param userId - ID del usuario actual
 * @param authLoading - si la autenticación aún está cargando
 * @param refreshTrigger - número que cambia para forzar refetch
 */
export function useMembership(userId: string | null, authLoading: boolean, refreshTrigger: number = 0) {
  const [currentMatch, setCurrentMatch] = useState<MatchSession | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Solo cargar si:
    // 1. No estamos en medio de cargar autenticación
    // 2. Tenemos un userId
    if (authLoading || !userId) {
      setCurrentMatch(null)
      return
    }

    let isMounted = true

    const loadMembership = async () => {
      try {
        setLoading(true)

        // Obtener la membresía más reciente del usuario
        const { data: membership, error: membershipError } = await supabase
          .from('match_members')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (!isMounted) return

        if (membershipError) {
          console.error('Error loading membership:', membershipError)
          setCurrentMatch(null)
          return
        }

        if (!membership) {
          setCurrentMatch(null)
          return
        }

        // Obtener los datos del match
        const { data: match, error: matchError } = await supabase
          .from('matches')
          .select('*')
          .eq('id', membership.match_id)
          .maybeSingle()

        if (!isMounted) return

        if (matchError) {
          console.error('Error loading match:', matchError)
          setCurrentMatch(null)
          return
        }

        if (!match) {
          console.warn('Match not found for membership:', membership.match_id)
          setCurrentMatch(null)
          return
        }

        setCurrentMatch({
          id: match.id,
          name: match.nombre,
          accessCode: match.access_code,
          role: membership.role,
        })
      } catch (err) {
        console.error('Unexpected error in loadMembership:', err)
        if (isMounted) {
          setCurrentMatch(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadMembership()

    return () => {
      isMounted = false
    }
  }, [userId, authLoading])

  return {
    currentMatch,
    loading,
  }
}
