import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { notFound } from 'next/navigation'
import { PublicNavbar } from '@/components/public/navbar'
import { Podium } from '@/components/public/podium'
import { ScoreBar } from '@/components/public/score-bar'
import { HeroReveal } from '@/components/animated/hero-reveal'
import { BlurText } from '@/components/animated/blur-text'
import { FadeUp } from '@/components/animated/fade-up'
import { Heart } from 'lucide-react'
import type { Team } from '@/lib/types'

function rankColor(position: number | null) {
  if (position === null) return 'text-[#636363]'
  if (position === 1) return 'text-[#9810fa]'
  if (position === 2) return 'text-[#2debb1]'
  if (position === 3) return 'text-white/60'
  return 'text-[#636363]'
}

export default async function SlugResultadosPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const hackathon = await fetchQuery(api.hackathons.getBySlug, { slug })
  if (!hackathon) return notFound()

  const teams = await fetchQuery(api.hackathons.getTeamsRanked, { hackathonId: hackathon._id })
  const participants = await fetchQuery(api.hackathons.getParticipantsRanked, { hackathonId: hackathon._id })
  const voteCounts = await fetchQuery(api.hackathons.getVoteCounts, { hackathonId: hackathon._id })
  const topVoted = voteCounts.filter((v) => v.voteCount > 0).slice(0, 3)

  return (
    <>
      <PublicNavbar slug={slug} />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        {/* Header */}
        <div className="mb-16 text-center">
          <HeroReveal
            text="Resultados Finais"
            className="mb-4 text-5xl font-black leading-none tracking-tight text-white sm:text-7xl"
          />
          <BlurText
            text={`${hackathon.edition} · ${hackathon.date}`}
            className="justify-center text-sm font-semibold uppercase tracking-[0.2em] text-[#636363]"
            delay={0.04}
          />
        </div>

        {/* Podium */}
        <section className="mb-20">
          <FadeUp>
            <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#9810fa]">
              Pódio
            </p>
          </FadeUp>
          <Podium teams={teams as unknown as Team[]} />
        </section>

        {/* Teams Ranking */}
        <section className="mb-20">
          <FadeUp>
            <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#636363]">
              Ranking de Times
            </h2>
          </FadeUp>
          <div className="space-y-3">
            {teams.map((team, i) => (
              <FadeUp key={team._id} delay={i * 0.04}>
                <div className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-6 transition-colors hover:border-white/[0.15]">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <span className={`flex-shrink-0 font-black tabular-nums leading-none ${
                        team.position === 1 ? 'text-4xl text-[#9810fa]' :
                        team.position === 2 ? 'text-3xl text-[#2debb1]' :
                        team.position === 3 ? 'text-2xl text-white/60' :
                        'text-xl text-[#636363]'
                      }`}>{team.position}</span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                          <h3 className="text-lg font-black text-white leading-tight">{team.name}</h3>
                          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">
                            {team.project}
                          </span>
                        </div>
                        {team.description && (
                          <p className="mt-1.5 line-clamp-1 text-sm text-[#b2b2b2]">{team.description}</p>
                        )}
                        {team.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {team.tags.map(tag => (
                              <span
                                key={tag}
                                className="rounded border border-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#636363]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className={`font-black tabular-nums leading-none ${
                        team.position === 1 ? 'text-3xl' :
                        team.position === 2 ? 'text-2xl' :
                        'text-xl'
                      } ${rankColor(team.position ?? null)}`}>
                        {team.totalScore.toFixed(2)}
                      </div>
                      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">
                        pontuação total
                      </div>
                    </div>
                  </div>

                  {/* Score breakdown */}
                  <div className="mt-4 border-t border-white/[0.06] pt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                    {hackathon.criteria.map((criterion) => (
                      <ScoreBar
                        key={criterion}
                        label={criterion}
                        value={team.scores.find(s => s.criteriaKey === criterion)?.value ?? 0}
                      />
                    ))}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* Voto Popular */}
        {topVoted.length > 0 && (
          <section className="mb-20">
            <FadeUp>
              <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#636363]">
                Voto Popular
              </h2>
            </FadeUp>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {topVoted.map((entry, i) => (
                <FadeUp key={entry.teamId} delay={i * 0.06}>
                  <div className={`rounded-xl border p-6 ${
                    i === 0
                      ? 'border-[#9810fa]/30 bg-[#9810fa]/[0.06]'
                      : i === 1
                        ? 'border-[#2debb1]/20 bg-[#2debb1]/[0.04]'
                        : 'border-white/[0.08] bg-[#2a2a2b]'
                  }`}>
                    <div className="mb-3 flex items-center justify-between">
                      <span className={`text-3xl font-black tabular-nums ${
                        i === 0 ? 'text-[#9810fa]' : i === 1 ? 'text-[#2debb1]' : 'text-white/60'
                      }`}>
                        #{i + 1}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Heart className={`h-4 w-4 ${
                          i === 0 ? 'fill-[#9810fa]/30 text-[#9810fa]' : 'text-[#636363]'
                        }`} />
                        <span className="text-lg font-black tabular-nums text-white">
                          {entry.voteCount}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-black text-white">{entry.teamName}</h3>
                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">
                      {entry.project}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </section>
        )}

        {/* Individual Leaderboard */}
        <section>
          <FadeUp>
            <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#636363]">
              Leaderboard Individual
            </h2>
          </FadeUp>
          <FadeUp delay={0.08}>
            <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#2a2a2b]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th scope="col" className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">#</th>
                    <th scope="col" className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">Embaixador</th>
                    <th scope="col" className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">Time</th>
                    <th scope="col" className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">Presença</th>
                    <th scope="col" className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">Tasks</th>
                    <th scope="col" className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#636363]">Pontos</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p, i) => {
                    const team = teams.find(t => t._id === p.teamId)
                    return (
                      <tr
                        key={p._id}
                        className="border-b border-white/[0.06] transition-colors hover:bg-white/[0.06] last:border-0"
                      >
                        <td className="px-6 py-4 text-sm font-black tabular-nums">
                          <span className={rankColor(i + 1)}>{i + 1}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-white">{p.name}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#636363]">{team?.name ?? '—'}</td>
                        <td className="px-6 py-4 font-semibold tabular-nums text-white">
                          {p.metrics?.attendance ?? 0}%
                        </td>
                        <td className="px-6 py-4 text-[#b2b2b2]">{p.metrics?.tasksCompleted ?? 0}</td>
                        <td className="px-6 py-4 font-black tabular-nums text-white">
                          {p.metrics?.totalPoints ?? 0}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </FadeUp>
        </section>
      </main>
    </>
  )
}
