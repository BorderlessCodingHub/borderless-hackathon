import { getHackathonBySlug, getParticipantsRanked, getTeamsRanked } from '@/lib/hackathon-data'
import { notFound } from 'next/navigation'
import { HeroSection } from '@/components/public/hero-section'
import { PublicNavbar } from '@/components/public/navbar'
import { ScoringNote } from '@/components/public/scoring-note'
import { ProjectLink } from '@/components/public/project-link'
import { FadeUp } from '@/components/animated/fade-up'
import { CountingNumber } from '@/components/animated/counting-number'

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const hackathon = getHackathonBySlug(slug)
  if (!hackathon) return notFound()

  const teams = getTeamsRanked(slug)
  const participants = getParticipantsRanked(slug)
  const topTeam = teams[0]
  const secondTeam = teams[1]
  const mvp = participants[0]
  const isJury = hackathon.scoringModel === 'jury'

  return (
    <>
      <PublicNavbar slug={slug} />
      <main>
        <HeroSection slug={slug} name={hackathon.name} edition={hackathon.edition} date={hackathon.date} participantCount={participants.length} teamCount={teams.length} criteriaCount={hackathon.criteria.length} />

        <div className="relative z-10 border-t border-white/[0.06] bg-[#222]">
          <section className="mx-auto max-w-3xl px-6 py-14">
            <ScoringNote note={hackathon.scoringNote} />
          </section>
        </div>

        <section className="mx-auto max-w-7xl px-6 pb-16 pt-4">
          <FadeUp>
            <div className="mb-2 flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#636363]">Destaques</span>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>
          </FadeUp>
          <FadeUp delay={0.05}>
            <div className="flex flex-col gap-4 border-t border-white/[0.08] py-10 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4 sm:gap-8">
                <span className="w-7 flex-shrink-0 text-sm font-black uppercase tracking-[0.2em] text-[#9810fa] sm:w-10">01</span>
                <div>
                  <h3 className="text-3xl font-black text-white sm:text-5xl">{topTeam?.name}</h3>
                  <p className="mt-2">
                    <ProjectLink project={topTeam?.project ?? '—'} githubUrl={topTeam?.githubUrl} />
                  </p>
                </div>
              </div>
              <div className="pl-11 sm:pl-0 sm:text-right">
                <div className="text-4xl font-black tabular-nums text-[#9810fa] sm:text-5xl">
                  <CountingNumber value={topTeam?.totalScore ?? 0} decimals={isJury ? 2 : 0} />
                  {isJury && <span className="text-xl text-[#636363]">/10</span>}
                </div>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="flex flex-col gap-3 border-t border-white/[0.08] py-8 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4 sm:gap-8">
                <span className="w-7 flex-shrink-0 text-sm font-black uppercase tracking-[0.2em] text-[#2debb1] sm:w-10">02</span>
                <div>
                  <h3 className="text-2xl font-black text-white sm:text-3xl">{secondTeam?.name}</h3>
                  <p className="mt-1">
                    <ProjectLink project={secondTeam?.project ?? '—'} githubUrl={secondTeam?.githubUrl} />
                  </p>
                </div>
              </div>
              <div className="pl-11 sm:pl-0 sm:text-right">
                <div className="text-3xl font-black tabular-nums text-[#2debb1]">
                  <CountingNumber value={secondTeam?.totalScore ?? 0} decimals={isJury ? 2 : 0} />
                </div>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="flex flex-col gap-3 border-t border-b border-white/[0.08] py-8 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4 sm:gap-8">
                <span className="w-7 flex-shrink-0 text-sm font-black uppercase tracking-[0.2em] text-[#636363] sm:w-10">MVP</span>
                <div>
                  <h3 className="text-2xl font-black text-white sm:text-3xl">{mvp?.name}</h3>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">Participante de maior destaque</p>
                </div>
              </div>
              <div className="pl-11 sm:pl-0 sm:text-right">
                <div className="text-3xl font-black tabular-nums text-[#9810fa]">
                  <CountingNumber value={mvp?.metrics?.totalPoints ?? 0} decimals={isJury ? 2 : 0} />
                </div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">{isJury ? 'nota do time' : 'pontos'}</div>
              </div>
            </div>
          </FadeUp>
        </section>
      </main>
    </>
  )
}
