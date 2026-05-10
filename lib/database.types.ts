export type Database = {
  public: {
    Tables: {
      jugadores: {
        Row: {
          id: string
          nombre: string
          documento: string
          posicion: 'Arquero' | 'Defensa' | 'Mediocampista' | 'Delantero'
          equipo: 'Blanco' | 'Negro'
          foto: string | null
          photo_url: string | null
          created_at: string
          match_id: string
        }
        Insert: {
          id?: string
          nombre: string
          documento: string
          posicion: 'Arquero' | 'Defensa' | 'Mediocampista' | 'Delantero'
          equipo: 'Blanco' | 'Negro'
          foto?: string | null
          photo_url?: string | null
          created_at: string
          match_id: string
        }
        Update: {
          id?: string
          nombre?: string
          documento?: string
          posicion?: 'Arquero' | 'Defensa' | 'Mediocampista' | 'Delantero'
          equipo?: 'Blanco' | 'Negro'
          foto?: string | null
          photo_url?: string | null
          created_at?: string
          match_id?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          id: string
          nombre: string
          created_by: string
          access_code: string
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          created_by: string
          access_code: string
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          created_by?: string
          access_code?: string
          created_at?: string
        }
        Relationships: []
      }
      match_members: {
        Row: {
          id: string
          match_id: string
          user_id: string
          role: 'organizer' | 'player'
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          user_id: string
          role: 'organizer' | 'player'
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          user_id?: string
          role?: 'organizer' | 'player'
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
