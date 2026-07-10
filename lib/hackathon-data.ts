import hb012025 from '@/data/hackathons/hb01-2025.json'
import hb022025 from '@/data/hackathons/hb02-2025.json'
import hb032025 from '@/data/hackathons/hb03-2025.json'
import hb012026 from '@/data/hackathons/hb01-2026.json'
import annual2025 from '@/data/hackathons/2025-ranking-anual.json'
import type {
  AnnualRanking,
  StaticHackathon,
  StaticParticipant,
  StaticTeam,
  ScoringModel,
} from '@/lib/types'

const HACKATHONS: StaticHackathon[] = [
  hb012025 as StaticHackathon,
  hb022025 as StaticHackathon,
  hb032025 as StaticHackathon,
  hb012026 as StaticHackathon,
]

const BY_SLUG = new Map(HACKATHONS.map((h) => [h.slug, h]))

export type EditionListItem = {
  slug: string
  name: string
  edition: string
  date: string
  status: StaticHackathon['status']
  githubPrefix: string
  teamCount: number
  scoringModel: StaticHackathon['scoringModel']
}

export function listEditions(): EditionListItem[] {
  return [...HACKATHONS]
    .sort((a, b) => {
      const yearA = parseInt(a.slug.slice(-4), 10)
      const yearB = parseInt(b.slug.slice(-4), 10)
      if (yearA !== yearB) return yearB - yearA
      const numA = parseInt(a.slug.match(/hb0?(\d+)/i)?.[1] ?? '0', 10)
      const numB = parseInt(b.slug.match(/hb0?(\d+)/i)?.[1] ?? '0', 10)
      return numB - numA
    })
    .map((h) => ({
      slug: h.slug,
      name: h.name,
      edition: h.edition,
      date: h.date,
      status: h.status,
      githubPrefix: h.githubPrefix,
      teamCount: h.teams.length,
      scoringModel: h.scoringModel,
    }))
}

export function getHackathonBySlug(slug: string): StaticHackathon | null {
  return BY_SLUG.get(slug) ?? null
}

export function getTeamsRanked(slug: string): StaticTeam[] {
  const h = getHackathonBySlug(slug)
  if (!h) return []
  return [...h.teams].sort((a, b) => {
    const posA = a.position ?? 999
    const posB = b.position ?? 999
    if (posA !== posB) return posA - posB
    return b.totalScore - a.totalScore
  })
}

export function getParticipantsRanked(slug: string): StaticParticipant[] {
  const h = getHackathonBySlug(slug)
  if (!h) return []
  return [...h.participants].sort(
    (a, b) => b.metrics.totalPoints - a.metrics.totalPoints,
  )
}

export type TeamWithMembers = Omit<StaticTeam, 'members'> & {
  members: StaticParticipant[]
}

export function getTeam(slug: string, teamId: string): TeamWithMembers | null {
  const h = getHackathonBySlug(slug)
  if (!h) return null
  const team = h.teams.find((t) => t.id === teamId)
  if (!team) return null
  const members = h.participants.filter((p) => team.members.includes(p.id))
  return { ...team, members }
}

export function getAnnualRanking(): AnnualRanking {
  return annual2025 as AnnualRanking
}

export function getAllPublicSlugs(): string[] {
  return HACKATHONS.map((h) => h.slug)
}

export type TeamListItem = StaticTeam & { memberNames: string[] }

export function getTeamsWithMemberNames(slug: string): TeamListItem[] {
  const h = getHackathonBySlug(slug)
  if (!h) return []
  return getTeamsRanked(slug).map((team) => ({
    ...team,
    memberNames: team.members
      .map((id) => h.participants.find((p) => p.id === id)?.name ?? '')
      .filter(Boolean),
  }))
}

export function formatScore(value: number, model: ScoringModel): string {
  if (model === 'jury') return `${value.toFixed(2)}/10`
  return String(Math.round(value))
}

