'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import type { Player, PlayerSubmitData, PlayerUpdateData } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { uploadPlayerPhoto, deletePlayerPhoto } from '@/lib/supabaseStorage'
import { useToast } from './useToast'

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loaded, setLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const subscriptionRef = useRef<any>(null)

  // Transformar datos de Supabase a formato local
  const transformPlayer = (dbPlayer: any): Player => ({
    id: dbPlayer.id,
    fullName: dbPlayer.nombre,
    documentNumber: dbPlayer.documento,
    position: dbPlayer.posicion,
    team: dbPlayer.equipo,
    photoUrl: dbPlayer.photo_url ?? dbPlayer.foto ?? null,
    createdAt: dbPlayer.created_at,
  })

  // Cargar jugadores iniciales
  useEffect(() => {
    loadPlayers()
    return () => {
      // Cleanup subscription
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
      }
    }
  }, [])

  const loadPlayers = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('jugadores')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const transformedPlayers = (data ?? []).map(transformPlayer)
      setPlayers(transformedPlayers)

      // Configurar suscripción en tiempo real
      setupRealtimeSubscription()
    } catch (error) {
      console.error('Error loading players:', error)
      toast('Error al cargar los jugadores', 'error')
    } finally {
      setIsLoading(false)
      setLoaded(true)
    }
  }

  // Suscripción en tiempo real
  const setupRealtimeSubscription = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe()
    }

    subscriptionRef.current = supabase
      .channel('players-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jugadores',
        },
        (payload) => {
          handleRealtimeUpdate(payload)
        },
      )
      .subscribe()
  }

  // Manejar actualizaciones en tiempo real
  const handleRealtimeUpdate = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload

    setPlayers((prev) => {
      switch (eventType) {
        case 'INSERT': {
          const transformed = transformPlayer(newRecord)
          return prev.some((p) => p.id === transformed.id)
            ? prev.map((p) => (p.id === transformed.id ? transformed : p))
            : [transformed, ...prev]
        }

        case 'UPDATE':
          return prev.map((p) =>
            p.id === newRecord.id ? transformPlayer(newRecord) : p,
          )

        case 'DELETE':
          return prev.filter((p) => p.id !== oldRecord.id)

        default:
          return prev
      }
    })
  }

  // Agregar jugador
  const addPlayer = useCallback(
    async (
      playerData: PlayerSubmitData,
    ): Promise<Player | null> => {
      try {
        const id = crypto.randomUUID()

        let photoUrl = playerData.photoUrl || null

        if (playerData.photoFile) {
          photoUrl = await uploadPlayerPhoto(playerData.photoFile, id)
        }

        const newPlayerInsert = {
          id,
          nombre: playerData.fullName,
          documento: playerData.documentNumber,
          posicion: playerData.position,
          equipo: playerData.team,
          photo_url: photoUrl,
          created_at: new Date().toISOString(),
        }

        const { data, error } = await supabase
          .from('jugadores')
          .insert([newPlayerInsert])
          .select()
          .single()

        if (error) throw error

        const newPlayer = transformPlayer(data)
        setPlayers(prev =>
          prev.some(player => player.id === newPlayer.id)
            ? prev
            : [newPlayer, ...prev],
        )

        return newPlayer
      } catch (error) {
        console.error('Error adding player:', error)
        toast('Error al registrar el jugador', 'error')
        return null
      }
    },
    [toast],
  )

  // Actualizar jugador
  const updatePlayer = useCallback(
    async (player: PlayerUpdateData): Promise<boolean> => {
      try {
        let photoUrl = player.photoUrl || null

        if (player.photoFile) {
          const previousPhotoUrl = photoUrl
          photoUrl = await uploadPlayerPhoto(player.photoFile, player.id)
          if (previousPhotoUrl) {
            await deletePlayerPhoto(previousPhotoUrl)
          }
        }

        const { error } = await supabase
          .from('jugadores')
          .update({
            nombre: player.fullName,
            documento: player.documentNumber,
            posicion: player.position,
            equipo: player.team,
            photo_url: photoUrl,
          })
          .eq('id', player.id)

        if (error) throw error

        setPlayers(prev =>
          prev.map((item) =>
            item.id === player.id
              ? {
                  ...item,
                  fullName: player.fullName,
                  documentNumber: player.documentNumber,
                  position: player.position,
                  team: player.team,
                  photoUrl,
                }
              : item,
          ),
        )

        return true
      } catch (error) {
        console.error('Error updating player:', error)
        toast('Error al actualizar el jugador', 'error')
        return false
      }
    },
    [toast],
  )

  // Eliminar jugador
  const removePlayer = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const player = players.find(item => item.id === id)

        const { error } = await supabase.from('jugadores').delete().eq('id', id)
        if (error) throw error

        setPlayers(prev => prev.filter(player => player.id !== id))

        if (player?.photoUrl) {
          await deletePlayerPhoto(player.photoUrl)
        }

        return true
      } catch (error) {
        console.error('Error removing player:', error)
        toast('Error al eliminar el jugador', 'error')
        return false
      }
    },
    [players, toast],
  )

  // Eliminar todos los jugadores (para reiniciar partido)
  const clearAllPlayers = useCallback(async (): Promise<boolean> => {
    try {
      const { data, error: selectError } = await supabase
        .from('jugadores')
        .select('photo_url')

      if (selectError) throw selectError

      const { error } = await supabase
  .from("jugadores")
  .delete()
  .not("id", "is", null)
      if (error) throw error

      setPlayers([])

      if (data?.length) {
        await Promise.all(
          data
            .map((player: any) => player.photo_url)
            .filter(Boolean)
            .map((photoUrl: string) => deletePlayerPhoto(photoUrl)),
        )
      }

      return true
    } catch (error) {
      console.error('Error clearing all players:', error)
      toast('Error al limpiar los jugadores', 'error')
      return false
    }
  }, [toast])

  // Filtrar equipos
  const whiteTeam = players.filter((p) => p.team === 'Blanco')
  const blackTeam = players.filter((p) => p.team === 'Negro')

  return {
    players,
    whiteTeam,
    blackTeam,
    addPlayer,
    updatePlayer,
    removePlayer,
    clearAllPlayers,
    loaded,
    isLoading,
  }
}
