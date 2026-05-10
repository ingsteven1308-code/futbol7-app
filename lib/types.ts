export type Position = 'Arquero' | 'Defensa' | 'Mediocampista' | 'Delantero'
export type Team = 'Blanco' | 'Negro'
export type Role = 'organizer' | 'player'

export interface Player {
  id: string
  fullName: string
  documentNumber: string
  position: Position
  team: Team
  photoUrl: string | null
  createdAt: string
}

export interface PlayerSubmitData {
  fullName: string
  documentNumber: string
  position: Position
  team: Team
  photoUrl: string | null
  photoFile?: File | null
}

export interface PlayerUpdateData extends PlayerSubmitData {
  id: string
  createdAt: string
}

export interface ToastItem {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}
