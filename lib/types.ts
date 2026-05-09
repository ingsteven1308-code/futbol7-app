export type Position = 'Arquero' | 'Defensa' | 'Mediocampista' | 'Delantero'
export type Team = 'Blanco' | 'Negro'

export interface Player {
  id: string
  fullName: string
  documentNumber: string
  position: Position
  team: Team
  photoUrl: string | null
  createdAt: number
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
  createdAt: number
}

export interface ToastItem {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}
