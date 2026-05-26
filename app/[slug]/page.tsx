import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { notFound } from 'next/navigation'
import { HeroSection } from '@/components/public/hero-section'
import { PublicNavbar } from '@/components/public/navbar'
import { FadeUp } from '@/components/animated/fade-up'
import { CountingNumber } from '@/components/animated/counting-number'

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const hackathon = await fetchQuery(api.hackathons.getBySlug, { slug })
  if (!hackathon) return notFound()

  const teams = await fetchQuery(api.hackathons.getTeamsRanked, { hackathonId: hackathon._id })
  const participants = await fetchQuery(api.hackathons.getParticipantsRanked, { hackathonId: hackathon._id })

  const topTeam = teams[0]
  const secondTeam = teams[1]
  const mvp = participants[0]

  return (
    <>
      <PublicNavbar slug={slug} />
      <main>
        <HeroSection
          slug={slug}
          name={hackathon.name}
          edition={hackathon.edition}
          date={hackathon.date}
          participantCount={participants.length}
          teamCount={teams.length}
          criteriaCount={hackathon.criteria.length}
        />

        {/* ── Highlights ─────────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <FadeUp>
            <div className="mb-2 flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#636363]">Destaques</span>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>
          </FadeUp>

          {/* 1st place */}
          <FadeUp delay={0.05}>
            <div className="group flex items-start justify-between gap-8 border-t border-white/[0.08] py-10 transition-colors hover:border-white/[0.16]">
              <div className="flex items-start gap-8">
                <span className="w-10 flex-shrink-0 text-sm font-black uppercase tracking-[0.2em] text-[#9810fa]">
                  01
                </span>
                <div>
                  <h3 className="text-4xl font-black leading-tight text-white sm:text-5xl">
                    {topTeam?.name}
                  </h3>
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">
                    {topTeam?.project}
                  </p>
                  {topTeam?.description && (
                    <p className="mt-2 max-w-lg text-sm text-[#b2b2b2]">{topTeam.description}</p>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-5xl font-black tabular-nums text-[#9810fa]">
                  <CountingNumber value={topTeam?.totalScore ?? 0} decimals={2} />
                </div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">
                  pontuação
                </div>
              </div>
            </div>
          </FadeUp>

          {/* 2nd place */}
          <FadeUp delay={0.1}>
            <div className="group flex items-start justify-between gap-8 border-t border-white/[0.08] py-8 transition-colors hover:border-white/[0.16]">
              <div className="flex items-start gap-8">
                <span className="w-10 flex-shrink-0 text-sm font-black uppercase tracking-[0.2em] text-[#2debb1]">
                  02
                </span>
                <div>
                  <h3 className="text-2xl font-black leading-tight text-white sm:text-3xl">
                    {secondTeam?.name}
                  </h3>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">
                    {secondTeam?.project}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-3xl font-black tabular-nums text-[#2debb1]">
                  <CountingNumber value={secondTeam?.totalScore ?? 0} decimals={2} />
                </div>
              </div>
            </div>
          </FadeUp>

          {/* MVP */}
          <FadeUp delay={0.15}>
            <div className="group flex items-start justify-between gap-8 border-t border-b border-white/[0.08] py-8 transition-colors hover:border-white/[0.16]">
              <div className="flex items-start gap-8">
                <span className="w-10 flex-shrink-0 text-sm font-black uppercase tracking-[0.2em] text-[#636363]">
                  MVP
                </span>
                <div>
                  <h3 className="text-2xl font-black leading-tight text-white sm:text-3xl">
                    {mvp?.name}
                  </h3>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">
                    Embaixador de maior destaque
                  </p>
                </div>
              </div>
              <div className="flex flex-shrink-0 items-start gap-8 text-right">
                <div>
                  <div className="text-3xl font-black tabular-nums text-[#9810fa]">
                    <CountingNumber value={mvp?.metrics?.totalPoints ?? 0} />
                  </div>
                  <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">
                    pontos
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black tabular-nums text-white">
                    <CountingNumber value={mvp?.metrics?.attendance ?? 0} />
                    <span className="text-xl">%</span>
                  </div>
                  <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">
                    presença
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </section>
      </main>
    </>
  )
}
