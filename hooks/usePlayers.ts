'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Player } from '@/lib/types'
import { storage } from '@/lib/storage'

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setPlayers(storage.get())
    setLoaded(true)
  }, [])

  const addPlayer = useCallback((player: Player) => {
    setPlayers(storage.add(player))
  }, [])

  const updatePlayer = useCallback((player: Player) => {
    setPlayers(storage.update(player))
  }, [])

  const removePlayer = useCallback((id: string) => {
    setPlayers(storage.remove(id))
  }, [])

  const whiteTeam = players.filter(p => p.team === 'Blanco')
  const blackTeam = players.filter(p => p.team === 'Negro')

  return { players, whiteTeam, blackTeam, addPlayer, updatePlayer, removePlayer, loaded }
}
