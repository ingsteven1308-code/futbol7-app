'use client'
import type { Player } from '@/lib/types'
import { PlayerCard } from './PlayerCard'

interface Props {
  teamKey: 1 | 2
  teamName: string
  players: Player[]
  onEdit: (player: Player) => void
  onDelete: (id: string) => void
}

export function TeamSection({ teamKey, teamName, players, onEdit, onDelete }: Props) {
  const isWhite = teamKey === 1

  return (
    <div
      className={`rounded-2xl border p-5 flex flex-col gap-5 ${
        isWhite
          ? 'bg-gradient-to-b from-gray-800/60 to-gray-900/80 border-gray-700/50'
          : 'bg-gradient-to-b from-gray-950 to-black border-yellow-900/40'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{isWhite ? '🏳️' : '🏴'}</span>
          <div>
            <h2
              className={`text-xl font-black uppercase tracking-wide ${
                isWhite ? 'text-white' : 'text-yellow-400'
              }`}
            >
              Equipo {teamName}
            </h2>
            <p className="text-xs text-gray-500">
              {players.length} jugador{players.length !== 1 ? 'es' : ''}
            </p>
          </div>
        </div>
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-lg ${
            isWhite ? 'bg-white text-black' : 'bg-yellow-500 text-black'
          }`}
        >
          {players.length}
        </div>
      </div>

      {/* Cards */}
      {players.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-5xl mb-2 opacity-30">⚽</div>
          <p className="text-gray-600 text-sm">Sin jugadores aún</p>
          <p className="text-gray-700 text-xs mt-1">Registra el primero arriba</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">
          {players.map(player => (
            <PlayerCard
              key={player.id}
              player={player}
              onEdit={onEdit}
              onDelete={onDelete}
              teamName={teamName}
              isPrimaryTeam={isWhite}
            />
          ))}
        </div>
      )}
    </div>
  )
}
