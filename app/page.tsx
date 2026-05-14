'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface MatchListItem {
  id: string
  nombre: string
  fecha: string
  hora: string
  access_code: string
}

export const dynamic = 'force-dynamic'

export default function Page() {
  const router = useRouter()
  const [matches, setMatches] = useState<MatchListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [joinOpen, setJoinOpen] = useState(false)
  const [code, setCode] = useState('')
  const [joinError, setJoinError] = useState<string | null>(null)
  const [joinLoading, setJoinLoading] = useState(false)

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('matches')
          .select('id,nombre,fecha,hora,access_code')
          .order('created_at', { ascending: false })

        if (error) {
          throw error
        }

        setMatches(data ?? [])
      } catch (err) {
        console.error('Error loading matches:', err)
        setError('No se pudieron cargar los partidos')
      } finally {
        setLoading(false)
      }
    }

    loadMatches()
  }, [])

  const handleOpenJoin = () => {
    setJoinError(null)
    setCode('')
    setJoinOpen(true)
  }

  const handleCloseJoin = () => {
    setJoinOpen(false)
    setJoinError(null)
  }

  const handleJoin = async (event: React.FormEvent) => {
    event.preventDefault()
    setJoinError(null)
    const trimmedCode = code.trim().toUpperCase()

    if (!trimmedCode) {
      setJoinError('Ingresa un código de partido')
      return
    }

    try {
      setJoinLoading(true)
      const { data, error } = await supabase
        .from('matches')
        .select('id')
        .eq('access_code', trimmedCode)
        .limit(1)

      if (error) {
        throw error
      }

      if (!data || data.length === 0) {
        setJoinError('Código inválido')
        return
      }

      router.push(`/registro?code=${encodeURIComponent(trimmedCode)}`)
    } catch (err) {
      console.error('Error validating code:', err)
      setJoinError('No se pudo validar el código')
    } finally {
      setJoinLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-yellow-400 font-black mb-2">Acceso por código</p>
            <h1 className="text-4xl font-black">Crear partido</h1>
            <p className="mt-3 text-gray-400 max-w-xl">
              Crea un partido con código de acceso, luego comparte el código para que otros se unan.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push('/create-match')}
              className="rounded-full bg-yellow-500 px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-black hover:bg-yellow-400 transition"
            >
              Crear partido
            </button>
            <button
              onClick={handleOpenJoin}
              className="rounded-full border border-gray-700 bg-transparent px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-white hover:border-yellow-500 hover:text-yellow-400 transition"
            >
              Unirse
            </button>
          </div>
        </header>

        {loading ? (
          <div className="rounded-3xl border border-gray-800 bg-gray-950/90 p-12 text-center text-gray-400">Cargando partidos...</div>
        ) : error ? (
          <div className="rounded-3xl border border-red-500 bg-red-500/10 p-8 text-center text-red-200">{error}</div>
        ) : (
          <div className="grid gap-4">
            {matches.length === 0 ? (
              <div className="rounded-3xl border border-gray-800 bg-gray-950/90 p-10 text-center text-gray-400">
                No hay partidos disponibles. Crea uno para empezar.
              </div>
            ) : (
              matches.map(match => (
                <article key={match.id} className="rounded-3xl border border-gray-800 bg-gray-950/90 p-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-black text-white">{match.nombre}</h2>
                      <p className="mt-2 text-gray-400">{match.fecha} · {match.hora}</p>
                    </div>
                    <button
                      onClick={handleOpenJoin}
                      className="rounded-full bg-yellow-500 px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-black hover:bg-yellow-400 transition"
                    >
                      Unirse
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>

      {joinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-3xl border border-gray-800 bg-gray-950 p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black">Unirse al partido</h3>
                <p className="text-sm text-gray-400">Ingresa el código de acceso para continuar.</p>
              </div>
              <button
                onClick={handleCloseJoin}
                className="rounded-full border border-gray-700 px-3 py-2 text-sm text-gray-200 hover:border-white"
              >
                Cerrar
              </button>
            </div>
            <form onSubmit={handleJoin} className="space-y-4">
              <label className="block text-sm font-bold uppercase tracking-[0.2em] text-gray-400">
                Código de acceso
                <input
                  value={code}
                  onChange={event => setCode(event.target.value)}
                  maxLength={10}
                  placeholder="ABC123"
                  className="mt-3 w-full rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3 text-white outline-none focus:border-yellow-500"
                />
              </label>
              {joinError && <p className="text-sm text-red-400">{joinError}</p>}
              <button
                type="submit"
                disabled={joinLoading}
                className="w-full rounded-2xl bg-yellow-500 px-4 py-3 text-sm font-black uppercase tracking-[0.2em] text-black hover:bg-yellow-400 disabled:opacity-50"
              >
                {joinLoading ? 'Validando...' : 'Unirse con código'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
