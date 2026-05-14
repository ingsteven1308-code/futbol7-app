export type Database = {
  public: {
    Tables: {
      jugadores: {
        Row: {
          id: string
          nombre: string
          documento: string
          posicion: 'Arquero' | 'Defensa' | 'Mediocampista' | 'Delantero'
          equipo: string
          foto: string | null
          photo_url: string | null
          match_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          documento: string
          posicion: 'Arquero' | 'Defensa' | 'Mediocampista' | 'Delantero'
          equipo: string
          foto?: string | null
          photo_url?: string | null
          match_id?: string | null
          created_at: string
        }
        Update: {
          id?: string
          nombre?: string
          documento?: string
          posicion?: 'Arquero' | 'Defensa' | 'Mediocampista' | 'Delantero'
          equipo?: string
          foto?: string | null
          photo_url?: string | null
          match_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          id: string
          nombre: string
          admin_name: string
          admin_email: string
          admin_phone: string
          football_type: string
          level: string
          fecha: string
          hora: string
          direccion: string
          team1_name: string
          team2_name: string
          access_code: string
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          admin_name: string
          admin_email: string
          admin_phone: string
          football_type: string
          level: string
          fecha: string
          hora: string
          direccion: string
          team1_name: string
          team2_name: string
          access_code: string
          created_at: string
        }
        Update: {
          id?: string
          nombre?: string
          admin_name?: string
          admin_email?: string
          admin_phone?: string
          football_type?: string
          level?: string
          fecha?: string
          hora?: string
          direccion?: string
          team1_name?: string
          team2_name?: string
          access_code?: string
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
