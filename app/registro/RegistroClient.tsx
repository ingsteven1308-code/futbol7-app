'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import type { Player, PlayerSubmitData, PlayerUpdateData } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { usePlayers } from '@/hooks/usePlayers'
import { useToast } from '@/hooks/useToast'
import { PlayerForm } from '@/app/components/PlayerForm'
import { TeamSection } from '@/app/components/TeamSection'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

interface MatchData {
  id: string
  nombre: string
  fecha: string
  hora: string
  team1_name: string
  team2_name: string
  access_code: string
}

export default function RegistroClient() {
  const params = useSearchParams()
  const router = useRouter()
  const code = params?.get('code') ?? ''
  const [match, setMatch] = useState<MatchData | null>(null)
  const [loadingMatch, setLoadingMatch] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const { toast } = useToast()
  const { players, whiteTeam, blackTeam, addPlayer, updatePlayer, removePlayer, loaded, isLoading } =
    usePlayers(match?.id, match?.team1_name, match?.team2_name)
  const [formKey, setFormKey] = useState(0)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)

  useEffect(() => {
    if (!code) {
      setFetchError('Falta el código del partido en la URL')
      setLoadingMatch(false)
      return
    }

    const loadMatch = async () => {
      try {
        setLoadingMatch(true)
        const { data, error } = await supabase
          .from('matches')
          .select('id,nombre,fecha,hora,team1_name,team2_name,access_code')
          .eq('access_code', code)
          .limit(1)

        if (error) {
          throw error
        }

        if (!data || data.length === 0) {
          setFetchError('Código de partido inválido')
          return
        }

        setMatch(data[0] as MatchData)
      } catch (err) {
        console.error('Error loading match by code:', err)
        setFetchError('No se pudo cargar el partido')
      } finally {
        setLoadingMatch(false)
      }
    }

    loadMatch()
  }, [code])

  const handleAdd = useCallback(
    async (playerData: PlayerSubmitData) => {
      const newPlayer = await addPlayer(playerData)
      if (newPlayer) {
        toast(`✅ ${newPlayer.fullName} registrado en Equipo ${newPlayer.team}`, 'success')
        setFormKey(k => k + 1)
      }
    },
    [addPlayer, toast],
  )

  const handleUpdate = useCallback(
    async (playerData: PlayerSubmitData) => {
      if (!editingPlayer) return

      const updatedPlayer: PlayerUpdateData = {
        ...playerData,
        id: editingPlayer.id,
        createdAt: editingPlayer.createdAt,
      }

      const success = await updatePlayer(updatedPlayer)
      if (success) {
        toast(`✏️ ${updatedPlayer.fullName} actualizado`, 'success')
        setEditingPlayer(null)
      }
    },
    [editingPlayer, updatePlayer, toast],
  )

  const handleDelete = useCallback(
    async (id: string) => {
      const player = players.find(p => p.id === id)
      const success = await removePlayer(id)
      if (success) {
        toast(`🗑️ ${player?.fullName ?? 'Jugador'} eliminado`, 'error')
      }
    },
    [players, removePlayer, toast],
  )

  const handleEdit = useCallback((player: Player) => {
    setEditingPlayer(player)
  }, [])

  const exportToExcel = useCallback(() => {
    if (players.length === 0) {
      alert('No hay jugadores registrados aún')
      return
    }

    const data = players.map(player => ({
      "Nombre completo": player.fullName,
      "Número de documento": player.documentNumber,
      "Posición": player.position,
      "Equipo": player.team
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Jugadores")

    const fileName = `jugadores-${match.nombre.replace(/\s+/g, '-')}.xlsx`
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })

    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName)
  }, [players, match])

  if (loadingMatch) {
    return (
      <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center">
        <div>Cargando partido...</div>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-[#080808] text-white px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-500 bg-red-500/10 p-8 text-red-200">
          <h1 className="text-2xl font-black mb-4">Error</h1>
          <p>{fetchError}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 rounded-2xl border border-gray-700 px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-white hover:border-yellow-500"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  if (!match) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-gray-800 bg-gray-950/95 p-8 shadow-2xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-yellow-400 font-black">Registro por código</p>
              <h1 className="text-3xl font-black mt-3">{match.nombre}</h1>
              <p className="mt-2 text-gray-400">{match.fecha} · {match.hora}</p>
              <p className="mt-1 text-gray-400">Equipo A: {match.team1_name} · Equipo B: {match.team2_name}</p>
              <p className="mt-1 text-gray-400">Código: {match.access_code}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={exportToExcel}
                className="rounded-full bg-gradient-to-r from-green-600 to-green-500 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-white hover:from-green-500 hover:to-green-400 transition-all shadow-[0_0_24px_rgba(34,197,94,0.3)] hover:shadow-[0_0_32px_rgba(34,197,94,0.5)]"
              >
                📊 Exportar a Excel
              </button>
              <button
                onClick={() => router.push('/')}
                className="rounded-full border border-gray-700 px-5 py-3 text-sm font-black uppercase tracking-[0.2em] text-white hover:border-yellow-500"
              >
                Volver al inicio
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
              <h2 className="text-xl font-black mb-4">Registrar jugador</h2>
              <PlayerForm
                key={formKey}
                onSubmit={handleAdd}
                team1Name={match.team1_name}
                team2Name={match.team2_name}
              />
            </section>

            <section className="space-y-6">
              <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
                <TeamSection
                  teamKey={1}
                  teamName={match.team1_name}
                  players={whiteTeam}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
              <div className="rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
                <TeamSection
                  teamKey={2}
                  teamName={match.team2_name}
                  players={blackTeam}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            </section>
          </div>

          {editingPlayer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
              <div
                className="w-full max-w-lg rounded-3xl border border-gray-800 bg-gray-950 p-6 shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-yellow-400 font-black">Editar jugador</p>
                    <h2 className="mt-3 text-2xl font-black text-white">{editingPlayer.fullName}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingPlayer(null)}
                    className="rounded-full border border-gray-700 px-4 py-2 text-sm font-bold text-gray-200 hover:border-white"
                  >
                    Cerrar
                  </button>
                </div>

                <PlayerForm
                  initial={editingPlayer}
                  onSubmit={handleUpdate}
                  onCancel={() => setEditingPlayer(null)}
                  isEditing
                  team1Name={match.team1_name}
                  team2Name={match.team2_name}
                />
              </div>
            </div>
          )}

          {!loaded && (
            <div className="mt-8 text-center text-gray-400">Cargando jugadores...</div>
          )}

          {isLoading && (
            <div className="mt-4 text-sm text-gray-400">Actualizando jugadores...</div>
          )}
        </div>
      </div>
    </div>
  )
}
