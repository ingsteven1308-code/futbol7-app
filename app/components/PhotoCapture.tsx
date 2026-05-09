'use client'
import { useRef, useCallback } from 'react'

interface Props {
  value: string | null
  onChange: (file: File | null, preview: string | null) => void
}

async function resizeImage(file: File, maxPx = 480): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(maxPx / img.width, maxPx / img.height, 1)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.src = e.target!.result as string
    }
    reader.readAsDataURL(file)
  })
}

export function PhotoCapture({ value, onChange }: Props) {
  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      const preview = await resizeImage(file)
      onChange(file, preview)
      e.target.value = ''
    },
    [onChange],
  )

  return (
    <div className="flex flex-col items-center gap-3">
      {value ? (
        <div className="relative group">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-yellow-500 shadow-[0_0_24px_rgba(255,215,0,0.45)]">
            <img src={value} alt="Foto jugador" className="w-full h-full object-cover" />
          </div>
          <button
            type="button"
            onClick={() => onChange(null, null)}
            className="absolute inset-0 flex items-center justify-center bg-black/65 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"
          >
            Cambiar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => galleryRef.current?.click()}
          className="w-28 h-28 rounded-full border-2 border-dashed border-yellow-500/40 flex flex-col items-center justify-center hover:border-yellow-500 hover:bg-yellow-500/5 transition-all"
        >
          <span className="text-4xl">📷</span>
          <span className="text-[10px] text-gray-500 mt-1">Foto</span>
        </button>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          className="text-[11px] text-yellow-600 hover:text-yellow-400 transition-colors"
        >
          📷 Cámara
        </button>
        <span className="text-gray-700 text-[11px]">|</span>
        <button
          type="button"
          onClick={() => galleryRef.current?.click()}
          className="text-[11px] text-yellow-600 hover:text-yellow-400 transition-colors"
        >
          🖼️ Galería
        </button>
      </div>

      {/* Camera input — triggers device camera on mobile */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
      />
      {/* Gallery input — shows file picker / photo library */}
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  )
}
