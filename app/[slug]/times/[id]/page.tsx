import { getHackathonBySlug, getTeam } from '@/lib/hackathon-data'
import { notFound } from 'next/navigation'
import { PublicNavbar } from '@/components/public/navbar'
import { ScoreBar } from '@/components/public/score-bar'
import { ProjectLink } from '@/components/public/project-link'
import { ArrowLeft, Users, Github } from 'lucide-react'
import Link from 'next/link'

function rankTextClass(position: number) {
  if (position === 1) return 'text-[#9810fa]'
  if (position === 2) return 'text-[#2debb1]'
  if (position === 3) return 'text-white/60'
  return 'text-[#636363]'
}

const linkCls =
  'inline-flex items-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-[#9810fa]/50 hover:bg-[#9810fa]/10'

export default async function SlugTeamDetailPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params
  const hackathon = getHackathonBySlug(slug)
  if (!hackathon) return notFound()
  const team = getTeam(slug, id)
  if (!team) return notFound()
  const pos = team.position ?? 4
  const isJury = hackathon.scoringModel === 'jury'

  return (
    <>
      <PublicNavbar slug={slug} />
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-32">
        <Link href={`/${slug}/times`} className="mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#636363] hover:text-white">
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar para times
        </Link>
        <div className="mb-8 rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              {team.position && <div className={`mb-2 text-[10px] font-black uppercase tracking-[0.15em] ${rankTextClass(pos)}`}>#{team.position} lugar</div>}
              <h1 className="mb-1 text-2xl font-extrabold text-white sm:text-3xl">{team.name}</h1>
              <div className="mb-4">
                <ProjectLink project={team.project} githubUrl={team.githubUrl} />
              </div>
              {team.description && (
                <p className="max-w-xl text-sm leading-relaxed text-[#b2b2b2]">{team.description}</p>
              )}
            </div>
            <div className="text-left sm:text-right">
              <div className={`text-4xl font-black ${rankTextClass(pos)}`}>{isJury ? team.totalScore.toFixed(2) : Math.round(team.totalScore)}</div>
              <div className="text-sm text-[#636363]">{isJury ? 'média final' : 'pontuação final'}</div>
            </div>
          </div>
          {team.githubUrl && (
            <div className="mt-6 flex flex-wrap gap-3 border-t border-white/[0.06] pt-6">
              <a href={team.githubUrl} target="_blank" rel="noopener noreferrer" className={linkCls}>
                <Github className="h-4 w-4" />
                Repositório
              </a>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-6">
            <h2 className="mb-6 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">Critérios de Avaliação</h2>
            <div className="space-y-4">
              {hackathon.criteria.map((criterion) => (
                <ScoreBar key={criterion} label={criterion} value={team.scores.find((s) => s.criteriaKey === criterion)?.value ?? 0} />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-[#2a2a2b] p-6">
            <h2 className="mb-6 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#636363]">
              <Users className="h-3.5 w-3.5" /> Membros ({team.members.length})
            </h2>
            {team.members.map((member) => (
              <div key={member.id} className="flex items-center justify-between border-b border-white/[0.06] py-3 last:border-0">
                <div className="font-semibold text-white">{member.name}</div>
                <div className="font-black tabular-nums text-white">{isJury ? member.metrics.totalPoints.toFixed(2) : Math.round(member.metrics.totalPoints)}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
