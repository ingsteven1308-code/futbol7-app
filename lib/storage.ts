import type { Player } from './types'

const KEY = 'f7_players'

function read(): Player[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

function write(players: Player[]): void {
  localStorage.setItem(KEY, JSON.stringify(players))
}

export const storage = {
  get: read,
  add(player: Player): Player[] {
    const list = [...read(), player]
    write(list)
    return list
  },
  update(player: Player): Player[] {
    const list = read().map(p => (p.id === player.id ? player : p))
    write(list)
    return list
  },
  remove(id: string): Player[] {
    const list = read().filter(p => p.id !== id)
    write(list)
    return list
  },
}
