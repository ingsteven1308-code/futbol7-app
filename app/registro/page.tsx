import { Suspense } from 'react'
import RegistroClient from './RegistroClient'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080808] text-white flex items-center justify-center">Cargando registro...</div>}>
      <RegistroClient />
    </Suspense>
  )
}
