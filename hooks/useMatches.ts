'use client'

import { useCallback, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Role } from '@/lib/types'

export interface MatchSession {
  id: string
  name: string
  accessCode: string
  role: Role
}

const makeAccessCode = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('')
}

/**
 * Hook que maneja operaciones de matches (crear, unirse)
 * NO afecta el loading de autenticación
 * Usa error local para mostrar mensajes
 */
export function useMatches(userId: string | null) {
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  const createMatch = useCallback(
    async (name: string): Promise<MatchSession | null> => {
      try {
        if (!userId) {
          setError('Debes iniciar sesión primero')
          return null
        }

        if (!name || name.trim().length === 0) {
          setError('Ingresa un nombre para el partido')
          return null
        }

        clearError()

        const accessCode = makeAccessCode()
        const matchId = crypto.randomUUID()
        const now = new Date().toISOString()

        // Insertar match
        const { data: matches, error: matchError } = await supabase
          .from('matches')
          .insert([
            {
              id: matchId,
              nombre: name.trim(),
              created_by: userId,
              access_code: accessCode,
              created_at: now,
            },
          ])
          .select()

        if (matchError || !matches || matches.length === 0) {
          console.error('Error creating match:', matchError)
          setError('No se pudo crear el partido')
          return null
        }

        const match = matches[0]

        // Insertar membership como organizador
        const { error: memberError } = await supabase.from('match_members').insert([
          {
            match_id: match.id,
            user_id: userId,
            role: 'organizer',
            created_at: now,
          },
        ])

        if (memberError) {
          console.error('Error creating organizer membership:', memberError)
          setError('No se pudo registrar al organizador')
          return null
        }

        const session: MatchSession = {
          id: match.id,
          name: match.nombre,
          accessCode: match.access_code,
          role: 'organizer',
        }

        return session
      } catch (err) {
        console.error('Unexpected error in createMatch:', err)
        setError('Error inesperado al crear el partido')
        return null
      }
    },
    [userId],
  )

  const joinMatch = useCallback(
    async (accessCodeValue: string): Promise<MatchSession | null> => {
      try {
        if (!userId) {
          setError('Debes iniciar sesión primero')
          return null
        }

        clearError()

        const code = accessCodeValue.trim()
        if (!code) {
          setError('Ingresa un código de partido')
          return null
        }

        // Buscar el match por código
        const { data: matches, error: matchError } = await supabase
          .from('matches')
          .select('*')
          .ilike('access_code', code)

        if (matchError) {
          console.error('Error searching for match:', matchError)
          setError('Error al buscar el partido')
          return null
        }

        if (!matches || matches.length === 0) {
          setError('Código de partido inválido')
          return null
        }

        const match = matches[0]

        // Verificar si ya es miembro
        const { data: existingMember, error: existingError } = await supabase
          .from('match_members')
          .select('*')
          .eq('match_id', match.id)
          .eq('user_id', userId)
          .maybeSingle()

        if (existingError) {
          console.error('Error checking membership:', existingError)
          setError('No se pudo verificar la membresía')
          return null
        }

        // Si no es miembro, insertarlo como player
        if (!existingMember) {
          const now = new Date().toISOString()
          const { error: insertError } = await supabase.from('match_members').insert([
            {
              match_id: match.id,
              user_id: userId,
              role: 'player',
              created_at: now,
            },
          ])

          if (insertError) {
            console.error('Error joining match:', insertError)
            setError('No se pudo unir al partido')
            return null
          }
        }

        // Determinar rol
        const roleValue = existingMember?.role === 'organizer' ? 'organizer' : 'player'

        const session: MatchSession = {
          id: match.id,
          name: match.nombre,
          accessCode: match.access_code,
          role: roleValue,
        }

        return session
      } catch (err) {
        console.error('Unexpected error in joinMatch:', err)
        setError('Error inesperado al unirse al partido')
        return null
      }
    },
    [userId],
  )

  return {
    error,
    clearError,
    createMatch,
    joinMatch,
  }
}
