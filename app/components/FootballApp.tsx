'use client'
import { useState, useCallback } from 'react'
import type { Player, PlayerSubmitData, PlayerUpdateData } from '@/lib/types'
import { usePlayers } from '@/hooks/usePlayers'
import { useToast } from '@/hooks/useToast'
import { buildAdminWhatsAppUrl } from '@/lib/whatsapp'
import { exportToExcel } from '@/lib/excel'
import { PlayerForm } from './PlayerForm'
import { TeamSection } from './TeamSection'
import { ToastContainer } from './Toast'
import { RestartMatchModal } from './RestartMatchModal'

type ModalState =
  | { open: false }
  | { open: true; mode: 'edit'; player: Player }

export function FootballApp() {
  const { players, whiteTeam, blackTeam, addPlayer, updatePlayer, removePlayer, clearAllPlayers, loaded, isLoading } =
    usePlayers()
  const { toasts, toast, dismiss } = useToast()
  const [modal, setModal] = useState<ModalState>({ open: false })
  const [exporting, setExporting] = useState(false)
  const [restartModalOpen, setRestartModalOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)

  const handleAdd = useCallback(
    async (data: PlayerSubmitData) => {
      const newPlayer = await addPlayer(data)
      if (newPlayer) {
        toast(`✅ ${newPlayer.fullName} registrado en Equipo ${newPlayer.team}`, 'success')
        setFormKey(k => k + 1)
      }
    },
    [addPlayer, toast],
  )

  const handleNotifyAdmin = useCallback(() => {
    if (players.length === 0) {
      toast('No hay jugadores registrados para notificar', 'error')
      return
    }

    const url = buildAdminWhatsAppUrl(players)
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [players, toast])

  const handleEdit = useCallback((player: Player) => {
    setModal({ open: true, mode: 'edit', player })
  }, [])

  const handleUpdate = useCallback(
    async (data: PlayerSubmitData) => {
      if (!modal.open) return
      const updated: PlayerUpdateData = {
        ...data,
        id: (modal as { open: true; mode: 'edit'; player: Player }).player.id,
        createdAt: (modal as { open: true; mode: 'edit'; player: Player }).player.createdAt,
      }
      const success = await updatePlayer(updated)
      if (success) {
        toast(`✏️ ${updated.fullName} actualizado`, 'info')
        setModal({ open: false })
      }
    },
    [modal, updatePlayer, toast],
  )

  const handleDelete = useCallback(
    async (id: string) => {
      const player = players.find(p => p.id === id)
      const success = await removePlayer(id)
      if (success) {
        toast(`🗑️ ${player?.fullName ?? 'Jugador'} eliminado`, 'error')
      }
    },
    [players, removePlayer, toast],
  )

  const handleRestart = useCallback(async () => {
    const success = await clearAllPlayers()
    if (success) {
      setRestartModalOpen(false)
      toast('🔄 Partido reiniciado correctamente', 'success')
    }
  }, [clearAllPlayers, toast])

  const handleExport = useCallback(async () => {
    if (players.length === 0) {
      toast('No hay jugadores registrados aún', 'error')
      return
    }
    setExporting(true)
    try {
      await exportToExcel(players)
      toast(`📊 Registro descargado (${players.length} jugadores)`, 'success')
    } catch {
      toast('Error al generar el archivo', 'error')
    } finally {
      setExporting(false)
    }
  }, [players, toast])

  const editingPlayer =
    modal.open && modal.mode === 'edit' ? modal.player : undefined

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      <RestartMatchModal
        open={restartModalOpen}
        onConfirm={handleRestart}
        onCancel={() => setRestartModalOpen(false)}
        playerCount={players.length}
      />

      {/* Edit modal */}
      {modal.open && editingPlayer && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={e => {
            if (e.target === e.currentTarget) setModal({ open: false })
          }}
        >
          <div className="w-full max-w-md bg-gray-950 border border-gray-800 rounded-2xl p-6 shadow-2xl animate-modal-in">
            <h2 className="text-xl font-black text-yellow-400 mb-5 flex items-center gap-2">
              ✏️ Editar Jugador
            </h2>
            <PlayerForm
              initial={editingPlayer}
              onSubmit={handleUpdate}
              onCancel={() => setModal({ open: false })}
              isEditing
            />
          </div>
        </div>
      )}

      {/* Hero header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/8 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 py-10 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-1.5 mb-4">
            <span className="text-yellow-400 text-xs font-bold tracking-widest uppercase">
              Organiza tu partido
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black uppercase tracking-tight">
            <span className="text-white">FÚTBOL</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              7
            </span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Registra jugadores · Forma equipos · Juega
          </p>

          {/* Global counters */}
          {loaded && (
            <div className="flex justify-center gap-6 mt-6">
              <Stat label="Total" value={players.length} color="text-white" />
              <Stat label="Blanco" value={whiteTeam.length} color="text-gray-300" />
              <Stat label="Negro" value={blackTeam.length} color="text-yellow-400" />
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-16 space-y-8">
        {/* Registration card */}
        <section className="bg-gray-950 border border-gray-800/80 rounded-2xl p-6 shadow-xl">
          <h2 className="text-base font-black text-white uppercase tracking-wider mb-5 flex items-center gap-2">
            <span className="text-yellow-400">⚽</span> Registrar Jugador
          </h2>
          <PlayerForm key={formKey} onSubmit={handleAdd} />
        </section>

        {/* Actions bar */}
        {loaded && players.length > 0 && (
          <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 bg-gray-950/60 border border-gray-800/50 rounded-xl px-5 py-3">
            <p className="text-sm text-gray-400 self-center">
              <span className="text-white font-bold">{players.length}</span> jugadores registrados
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full xl:w-auto">
              <button
                onClick={handleExport}
                disabled={exporting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-colors"
              >
                {exporting ? '⏳ Generando...' : '📊 Exportar Excel'}
              </button>
              <button
                onClick={handleNotifyAdmin}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors"
              >
                📣 Notificar al Administrador
              </button>
              <button
                onClick={() => setRestartModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-colors"
              >
                🔄 Reiniciar Partido
              </button>
            </div>
          </div>
        )}

        {/* Teams */}
        {loaded && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TeamSection
              team="Blanco"
              players={whiteTeam}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <TeamSection
              team="Negro"
              players={blackTeam}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}

        {!loaded && (
          <div className="text-center py-20 text-gray-700">
            <div className="text-4xl animate-spin inline-block">⚽</div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-900 text-center py-6 text-gray-700 text-xs">
        Fútbol 7 App · Hecho con ⚽ y Next.js + Supabase
      </footer>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className={`text-2xl font-black ${color}`}>{value}</span>
      <span className="text-gray-600 text-[10px] uppercase tracking-widest">{label}</span>
    </div>
  )
}
