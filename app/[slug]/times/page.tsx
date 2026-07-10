import { getHackathonBySlug, getTeamsWithMemberNames } from '@/lib/hackathon-data'
import { notFound } from 'next/navigation'
import { PublicNavbar } from '@/components/public/navbar'
import { ProjectLink } from '@/components/public/project-link'
import { HeroReveal } from '@/components/animated/hero-reveal'
import { BlurText } from '@/components/animated/blur-text'
import { FadeUp } from '@/components/animated/fade-up'
import Link from 'next/link'
import { Users, ArrowRight, Github } from 'lucide-react'

function rankColor(position: number | null) {
  if (position === 1) return 'text-[#9810fa]'
  if (position === 2) return 'text-[#2debb1]'
  if (position === 3) return 'text-white/60'
  return 'text-[#636363]'
}

export default async function SlugTimesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const hackathon = getHackathonBySlug(slug)
  if (!hackathon) return notFound()
  const teams = getTeamsWithMemberNames(slug)
  const isJury = hackathon.scoringModel === 'jury'

  return (
    <>
      <PublicNavbar slug={slug} />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        <div className="mb-16 text-center">
          <HeroReveal text="Times" className="mb-4 text-5xl font-black text-white sm:text-7xl" />
          <BlurText
            text={`${hackathon.edition} · ${hackathon.date}`}
            className="mb-3 justify-center text-sm font-semibold uppercase tracking-[0.2em] text-[#636363]"
            delay={0.04}
          />
          <BlurText text="Todos os times participantes" className="justify-center text-sm font-semibold uppercase tracking-[0.2em] text-[#636363]" delay={0.06} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {teams.map((team, i) => (
            <FadeUp key={team.id} delay={i * 0.05}>
              <div className="group flex h-full flex-col rounded-xl border border-white/[0.08] bg-[#2a2a2b] transition-colors hover:border-white/[0.15]">
                <Link href={`/${slug}/times/${team.id}`} className="block flex-1 p-6 pb-4">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      {team.position && <div className={`mb-2 text-[10px] font-black uppercase tracking-[0.15em] ${rankColor(team.position)}`}>#{team.position} no ranking</div>}
                      <h3 className="text-xl font-black text-white">{team.name}</h3>
                      <p className="mt-0.5">
                        <ProjectLink project={team.project} githubUrl={team.githubUrl} linked={false} />
                      </p>
                      {team.description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#b2b2b2]">{team.description}</p>
                      )}
                    </div>
                    <div className={`text-2xl font-extrabold tabular-nums ${rankColor(team.position ?? null)}`}>
                      {isJury ? team.totalScore.toFixed(2) : Math.round(team.totalScore)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-[#636363]">
                    <Users className="h-3.5 w-3.5" />
                    <span className="line-clamp-1">{team.memberNames.join(', ')}</span>
                  </div>
                </Link>
                <div className="flex items-center justify-between border-t border-white/[0.06] px-6 py-4">
                  {team.githubUrl ? (
                    <a href={team.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#636363] hover:text-white" aria-label={`Repositório de ${team.project}`}>
                      <Github className="h-3.5 w-3.5" />
                      Repositório
                    </a>
                  ) : (
                    <span />
                  )}
                  <Link href={`/${slug}/times/${team.id}`} className="text-[#636363] transition-colors hover:text-white" aria-label={`Ver detalhes de ${team.name}`}>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </main>
    </>
  )
}
