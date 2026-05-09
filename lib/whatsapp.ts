import type { Player } from './types'

// Obtener desde variables de entorno
export const ORGANIZER_PHONE = process.env.NEXT_PUBLIC_ORGANIZER_PHONE || '573136135417'

export function buildAdminWhatsAppUrl(players: Player[]): string {
  const total = players.length
  const whiteTeam = players.filter(player => player.team === 'Blanco')
  const blackTeam = players.filter(player => player.team === 'Negro')

  const lines = [
    '⚽ *RESUMEN DE ASISTENCIA - FÚTBOL 7* ⚽',
    '',
    `👥 *Total de jugadores:* ${total}`,
    `🏳️ *Equipo Blanco:* ${whiteTeam.length}`,
    `🏴 *Equipo Negro:* ${blackTeam.length}`,
    '',
    '📝 *Jugadores registrados:*',
    '',
    ...players.map(player => `• ${player.fullName} (${player.team})`),
    '',
    '📅 Enviado desde la app de organización de partidos',
  ]

  return `https://wa.me/${ORGANIZER_PHONE}?text=${encodeURIComponent(lines.join('\n'))}`
}
