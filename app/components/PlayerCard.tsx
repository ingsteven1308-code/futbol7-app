'use client'
import type { Player, Position } from '@/lib/types'

const ABBR: Record<Position, string> = {
  Arquero: 'POR',
  Defensa: 'DEF',
  Mediocampista: 'MED',
  Delantero: 'DEL',
}

const RATING: Record<Position, number> = {
  Arquero: 82,
  Defensa: 78,
  Mediocampista: 84,
  Delantero: 88,
}

interface Props {
  player: Player
  onEdit: (player: Player) => void
  onDelete: (id: string) => void
}

export function PlayerCard({ player, onEdit, onDelete }: Props) {
  const isWhite = player.team === 'Blanco'
  const abbr = ABBR[player.position]
  const rating = RATING[player.position]

  return (
    <div className="relative group transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-default select-none">
      {/* Glow ring behind card */}
      <div
        className={`absolute inset-0 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300 ${
          isWhite ? 'bg-white/30' : 'bg-yellow-500/30'
        }`}
      />

      {/* Card */}
      <div
        className={`relative w-44 rounded-2xl overflow-hidden flex flex-col border-2 ${
          isWhite
            ? 'bg-gradient-to-b from-gray-100 via-white to-gray-200 border-white/80 shadow-[0_8px_32px_rgba(255,255,255,0.15)]'
            : 'bg-gradient-to-b from-gray-900 via-[#111] to-black border-yellow-500/70 shadow-[0_8px_32px_rgba(255,215,0,0.15)]'
        }`}
      >
        {/* Header strip */}
        <div
          className={`px-3 pt-3 pb-2 flex justify-between items-start ${
            isWhite ? 'text-gray-800' : 'text-yellow-400'
          }`}
        >
          {/* Rating + position */}
          <div className="flex flex-col leading-none">
            <span className="text-[28px] font-black leading-none">{rating}</span>
            <span className="text-[10px] font-extrabold tracking-widest mt-0.5">{abbr}</span>
          </div>

          {/* Mini stats */}
          <div className="flex flex-col gap-[3px] text-[9px] font-bold items-end opacity-80 mt-1">
            <span>PAC {Math.floor(Math.random() * 15) + 75}</span>
            <span>SHO {Math.floor(Math.random() * 15) + 70}</span>
            <span>PAS {Math.floor(Math.random() * 15) + 72}</span>
          </div>
        </div>

        {/* Photo */}
        <div className="px-3">
          <div
            className={`w-full aspect-square rounded-xl overflow-hidden border-2 ${
              isWhite ? 'border-gray-300/60' : 'border-yellow-600/50'
            }`}
          >
            {player.photo ? (
              <img
                src={player.photo}
                alt={player.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center text-5xl ${
                  isWhite ? 'bg-gray-200' : 'bg-gray-800'
                }`}
              >
                ⚽
              </div>
            )}
          </div>
        </div>

        {/* Info strip */}
        <div
          className={`px-3 py-2.5 text-center border-t mt-2 ${
            isWhite ? 'border-gray-200 bg-gray-50' : 'border-yellow-900/40 bg-black/40'
          }`}
        >
          <div
            className={`text-[9px] font-bold uppercase tracking-[0.15em] mb-0.5 ${
              isWhite ? 'text-gray-400' : 'text-yellow-600'
            }`}
          >
            {isWhite ? '🏳️ EQUIPO BLANCO' : '🏴 EQUIPO NEGRO'}
          </div>
          <div
            className={`font-black text-[11px] uppercase leading-tight truncate ${
              isWhite ? 'text-gray-900' : 'text-white'
            }`}
          >
            {player.fullName}
          </div>
          <div className={`text-[9px] mt-0.5 ${isWhite ? 'text-gray-400' : 'text-gray-500'}`}>
            {player.documentNumber}
          </div>
        </div>

        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-250 rounded-2xl">
          <p className="text-white text-xs font-bold truncate px-4 text-center">
            {player.fullName}
          </p>
          <button
            onClick={() => onEdit(player)}
            className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg text-xs hover:bg-yellow-400 transition-colors w-28"
          >
            ✏️ Editar
          </button>
          <button
            onClick={() => onDelete(player.id)}
            className="px-4 py-2 bg-red-700 text-white font-bold rounded-lg text-xs hover:bg-red-600 transition-colors w-28"
          >
            🗑️ Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
