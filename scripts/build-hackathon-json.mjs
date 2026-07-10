#!/usr/bin/env node
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'


const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'data', 'hackathons')
const SOURCE_2025 = path.join(ROOT, 'data', 'source', '2025-editions.json')
const TEAM_ENRICHMENT = path.join(ROOT, 'data', 'source', 'team-enrichment.json')


const SCORING_NOTE_PLACEMENT = 'Pontuação por colocação do time na edição (1º = 100 pts, 2º = 75 pts, etc.). O ranking individual soma os pontos de cada participante dentro da edição.'
const SCORING_NOTE_JURY = 'Média aritmética das notas de 3 juízes — André Wlodkovski, Yuri e Caique Ribeiro (0–10) — em 4 critérios: Clean Code, Estrutura, UI e Inovação (foco em IA). A nota do time é a média final; cada membro recebe a mesma pontuação do time.'
const SCORING_NOTE_ANNUAL = 'Soma das pontuações das 3 edições de 2025. Participantes que não competiram em uma edição recebem 0 naquela coluna.'

const EDITION_META = {
  'hb01-2025': { edition: '2025 — 1ª Edição', date: 'Março de 2025', githubPrefix: 'HB01-2025' },
  'hb02-2025': { edition: '2025 — 2ª Edição', date: 'Maio de 2025', githubPrefix: 'HB02-2025' },
  'hb03-2025': { edition: '2025 — 3ª Edição', date: 'Outubro de 2025', githubPrefix: 'HB03-2025' },
}

const JURY_CRITERIA = ['Clean Code', 'Estrutura', 'UI', 'Inovação']

const TEAM_2026_META = {
  'time 1': { position: 2, name: 'Team 01', project: 'Hone', totalScore: 8.65, scores: { 'Clean Code': 9.23, Estrutura: 9.0, UI: 8.77, Inovação: 7.6 } },
  'time 2': { position: 6, name: 'Team 02', project: 'The Mirror', totalScore: 8.16, scores: { 'Clean Code': 8.63, Estrutura: 8.17, UI: 7.67, Inovação: 8.17 } },
  'time 3': { position: 5, name: 'Team 03', project: 'GitReview', totalScore: 8.29, scores: { 'Clean Code': 8.8, Estrutura: 8.17, UI: 7.9, Inovação: 8.3 } },
  'time 4': { position: 3, name: 'Team 04', project: 'Career Forge', totalScore: 8.57, scores: { 'Clean Code': 8.67, Estrutura: 8.67, UI: 8.17, Inovação: 8.77 } },
  'time 5': { position: 4, name: 'Team 05', project: 'CareerSync', totalScore: 8.44, scores: { 'Clean Code': 8.93, Estrutura: 8.57, UI: 8.33, Inovação: 7.93 } },
  'time 6': { position: 1, name: 'Team 06', project: 'socratic.dev', totalScore: 9.1, scores: { 'Clean Code': 8.97, Estrutura: 8.67, UI: 9.37, Inovação: 9.4 } },
}

function teamSortKey(name) { return parseInt(String(name).replace(/\D/g, ''), 10) || 0 }
function teamIdFromName(name) { return `time-${teamSortKey(name)}` }

function buildPlacementEdition(edition) {
  const meta = EDITION_META[edition.slug]
  const teamMap = new Map()
  for (const p of edition.participants) {
    const tid = teamIdFromName(p.team)
    if (!teamMap.has(tid)) teamMap.set(tid, { id: tid, name: p.team, members: [], teamPoints: p.points })
    teamMap.get(tid).members.push(p)
    teamMap.get(tid).teamPoints = Math.max(teamMap.get(tid).teamPoints, p.points)
  }
  const teamsUnranked = [...teamMap.values()].sort((a, b) => b.teamPoints - a.teamPoints || teamSortKey(a.name) - teamSortKey(b.name))
  let lastScore = null, position = 0
  const teams = teamsUnranked.map((t, i) => {
    if (t.teamPoints !== lastScore) { position = i + 1; lastScore = t.teamPoints }
    return { id: t.id, name: t.name, project: '—', description: '', tags: [], position: t.teamPoints > 0 ? position : null, totalScore: t.teamPoints, scores: [{ criteriaKey: 'Pontuação', value: t.teamPoints }], memberIds: [] }
  })
  const teamById = Object.fromEntries(teams.map((t) => [t.id, t]))
  const participants = edition.participants.map((p, i) => {
    const tid = teamIdFromName(p.team)
    const pid = `p-${i + 1}`
    teamById[tid].memberIds.push(pid)
    return { id: pid, name: p.name, teamId: tid, metrics: { tasksCompleted: 0, attendance: 0, contributions: p.points, totalPoints: p.points } }
  })
  for (const t of teams) { t.members = t.memberIds; delete t.memberIds }
  return { slug: edition.slug, name: 'Borderless Hackathon', edition: meta.edition, date: meta.date, status: 'finished', githubPrefix: meta.githubPrefix, scoringModel: 'placement', scoringNote: SCORING_NOTE_PLACEMENT, criteria: ['Pontuação'], teams, participants }
}

