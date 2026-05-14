'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const generateAccessCode = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('')
}

export default function CreateMatchPage() {
  const router = useRouter()
  const [adminName, setAdminName] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPhone, setAdminPhone] = useState('')
  const [nombre, setNombre] = useState('')
  const [footballType, setFootballType] = useState('7')
  const [level, setLevel] = useState('casual')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [direccion, setDireccion] = useState('')
  const [team1Name, setTeam1Name] = useState('Equipo 1')
  const [team2Name, setTeam2Name] = useState('Equipo 2')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [createdMatch, setCreatedMatch] = useState<any | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!adminName || !adminEmail || !adminPhone || !nombre || !fecha || !hora || !direccion || !team1Name || !team2Name) {
      setError('Todos los campos son obligatorios')
      return
    }

    const cleanPhone = adminPhone.replace(/\D/g, '')
    if (!/^[0-9]{8,15}$/.test(cleanPhone)) {
      setError('El teléfono debe incluir código de país y sólo números')
      return
    }

    const accessCode = generateAccessCode()
    const matchId = crypto.randomUUID()
    const createdAt = new Date().toISOString()

    try {
      setLoading(true)
      const { data, error: insertError } = await supabase
        .from('matches')
        .insert([
          {
            id: matchId,
            nombre,
            admin_name: adminName,
            admin_email: adminEmail,
            admin_phone: cleanPhone,
            football_type: footballType,
            level,
            fecha,
            hora,
            direccion,
            team1_name: team1Name,
            team2_name: team2Name,
            access_code: accessCode,
            created_at: createdAt,
          },
        ])
        .select()
        .limit(1)

      if (insertError) {
        throw insertError
      }

      if (!data || data.length === 0) {
        throw new Error('No se creó el partido')
      }

      setCreatedMatch(data[0])
      setShowSuccessModal(true)
    } catch (err) {
      console.error('Error creating match:', err)
      setError('Error al crear el partido')
    } finally {
      setLoading(false)
    }
  }

  const handleSendWhatsapp = () => {
    if (!createdMatch) return

    const cleanPhone = String(createdMatch.admin_phone).replace(/\D/g, '')
    const message = `Partido creado exitosamente!\nNombre: ${createdMatch.nombre}\nCódigo: ${createdMatch.access_code}\nRegístrate aquí: https://futbol7-app.vercel.app/registro?code=${createdMatch.access_code}`
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-gray-800 bg-gray-950/95 p-8 shadow-2xl">
        <h1 className="text-3xl font-black mb-6">Crear partido</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-gray-300">Nombre administrador</span>
              <input
                value={adminName}
                onChange={e => setAdminName(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3 text-white outline-none focus:border-yellow-500"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-gray-300">Correo administrador</span>
              <input
                type="email"
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3 text-white outline-none focus:border-yellow-500"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-gray-300">Nombre del partido</span>
            <input
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3 text-white outline-none focus:border-yellow-500"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="text-sm font-semibold text-gray-300">Tipo de fútbol</span>
              <select
                value={footballType}
                onChange={e => setFootballType(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3 text-white outline-none focus:border-yellow-500"
              >
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="11">11</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-gray-300">Nivel</span>
              <select
                value={level}
                onChange={e => setLevel(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3 text-white outline-none focus:border-yellow-500"
              >
                <option value="casual">Casual</option>
                <option value="intermedio">Intermedio</option>
                <option value="competitivo">Competitivo</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-gray-300">Fecha</span>
              <input
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3 text-white outline-none focus:border-yellow-500"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-gray-300">Hora</span>
              <input
                type="time"
                value={hora}
                onChange={e => setHora(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3 text-white outline-none focus:border-yellow-500"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-gray-300">Dirección</span>
              <input
                value={direccion}
                onChange={e => setDireccion(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3 text-white outline-none focus:border-yellow-500"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-gray-300">Nombre equipo 1</span>
              <input
                value={team1Name}
                onChange={e => setTeam1Name(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3 text-white outline-none focus:border-yellow-500"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-gray-300">Nombre equipo 2</span>
              <input
                value={team2Name}
                onChange={e => setTeam2Name(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3 text-white outline-none focus:border-yellow-500"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-gray-300">Teléfono administrador</span>
            <input
              type="tel"
              value={adminPhone}
              onChange={e => setAdminPhone(e.target.value)}
              placeholder="573001234567"
              className="mt-2 w-full rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3 text-white outline-none focus:border-yellow-500"
            />
          </label>

          {error && <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-200">{error}</div>}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-yellow-500 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-black hover:bg-yellow-400 disabled:opacity-50"
            >
              {loading ? 'Creando partido...' : 'Crear partido'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="rounded-2xl border border-gray-700 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-white hover:border-yellow-500 hover:text-yellow-400"
            >
              Volver
            </button>
          </div>
        </form>
      </div>

      {showSuccessModal && createdMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-gray-800 bg-gray-950 p-8 shadow-2xl">
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.2em] text-green-400 font-black">Partido creado exitosamente</p>
              <h2 className="mt-4 text-4xl font-black text-white">{createdMatch.access_code}</h2>
              <p className="mt-3 text-gray-400">Comparte este código para que los jugadores se registren.</p>
            </div>

            <div className="mt-8 grid gap-4 rounded-3xl border border-gray-800 bg-gray-900/80 p-5 text-left text-sm text-gray-300">
              <p>
                <span className="font-semibold text-white">Partido:</span> {createdMatch.nombre}
              </p>
              <p>
                <span className="font-semibold text-white">WhatsApp:</span> {createdMatch.admin_phone}
              </p>
              <p>
                <span className="font-semibold text-white">Enlace de registro:</span>
                <br />
                <span className="text-yellow-300">https://futbol7-app.vercel.app/registro?code={createdMatch.access_code}</span>
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleSendWhatsapp}
                className="rounded-2xl bg-green-500 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-black hover:bg-green-400"
              >
                Enviar por WhatsApp
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false)
                  router.push('/')
                }}
                className="rounded-2xl border border-gray-700 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-white hover:border-yellow-500"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
