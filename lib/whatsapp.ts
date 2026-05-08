import type { Player } from './types'

// Reemplaza con el número del organizador (código país + número, sin + ni espacios)
export const ORGANIZER_PHONE = '573136135417'

export function buildWhatsAppUrl(player: Player): string {
  const lines = [
    '⚽ *NUEVO JUGADOR REGISTRADO* ⚽',
    '',
    `👤 *Nombre:* ${player.fullName}`,
    `🪪 *Documento:* ${player.documentNumber}`,
    `🎽 *Posición:* ${player.position}`,
    `🏳️ *Equipo:* ${player.team}`,
    '',
    '_Registrado en Fútbol 7 App_',
  ]
  return `https://wa.me/${ORGANIZER_PHONE}?text=${encodeURIComponent(lines.join('\n'))}`
}
