'use client'
import { useState } from 'react'
import type { Player, PlayerSubmitData, Position, Team } from '@/lib/types'
import { PhotoCapture } from './PhotoCapture'

const POSITIONS: Position[] = ['Arquero', 'Defensa', 'Mediocampista', 'Delantero']
const TEAMS: Team[] = ['Blanco', 'Negro']

const POSITION_ICONS: Record<Position, string> = {
  Arquero: '🧤',
  Defensa: '🛡️',
  Mediocampista: '⚙️',
  Delantero: '⚡',
}

interface FormData {
  fullName: string
  documentNumber: string
  position: Position | ''
  team: Team | ''
  photoUrl: string | null
  photoFile: File | null
}

interface Errors {
  fullName?: string
  documentNumber?: string
  position?: string
  team?: string
}

interface Props {
  initial?: Player
  onSubmit: (data: PlayerSubmitData) => void
  onCancel?: () => void
  isEditing?: boolean
}

export function PlayerForm({ initial, onSubmit, onCancel, isEditing }: Props) {
  const [form, setForm] = useState<FormData>({
    fullName: initial?.fullName ?? '',
    documentNumber: initial?.documentNumber ?? '',
    position: initial?.position ?? '',
    team: initial?.team ?? '',
    photoUrl: initial?.photoUrl ?? null,
    photoFile: null,
  })
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: undefined }))
  }

  function validate(): boolean {
    const e: Errors = {}
    if (!form.fullName.trim()) e.fullName = 'El nombre es requerido'
    if (!form.documentNumber.trim()) e.documentNumber = 'El documento es requerido'
    else if (!/^\d{4,12}$/.test(form.documentNumber.trim()))
      e.documentNumber = 'Ingresa entre 4 y 12 dígitos'
    if (!form.position) e.position = 'Selecciona una posición'
    if (!form.team) e.team = 'Selecciona un equipo'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 350))
    onSubmit({
      fullName: form.fullName.trim(),
      documentNumber: form.documentNumber.trim(),
      position: form.position as Position,
      team: form.team as Team,
      photoUrl: form.photoUrl,
      photoFile: form.photoFile,
    })
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Photo */}
      <div className="flex justify-center pb-1">
        <PhotoCapture
          value={form.photoUrl}
          onChange={(file, preview) => {
            set('photoUrl', preview)
            set('photoFile', file)
          }}
        />
      </div>

      {/* Name */}
      <div>
        <label className="block text-[11px] font-bold text-yellow-500 uppercase tracking-widest mb-1.5">
          Nombre Completo <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.fullName}
          onChange={e => set('fullName', e.target.value)}
          placeholder="Ej: Carlos Valderrama"
          className={`w-full bg-gray-950 border rounded-xl px-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:ring-1 transition-all ${
            errors.fullName
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-800 focus:border-yellow-500 focus:ring-yellow-500'
          }`}
        />
        {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
      </div>

      {/* Document */}
      <div>
        <label className="block text-[11px] font-bold text-yellow-500 uppercase tracking-widest mb-1.5">
          Número de Documento <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          inputMode="numeric"
          value={form.documentNumber}
          onChange={e => set('documentNumber', e.target.value.replace(/\D/g, '').slice(0, 12))}
          placeholder="Ej: 12345678"
          className={`w-full bg-gray-950 border rounded-xl px-4 py-3 text-white placeholder-gray-700 focus:outline-none focus:ring-1 transition-all ${
            errors.documentNumber
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-800 focus:border-yellow-500 focus:ring-yellow-500'
          }`}
        />
        {errors.documentNumber && (
          <p className="text-red-400 text-xs mt-1">{errors.documentNumber}</p>
        )}
      </div>

      {/* Position */}
      <div>
        <label className="block text-[11px] font-bold text-yellow-500 uppercase tracking-widest mb-1.5">
          Posición <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {POSITIONS.map(pos => (
            <button
              key={pos}
              type="button"
              onClick={() => set('position', pos)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all ${
                form.position === pos
                  ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400 shadow-[0_0_12px_rgba(255,215,0,0.2)]'
                  : 'border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300'
              }`}
            >
              <span>{POSITION_ICONS[pos]}</span>
              {pos}
            </button>
          ))}
        </div>
        {errors.position && <p className="text-red-400 text-xs mt-1">{errors.position}</p>}
      </div>

      {/* Team */}
      <div>
        <label className="block text-[11px] font-bold text-yellow-500 uppercase tracking-widest mb-1.5">
          Equipo <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => set('team', 'Blanco')}
            className={`py-3 rounded-xl border-2 font-black text-sm transition-all ${
              form.team === 'Blanco'
                ? 'border-white bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.25)]'
                : 'border-gray-700 text-gray-500 hover:border-gray-500'
            }`}
          >
            🏳️ Blanco
          </button>
          <button
            type="button"
            onClick={() => set('team', 'Negro')}
            className={`py-3 rounded-xl border-2 font-black text-sm transition-all ${
              form.team === 'Negro'
                ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.2)]'
                : 'border-gray-700 text-gray-500 hover:border-gray-500'
            }`}
          >
            🏴 Negro
          </button>
        </div>
        {errors.team && <p className="text-red-400 text-xs mt-1">{errors.team}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white transition-all font-bold text-sm"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-black text-sm hover:from-yellow-500 hover:to-yellow-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_24px_rgba(255,215,0,0.3)] hover:shadow-[0_0_32px_rgba(255,215,0,0.5)]"
        >
          {submitting ? '⏳ Guardando...' : isEditing ? '✏️ Actualizar Jugador' : '✅ Agregar Jugador'}
        </button>
      </div>
    </form>
  )
}
