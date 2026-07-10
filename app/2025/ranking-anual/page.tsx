import { getAnnualRanking } from '@/lib/hackathon-data'
import { PublicNavbar } from '@/components/public/navbar'
import { ScoringNote } from '@/components/public/scoring-note'
import { HeroReveal } from '@/components/animated/hero-reveal'
import { FadeUp } from '@/components/animated/fade-up'

function rankColor(position: number) {
  if (position === 1) return 'text-[#9810fa]'
  if (position === 2) return 'text-[#2debb1]'
  if (position === 3) return 'text-white/60'
  return 'text-[#636363]'
}

export default function AnnualRankingPage() {
  const ranking = getAnnualRanking()

  return (
    <>
      <PublicNavbar />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        <div className="mb-10 text-center">
          <HeroReveal text={ranking.title} className="mb-4 text-4xl font-black text-white sm:text-6xl" />
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#636363]">Soma das 3 edições de 2025</p>
        </div>
        <ScoringNote note={ranking.scoringNote} className="mb-12" />
        <FadeUp>
          <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#2a2a2b]">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">#</th>
                  <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">Participante</th>
                  <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">HB01</th>
                  <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">HB02</th>
                  <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">HB03</th>
                  <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">Média</th>
                  <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">Total</th>
                </tr>
              </thead>
              <tbody>
                {ranking.entries.map((entry) => (
                  <tr key={entry.name} className="border-b border-white/[0.06] last:border-0">
                    <td className="px-4 py-4 font-black tabular-nums"><span className={rankColor(entry.position)}>{entry.position}</span></td>
                    <td className="px-4 py-4 font-semibold text-white">{entry.name}</td>
                    <td className="px-4 py-4 tabular-nums text-[#b2b2b2]">{entry.hb01}</td>
                    <td className="px-4 py-4 tabular-nums text-[#b2b2b2]">{entry.hb02}</td>
                    <td className="px-4 py-4 tabular-nums text-[#b2b2b2]">{entry.hb03}</td>
                    <td className="px-4 py-4 tabular-nums text-[#9a9a9a]">{entry.average.toFixed(2)}</td>
                    <td className="px-4 py-4 font-black tabular-nums text-white">{entry.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeUp>
      </main>
    </>
  )
}
