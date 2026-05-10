'use client'

import { useState, type FormEvent } from 'react'

interface Props {
  userEmail: string | null
  loading: boolean
  error: string | null
  onSignIn: (email: string, password: string) => Promise<boolean>
  onSignUp: (email: string, password: string) => Promise<boolean>
  onSignOut: () => Promise<boolean>
  onCreateMatch: (name: string) => Promise<any>
  onJoinMatch: (code: string) => Promise<any>
}

export function MatchAccess({
  userEmail,
  loading,
  error,
  onSignIn,
  onSignUp,
  onSignOut,
  onCreateMatch,
  onJoinMatch,
}: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [matchName, setMatchName] = useState('Partido de Supabase')
  const [accessCode, setAccessCode] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  const handleSignIn = async (event: FormEvent) => {
    event.preventDefault()
    setStatus(null)
    const success = await onSignIn(email, password)
    if (success) {
      setStatus('Sesión iniciada correctamente')
    }
  }

  const handleSignUp = async (event: FormEvent) => {
    event.preventDefault()
    setStatus(null)
    const success = await onSignUp(email, password)
    if (success) {
      setStatus('Cuenta creada, revisa tu correo para confirmar')
    }
  }

  const handleCreateMatch = async (event: FormEvent) => {
    event.preventDefault()
    setStatus(null)
    const result = await onCreateMatch(matchName)
    if (result) {
      setStatus('Partido creado correctamente')
    }
  }

  const handleJoinMatch = async (event: FormEvent) => {
    event.preventDefault()
    setStatus(null)
    const result = await onJoinMatch(accessCode)
    if (result) {
      setStatus('Te has unido al partido')
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl rounded-3xl border border-gray-800 bg-gray-950/95 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-yellow-400 font-black mb-3">Acceso al partido</p>
          <h1 className="text-3xl sm:text-4xl font-black">Inicia sesión y únete a tu partido</h1>
          <p className="mt-3 text-gray-400">Autenticación con Supabase + acceso por código para múltiple partido.</p>
        </div>

        {error && <div className="mb-4 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-200">{error}</div>}
        {status && <div className="mb-4 rounded-2xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-green-200">{status}</div>}

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-4 rounded-3xl border border-gray-800 bg-gray-900/80 p-5">
            <h2 className="text-lg font-black">Cuenta</h2>
            <form className="space-y-4" onSubmit={handleSignIn}>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Correo electrónico"
                className="w-full rounded-2xl border border-gray-800 bg-gray-950 px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Contraseña"
                className="w-full rounded-2xl border border-gray-800 bg-gray-950 px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="submit"
                  className="rounded-2xl bg-yellow-500 px-4 py-3 font-black text-black transition hover:bg-yellow-400"
                >
                  Iniciar sesión
                </button>
                <button
                  type="button"
                  onClick={handleSignUp}
                  className="rounded-2xl border border-gray-800 px-4 py-3 text-white transition hover:border-yellow-500"
                >
                  Crear cuenta
                </button>
              </div>
            </form>
            {userEmail && (
              <div className="pt-4 border-t border-gray-800 text-sm text-gray-400">
                Sesión activa como <span className="text-white">{userEmail}</span>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="ml-3 text-yellow-300 hover:text-white"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </section>

          <section className="space-y-4 rounded-3xl border border-gray-800 bg-gray-900/80 p-5">
            <h2 className="text-lg font-black">Partido</h2>
            <form className="space-y-4" onSubmit={handleCreateMatch}>
              <input
                type="text"
                value={matchName}
                onChange={(event) => setMatchName(event.target.value)}
                placeholder="Nombre del partido"
                className="w-full rounded-2xl border border-gray-800 bg-gray-950 px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
              />
              <button
                type="submit"
                className="w-full rounded-2xl bg-green-600 px-4 py-3 font-black text-white transition hover:bg-green-500"
              >
                Crear partido
              </button>
            </form>
            <form className="space-y-4" onSubmit={handleJoinMatch}>
              <input
                type="text"
                value={accessCode}
                onChange={(event) => setAccessCode(event.target.value.toUpperCase())}
                placeholder="Código de partido"
                className="w-full rounded-2xl border border-gray-800 bg-gray-950 px-4 py-3 text-white focus:outline-none focus:border-yellow-500"
              />
              <button
                type="submit"
                className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-black text-white transition hover:bg-blue-500"
              >
                Unirse con código
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}
