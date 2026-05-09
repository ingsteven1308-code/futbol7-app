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
