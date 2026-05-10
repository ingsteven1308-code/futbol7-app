import type { Player } from './types'

export async function exportToExcel(players: Player[]): Promise<void> {
  const XLSX = await import('xlsx')

  const rows = players.map((p, i) => ({
    '#': i + 1,
    Nombre: p.fullName,
    Documento: p.documentNumber,
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  ws['!cols'] = [{ wch: 4 }, { wch: 32 }, { wch: 20 }, { wch: 18 }, { wch: 12 }]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Jugadores')
  XLSX.writeFile(wb, 'futbol_registro.xlsx')
}
