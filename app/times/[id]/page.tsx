import { PublicNavbar } from '@/components/public/navbar'
import { ScoreBar } from '@/components/public/score-bar'
import { getTeamById, getTeamParticipants, hackathonConfig } from '@/lib/mock-data'
import { notFound } from 'next/navigation'
import { ArrowLeft, Users } from 'lucide-react'
import Link from 'next/link'

function rankTextClass(position: number) {
  if (position === 1) return 'text-[#9810fa]'
  if (position === 2) return 'text-[#2debb1]'
  if (position === 3) return 'text-white/60'
  return 'text-[#636363]'
}

export default async function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const team = getTeamById(id)
  if (!team) return notFound()

  const members = getTeamParticipants(team.id)
  const pos = team.position ?? 4

  return (
    <>
      <PublicNavbar />
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-32">
        <Link
          href="/times"
          className="mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#636363] transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar para times
        </Link>

        {/* Header */}
        <div className="mb-8 rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              {team.position && (
                <div className={`mb-2 text-[10px] font-black uppercase tracking-[0.15em] ${rankTextClass(pos)}`}>
                  #{team.position} lugar
                </div>
              )}
              <h1 className="mb-1 text-3xl font-extrabold text-white">{team.name}</h1>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">{team.project}</p>
              <p className="mb-4 text-[#b2b2b2]">{team.description}</p>
              <div className="flex flex-wrap gap-1">
                {team.tags?.map(tag => (
                  <span key={tag} className="rounded border border-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#636363]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-black ${rankTextClass(pos)}`}>
                {team.totalScore.toFixed(2)}
              </div>
              <div className="text-sm text-[#636363]">pontuação final</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Scores */}
          <div className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-6">
            <h2 className="mb-6 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">Critérios de Avaliação</h2>
            <div className="space-y-4">
              {hackathonConfig.criteria.map((criterion) => (
                <ScoreBar
                  key={criterion}
                  label={criterion}
                  value={team.scores[criterion] ?? 0}
                />
              ))}
            </div>
          </div>

          {/* Members */}
          <div className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-6">
            <h2 className="mb-6 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">
              <Users className="h-3.5 w-3.5" />
              Membros ({members.length})
            </h2>
            <div>
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between border-b border-white/[0.06] py-3 last:border-0">
                  <div>
                    <div className="font-semibold text-white">{member.name}</div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#636363]">
                      {member.metrics?.tasksCompleted ?? 0} tasks · {member.metrics?.attendance ?? 0}% presença
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black tabular-nums text-white">{member.metrics?.totalPoints ?? 0}</div>
                    <div className="text-xs text-[#636363]">pts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
