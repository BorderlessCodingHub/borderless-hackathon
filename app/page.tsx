import { listEditions } from '@/lib/hackathon-data'
import type { EditionListItem } from '@/lib/hackathon-data'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, BarChart3 } from 'lucide-react'

function editionCode(h: EditionListItem): string {
  const src = (h.githubPrefix || h.slug || h.edition || '').toUpperCase()
  const hb = src.match(/HB\s*0*(\d+)\D*(\d{4})/)
  if (hb) return `HB${hb[1].padStart(2, '0')}·${hb[2]}`
  return h.edition
}

export default function HomePage() {
  const editions = listEditions()
  const featured = editions[0]
  const editions2025 = editions.filter((e) => e.slug.endsWith('-2025'))

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-8">
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#636363]">Borderless · Hackathon</p>
        <h1 className="text-3xl font-black text-white">Edições</h1>
      </header>

      <section className="mb-12 rounded-2xl border border-white/[0.08] bg-[#2a2a2b] p-7 sm:p-9">
        <div className="mb-5 flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1">
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#9810fa]" />
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#b06bff]">Edição mais recente</span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7a7a7a] tabular-nums">{editionCode(featured)}</span>
        </div>
        <h2 className="text-3xl font-black text-white sm:text-4xl">{featured.name}</h2>
        <p className="mt-2 text-sm text-[#9a9a9a]">{featured.edition} · {featured.date}</p>
        <div className="mt-6">
          <span className="text-xl font-black tabular-nums text-white">{featured.teamCount}</span>
          <span className="ml-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a7a7a]">{featured.teamCount === 1 ? 'time' : 'times'}</span>
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={`/${featured.slug}`} className="inline-flex items-center gap-2 rounded-lg bg-[#9810fa] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#a835ff]">
            Entrar na edição <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href={`/${featured.slug}/resultados`} className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-[#9a9a9a] transition-colors hover:text-white">
            <BarChart3 className="h-4 w-4" /> Resultados
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#636363]">Temporada 2025</h2>
          <Link href="/2025/ranking-anual" className="text-xs font-semibold text-[#b06bff] hover:underline">Ranking anual 2025 →</Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {editions2025.map((ed) => (
            <Link key={ed.slug} href={`/${ed.slug}`} className="data-card group flex flex-col p-5 transition-colors hover:border-white/20">
              <span className="text-sm font-black uppercase tracking-[0.06em] text-[#9a9a9a] tabular-nums">{editionCode(ed)}</span>
              <h3 className="mt-4 font-bold text-white">{ed.edition}</h3>
              <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs text-[#7a7a7a]">
                <span className="tabular-nums">{ed.teamCount} times</span>
                <ArrowUpRight className="h-4 w-4 text-[#5a5a5a] transition-colors group-hover:text-white" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {featured.slug.endsWith('-2026') && (
        <section>
          <h2 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#636363]">Temporada 2026</h2>
          <Link href={`/${featured.slug}`} className="data-card group flex flex-col p-5 transition-colors hover:border-white/20">
            <span className="text-sm font-black uppercase tracking-[0.06em] text-[#9a9a9a] tabular-nums">{editionCode(featured)}</span>
            <h3 className="mt-4 font-bold text-white">{featured.edition}</h3>
            <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs text-[#7a7a7a]">
              <span className="tabular-nums">{featured.teamCount} times</span>
              <ArrowUpRight className="h-4 w-4 text-[#5a5a5a] transition-colors group-hover:text-white" />
            </div>
          </Link>
        </section>
      )}
    </main>
  )
}
