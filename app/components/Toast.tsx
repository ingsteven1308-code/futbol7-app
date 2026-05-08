'use client'
import { useEffect } from 'react'
import type { ToastItem } from '@/lib/types'

interface ContainerProps {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <Toast key={t.id} item={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

const STYLES: Record<ToastItem['type'], string> = {
  success: 'border-green-500 bg-green-950/95 text-green-300 shadow-green-900/40',
  error: 'border-red-500 bg-red-950/95 text-red-300 shadow-red-900/40',
  info: 'border-yellow-500 bg-yellow-950/95 text-yellow-300 shadow-yellow-900/40',
}

const ICONS: Record<ToastItem['type'], string> = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
}

function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(item.id), 3500)
    return () => clearTimeout(t)
  }, [item.id, onDismiss])

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg text-sm font-medium animate-toast-in ${STYLES[item.type]}`}
    >
      <span>{ICONS[item.type]}</span>
      <span className="flex-1">{item.message}</span>
      <button
        onClick={() => onDismiss(item.id)}
        className="opacity-50 hover:opacity-100 transition-opacity ml-1 text-base leading-none"
      >
        ✕
      </button>
    </div>
  )
}
