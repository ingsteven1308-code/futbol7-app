import { supabase } from './supabase'

const BUCKET_NAME = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'player-photos'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export async function uploadPlayerPhoto(
  file: File,
  playerId: string,
): Promise<string> {
  // Validar tamaño
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('La foto es muy grande (máximo 5MB)')
  }

  // Validar tipo
  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo debe ser una imagen')
  }

  // Crear nombre único
  const timestamp = Date.now()
  const filename = `${playerId}-${timestamp}`
  const path = `${filename}`

  try {
    // Subir archivo
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (uploadError) {
      throw uploadError
    }

    // Obtener URL pública
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path)

    return data.publicUrl
  } catch (error) {
    console.error('Error uploading photo:', error)
    throw new Error('Error al subir la foto')
  }
}

export async function deletePlayerPhoto(photoUrl: string): Promise<void> {
  if (!photoUrl) return

  try {
    // Extraer path de la URL
    const url = new URL(photoUrl)
    const path = url.pathname.split('/').pop()

    if (!path) return

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path])

    if (error) {
      console.error('Error deleting photo:', error)
    }
  } catch (error) {
    console.error('Error processing photo deletion:', error)
  }
}

export function getPhotoUrl(path: string): string {
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path)
  return data.publicUrl
}
