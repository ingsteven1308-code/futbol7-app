export type Database = {
  public: {
    Tables: {
      players: {
        Row: {
          id: string
          full_name: string
          document_number: string
          position: 'Arquero' | 'Defensa' | 'Mediocampista' | 'Delantero'
          team: 'Blanco' | 'Negro'
          photo_url: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          full_name: string
          document_number: string
          position: 'Arquero' | 'Defensa' | 'Mediocampista' | 'Delantero'
          team: 'Blanco' | 'Negro'
          photo_url?: string | null
          created_at: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string
          document_number?: string
          position?: 'Arquero' | 'Defensa' | 'Mediocampista' | 'Delantero'
          team?: 'Blanco' | 'Negro'
          photo_url?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
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
