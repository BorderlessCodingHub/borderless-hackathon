import { AdminGuard } from './admin-guard'
import type { ReactNode } from 'react'

export function AdminLayout({ children: _children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="max-w-lg rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-8 text-center">
          <p className="mb-2 text-lg font-bold text-white">Modo estático</p>
          <p className="text-sm leading-relaxed text-[#9a9a9a]">
            Os dados dos hackathons são servidos via JSON no deploy. O painel admin está temporariamente indisponível.
          </p>
        </div>
      </div>
    </AdminGuard>
  )
}