function read2026Participants() {
  const raw = fs.readFileSync(path.join(ROOT, "data", "source", "2026-participants.json"), "utf8")
  return JSON.parse(raw)
}

function buildJuryEdition() {
  const rows = read2026Participants()
  const teamMap = new Map()
  for (const p of rows) { if (!teamMap.has(p.team)) teamMap.set(p.team, []); teamMap.get(p.team).push(p) }
  const teams = [...teamMap.keys()].sort((a, b) => teamSortKey(a) - teamSortKey(b)).map((excelTeam) => {
    const meta = TEAM_2026_META[excelTeam]
    const tid = teamIdFromName(excelTeam)
    return { id: tid, name: meta.name, project: meta.project, description: '', tags: [], position: meta.position, totalScore: meta.totalScore, scores: JURY_CRITERIA.map((c) => ({ criteriaKey: c, value: meta.scores[c] })), memberIds: [] }
  })
  const teamById = Object.fromEntries(teams.map((t) => [t.id, t]))
  const participants = rows.map((p, i) => {
    const tid = teamIdFromName(p.team)
    const meta = TEAM_2026_META[p.team]
    const pid = `p-${i + 1}`
    teamById[tid].memberIds.push(pid)
    return { id: pid, name: p.name, teamId: tid, metrics: { tasksCompleted: 0, attendance: 0, contributions: 0, totalPoints: meta.totalScore } }
  })
  for (const t of teams) { t.members = t.memberIds; delete t.memberIds }
  teams.sort((a, b) => (a.position ?? 99) - (b.position ?? 99))
  return { slug: 'hb01-2026', name: 'Borderless Hackathon', edition: '2026 — 1ª Edição', date: '18 de junho de 2026', status: 'finished', githubPrefix: 'HB01-2026', scoringModel: 'jury', scoringNote: SCORING_NOTE_JURY, criteria: JURY_CRITERIA, teams, participants }
}

function buildAnnualRanking(source) {
  return { slug: '2025-ranking-anual', title: 'Ranking Anual 2025', scoringNote: SCORING_NOTE_ANNUAL, entries: source.annualLeaderboard.map((r, i) => ({ position: i + 1, name: r.name, hb01: r.h1 ?? 0, hb02: r.h2 ?? 0, hb03: r.h3 ?? 0, average: r.average, total: r.total })) }
}

function applyTeamEnrichment(hackathon, enrichment) {
  const editionEnrichment = enrichment[hackathon.slug]
  if (!editionEnrichment) return hackathon
  if (editionEnrichment.criteria) hackathon.criteria = editionEnrichment.criteria
  if (editionEnrichment.scoringNote) hackathon.scoringNote = editionEnrichment.scoringNote
  for (const team of hackathon.teams) {
    const extra = editionEnrichment[team.id]
    if (!extra) continue
    if (extra.project) team.project = extra.project
    if (extra.description) team.description = extra.description
    if (extra.githubUrl) team.githubUrl = extra.githubUrl
    if (extra.presentationUrl) team.presentationUrl = extra.presentationUrl
    if (extra.scores) team.scores = extra.scores
  }
  return hackathon
}

const source = JSON.parse(fs.readFileSync(SOURCE_2025, 'utf8'))
const enrichment = fs.existsSync(TEAM_ENRICHMENT)
  ? JSON.parse(fs.readFileSync(TEAM_ENRICHMENT, 'utf8'))
  : {}
fs.mkdirSync(OUT_DIR, { recursive: true })
for (const edition of source.editions) {
  const data = applyTeamEnrichment(buildPlacementEdition(edition), enrichment)
  fs.writeFileSync(path.join(OUT_DIR, `${edition.slug}.json`), JSON.stringify(data, null, 2) + '\n')
  console.log(`✓ ${edition.slug}.json`)
}
const hb2026 = applyTeamEnrichment(buildJuryEdition(), enrichment)
fs.writeFileSync(path.join(OUT_DIR, 'hb01-2026.json'), JSON.stringify(hb2026, null, 2) + '\n')
console.log('✓ hb01-2026.json')
const annual = buildAnnualRanking(source)
fs.writeFileSync(path.join(OUT_DIR, '2025-ranking-anual.json'), JSON.stringify(annual, null, 2) + '\n')
console.log('✓ 2025-ranking-anual.json')
