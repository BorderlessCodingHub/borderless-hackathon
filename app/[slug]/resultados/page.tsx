import { getHackathonBySlug, getParticipantsRanked, getTeamsRanked } from '@/lib/hackathon-data'
import { notFound } from 'next/navigation'
import { PublicNavbar } from '@/components/public/navbar'
import { Podium } from '@/components/public/podium'
import { ScoreBar } from '@/components/public/score-bar'
import { ScoringNote } from '@/components/public/scoring-note'
import { ProjectLink } from '@/components/public/project-link'
import { HeroReveal } from '@/components/animated/hero-reveal'
import { BlurText } from '@/components/animated/blur-text'
import { FadeUp } from '@/components/animated/fade-up'
import type { Team } from '@/lib/types'

function rankColor(position: number | null) {
  if (position === null) return 'text-[#636363]'
  if (position === 1) return 'text-[#9810fa]'
  if (position === 2) return 'text-[#2debb1]'
  if (position === 3) return 'text-white/60'
  return 'text-[#636363]'
}

function scoreLabel(model: 'placement' | 'jury') {
  return model === 'jury' ? 'média /10' : 'pontuação total'
}

function formatTotal(value: number, model: 'placement' | 'jury') {
  return model === 'jury' ? value.toFixed(2) : String(Math.round(value))
}

export default async function SlugResultadosPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const hackathon = getHackathonBySlug(slug)
  if (!hackathon) return notFound()

  const teams = getTeamsRanked(slug)
  const participants = getParticipantsRanked(slug)

  const podiumTeams: Team[] = teams.map((t) => ({
    id: t.id,
    name: t.name,
    project: t.project,
    description: t.description,
    members: t.members,
    scores: Object.fromEntries(t.scores.map((s) => [s.criteriaKey, s.value])),
    totalScore: t.totalScore,
    position: t.position,
    tags: t.tags,
  }))

  return (
    <>
      <PublicNavbar slug={slug} />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        <div className="mb-10 text-center">
          <HeroReveal text="Resultados Finais" className="mb-4 text-5xl font-black leading-none tracking-tight text-white sm:text-7xl" />
          <BlurText text={`${hackathon.edition} · ${hackathon.date}`} className="justify-center text-sm font-semibold uppercase tracking-[0.2em] text-[#636363]" delay={0.04} />
        </div>
        <ScoringNote note={hackathon.scoringNote} className="mb-16" />
        <section className="mb-20">
          <FadeUp><p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#9810fa]">Pódio</p></FadeUp>
          <Podium teams={podiumTeams} />
        </section>
        <section className="mb-20">
          <FadeUp><h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#636363]">Ranking de Times</h2></FadeUp>
          <div className="space-y-3">
            {teams.map((team, i) => (
              <FadeUp key={team.id} delay={i * 0.04}>
                <div className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-4">
                      <span className={`flex-shrink-0 font-black tabular-nums ${rankColor(team.position ?? null)}`}>{team.position}</span>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                        <h3 className="text-lg font-black text-white">{team.name}</h3>
                        <ProjectLink project={team.project} githubUrl={team.githubUrl} />
                      </div>
                      {team.description && (
                        <p className="text-sm leading-relaxed text-[#b2b2b2]">{team.description}</p>
                      )}
                    </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-black tabular-nums ${rankColor(team.position ?? null)}`}>{formatTotal(team.totalScore, hackathon.scoringModel)}</div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">{scoreLabel(hackathon.scoringModel)}</div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/[0.06] pt-4 sm:grid-cols-4">
                    {hackathon.criteria.map((criterion) => (
                      <ScoreBar key={criterion} label={criterion} value={team.scores.find((s) => s.criteriaKey === criterion)?.value ?? 0} />
                    ))}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>
        <section>
          <FadeUp><h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#636363]">Leaderboard Individual</h2></FadeUp>
          <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#2a2a2b]">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">#</th>
                  <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">Participante</th>
                  <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">Time</th>
                  <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">{hackathon.scoringModel === 'jury' ? 'Nota' : 'Pontos'}</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p, i) => {
                  const team = teams.find((t) => t.id === p.teamId)
                  return (
                    <tr key={p.id} className="border-b border-white/[0.06] last:border-0">
                      <td className="px-6 py-4 font-black tabular-nums"><span className={rankColor(i + 1)}>{i + 1}</span></td>
                      <td className="px-6 py-4 font-semibold text-white">{p.name}</td>
                      <td className="px-6 py-4 text-[#636363]">{team?.name ?? '—'}</td>
                      <td className="px-6 py-4 font-black tabular-nums text-white">{formatTotal(p.metrics.totalPoints, hackathon.scoringModel)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  )
}
