export type Database = {
  public: {
    Tables: {
      players: {
        Row: {
          id: string
          full_name: string
          document_id: string
          position: 'Arquero' | 'Defensa' | 'Mediocampista' | 'Delantero'
          team: 'Blanco' | 'Negro'
          photo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          full_name: string
          document_id: string
          position: 'Arquero' | 'Defensa' | 'Mediocampista' | 'Delantero'
          team: 'Blanco' | 'Negro'
          photo_url?: string | null
          created_at: string
        }
        Update: {
          id?: string
          full_name?: string
          document_id?: string
          position?: 'Arquero' | 'Defensa' | 'Mediocampista' | 'Delantero'
          team?: 'Blanco' | 'Negro'
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
