import type { Player } from './types'

// Obtener desde variables de entorno
export const ORGANIZER_PHONE = process.env.NEXT_PUBLIC_ORGANIZER_PHONE || '573136135417'

export function buildAdminWhatsAppUrl(players: Player[]): string {
  const total = players.length
  const teamCounts = players.reduce<Record<string, number>>((acc, player) => {
    acc[player.team] = (acc[player.team] ?? 0) + 1
    return acc
  }, {})

  const lines = [
    '⚽ RESUMEN DE ASISTENCIA AL PARTIDO ⚽',
    '',
    `👥 *Total de jugadores:* ${total}`,
    ...Object.entries(teamCounts).map(
      ([team, count]) => `• *${team}:* ${count}`,
    ),
    '',
    '📝 *Jugadores registrados:*',
    '',
    ...players.map(player => `• ${player.fullName} (${player.team})`),
  ]

  return `https://wa.me/${ORGANIZER_PHONE}?text=${encodeURIComponent(lines.join('\n'))}`
}
