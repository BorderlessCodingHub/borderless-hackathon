export interface HackathonConfig {
  name: string
  edition: string
  date: string
  status: 'ongoing' | 'finished'
  criteria: string[]
}

export interface Team {
  id: string
  name: string
  project: string
  description: string
  members: string[]       // participant IDs
  scores: Record<string, number>  // criterion -> score 0-10
  totalScore: number
  position: number | null
  coverImage?: string
  tags?: string[]
  githubUrl?: string
  demoUrl?: string
  presentationUrl?: string
}

export interface Participant {
  id: string
  name: string
  avatar?: string
  teamId: string
  metrics: {
    tasksCompleted: number
    attendance: number    // 0-100
    contributions: number
    totalPoints: number
  }
}

export type ImportedTeamRow = {
  Nome: string
  Projeto: string
  Descricao: string
  Membros: string         // comma-separated participant names
  Demo?: string
  GitHub?: string
  Apresentacao?: string
}

export type ImportedParticipantRow = {
  Nome: string
  Time: string
  Tasks: number
  Presenca: number
  Contribuicoes: number
}

export type ScoringModel = 'placement' | 'jury'

export interface StaticTeamScore {
  criteriaKey: string
  value: number
}

export interface StaticTeam {
  id: string
  name: string
  project: string
  description: string
  tags: string[]
  position: number | null
  totalScore: number
  scores: StaticTeamScore[]
  members: string[]
  githubUrl?: string
  demoUrl?: string
  presentationUrl?: string
}

export interface StaticParticipant {
  id: string
  name: string
  teamId: string
  metrics: {
    tasksCompleted: number
    attendance: number
    contributions: number
    totalPoints: number
  }
}

export interface StaticHackathon {
  slug: string
  name: string
  edition: string
  date: string
  status: 'ongoing' | 'finished'
  githubPrefix: string
  scoringModel: ScoringModel
  scoringNote: string
  criteria: string[]
  teams: StaticTeam[]
  participants: StaticParticipant[]
}

export interface AnnualRankingEntry {
  position: number
  name: string
  hb01: number
  hb02: number
  hb03: number
  average: number
  total: number
}

export interface AnnualRanking {
  slug: string
  title: string
  scoringNote: string
  entries: AnnualRankingEntry[]
}
